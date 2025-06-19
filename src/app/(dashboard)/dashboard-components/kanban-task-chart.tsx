"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PieChartComponent } from "./charts/pie-chart-component" // We'll create this component

interface KanbanTask {
  status: 'todo' | 'in-progress' | 'done';
}

const getKanbanTasks = async (): Promise<KanbanTask[]> => {
  const response = await api.get("/tasks/kanban");
  return response.data; // Array of Kanban tasks
}

export function KanbanTasksChart() {
  const { data: kanbanTasks, isLoading, isError, error } = useQuery({
    queryKey: ["kanbanTasks"],
    queryFn: getKanbanTasks,
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>
  }

  // Count tasks by status
  const statusCounts = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };

  kanbanTasks?.forEach(task => {
    statusCounts[task.status]++;
  });

  // Prepare data for pie chart
  const chartData = [
    { name: "To Do", value: statusCounts.todo },
    { name: "In Progress", value: statusCounts['in-progress'] },
    { name: "Done", value: statusCounts.done },
  ];

  return (
    <PieChartComponent
      data={chartData}
      title="Kanban Tasks Status"
    />
  )
}