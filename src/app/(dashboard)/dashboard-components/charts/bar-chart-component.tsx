"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

interface BarChartProps {
  data: any[];
  chartConfig: ChartConfig;
  title: string;
  description: string;
  dataKey: string;
  xAxisKey: string;
}

export function BarChartComponent({ data, chartConfig, title, description, dataKey, xAxisKey }: BarChartProps) {
  const isScrollable = data.length > 7;

  // Style for the div that WRAPS the chart. It enables horizontal scrolling.
  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    overflowX: isScrollable ? "auto" : "hidden", // Only allow scroll when there are many items
  };

  // Style for the chart component ITSELF.
  const chartStyle: React.CSSProperties = {
    height: "180px",
    width: isScrollable ? `${data.length * 60}px` : "100%", // Be responsive by default, and expand when scrollable.
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div style={wrapperStyle}>
          <ChartContainer config={chartConfig} style={chartStyle}>
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total inventory items
        </div>
      </CardFooter>
    </Card>
  )
}