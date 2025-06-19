"use client"

import * as React from "react"
import { Pie, PieChart, Sector } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface PieChartProps {
    data: any[];
    chartConfig: ChartConfig;
    title: string;
    description: string;
    dataKey: string;
    nameKey: string;
}

export function PieChartComponent({ data, chartConfig, title, description, dataKey, nameKey }: PieChartProps) {
    const chartRef = React.useRef<HTMLDivElement>(null)

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                    ref={chartRef}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {data.map((entry, index) => (
                                <Sector
                                    key={`sector-${index}`}
                                    fill={entry.fill}
                                    />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}