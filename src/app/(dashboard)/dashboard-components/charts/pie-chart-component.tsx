"use client"

import React from "react"
import { 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Cell, 
  Tooltip, 
  Legend 
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SquareArrowOutUpRight } from "lucide-react";

const COLORS = ["var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p>{`${data.name}: ${data.value} tasks`}</p>
        </div>
      );
    }
    return null;
  };

export function PieChartComponent({ data, title }: PieChartProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1.5">
            Go To Kanban <SquareArrowOutUpRight className="h-4 w-4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip content={CustomTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}