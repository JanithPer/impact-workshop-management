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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface PieChartProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
  description: string;
}

export function PieChartComponent({ data, title, description }: PieChartProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
              <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}