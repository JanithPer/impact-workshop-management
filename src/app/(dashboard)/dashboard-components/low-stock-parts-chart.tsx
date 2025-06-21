"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { SquareArrowOutUpRight } from "lucide-react"
import React from "react"
import Link from "next/link"

// Define the structure of a Part based on your Mongoose model
interface Part {
  _id: string;
  name: string;
  partNumber: string;
  currentStock: number;
  lowStockValue: number;
  costPrice?: number;
}

// Function to fetch low stock parts data from your API
const getLowStockParts = async (): Promise<Part[]> => {
  const response = await api.get("/parts/low-stock");
  return response.data.data;
}

export function LowStockPartsChart() {
  const { data: lowStockPartsData, isLoading, isError, error } = useQuery({
    queryKey: ["lowStockParts"],
    queryFn: getLowStockParts,
  });

  if (isLoading) {
    return <div>Loading low stock parts...</div>
  }

  if (isError) {
    return <div>Error fetching low stock data: {error.message}</div>
  }

  // Process the data for the chart
  const chartData = lowStockPartsData?.map(part => ({
    name: part.name,
    currentStock: part.currentStock,
    lowStockValue: part.lowStockValue,
  })) || [];

  // Define the chart configuration for 'currentStock' and 'lowStockValue' data keys
  const chartConfig = {
    currentStock: {
      label: "Current Stock",
      color: "var(--chart-1)",
    },
    lowStockValue: {
      label: "Low Stock Value",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const isScrollable = chartData.length > 7;

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    overflowX: isScrollable ? "auto" : "hidden",
  };

  const chartStyle: React.CSSProperties = {
    height: "250px",
    width: isScrollable ? `${chartData.length * 80}px` : "100%", // Adjusted width for two bars
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Low Stock Parts</CardTitle>
        <CardDescription>Current stock vs. low stock threshold for parts running low</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div style={wrapperStyle}>
          <ChartContainer config={chartConfig} style={chartStyle}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="currentStock" fill="var(--color-currentStock)" radius={4} />
              <Bar dataKey="lowStockValue" fill="var(--color-lowStockValue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <Link href="/inventory/parts" className="inline-block">
            <div className="flex items-center gap-1.5 text-sm">
              Go To Stock <SquareArrowOutUpRight className="h-4 w-4" />
            </div>
          </Link>
      </CardFooter>
    </Card>
  )
}