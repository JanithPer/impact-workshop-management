// src/app/dashboard/dashboard-components/kanban-status-pie-chart.tsx

"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { ChartConfig } from "@/components/ui/chart"
import { PieChartComponent } from "./charts/pie-chart-component"

interface Task {
    _id: string;
    name: string;
    status: 'todo' | 'in-progress' | 'done';
}

const getKanbanTasks = async (): Promise<Task[]> => {
    const response = await api.get("/tasks/kanban");
    return response.data;
}

export function KanbanStatusPieChart() {
    const { data: tasksData, isLoading, isError, error } = useQuery({
        queryKey: ["kanbanTasks"],
        queryFn: getKanbanTasks,
    });

    // Define the chart configuration first to use it in data mapping
    const chartConfig = {
        "todo": {
            label: "To Do",
            color: "hsl(var(--chart-1))", // Using HSL variables from shadcn/ui
        },
        "in-progress": {
            label: "In Progress",
            color: "hsl(var(--chart-2))", // Using HSL variables from shadcn/ui
        },
        "done": {
            label: "Done",
            color: "hsl(var(--chart-3))", // Using HSL variables from shadcn/ui
        },
    } satisfies ChartConfig

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching data: {error.message}</div>
    }

    const statusCounts = tasksData?.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<'todo' | 'in-progress' | 'done', number>);

    // --- FIX IS HERE ---
    // Add the 'fill' property to each object using the chartConfig
    const chartData = Object.entries(statusCounts || {}).map(([status, count]) => ({
        status,
        count,
        fill: chartConfig[status as keyof typeof chartConfig]?.color,
    }));

    return (
        <PieChartComponent
            data={chartData}
            chartConfig={chartConfig}
            title="Kanban Task Status"
            description="Distribution of tasks by status"
            dataKey="count"
            nameKey="status"
        />
    )
}