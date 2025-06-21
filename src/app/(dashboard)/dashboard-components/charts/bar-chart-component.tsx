"use client"

import React from "react"
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"

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

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    overflowX: isScrollable ? "auto" : "hidden",
  };

  const chartStyle: React.CSSProperties = {
    height: "250px",
    width: isScrollable ? `${data.length * 60}px` : "100%",
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
                tickFormatter={(value: string) => {
                  if (value.length > 3) {
                    return `${value.slice(0, 3)}...`
                  }
                  return value
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded-lg border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-sm">
                        {`${label} : ${payload[0].value}`}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={8} />
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