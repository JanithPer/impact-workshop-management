"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios" // Assuming your axios instance is in lib/axios.ts
import { ChartConfig } from "@/components/ui/chart"
import { BarChartComponent } from "./charts/bar-chart-component" // Adjust path if needed

// Define the structure of a Part based on your Mongoose model
interface Part {
  _id: string;
  name: string;
  partNumber: string;
  currentStock: number;
  lowStockValue: number;
  costPrice?: number;
}

// Function to fetch parts data from your API
const getParts = async (): Promise<Part[]> => {
  const response = await api.get("/parts");
  return response.data.data; // The controller returns data in a 'data' property
}

export function PartsStockChart() {
  const { data: partsData, isLoading, isError, error } = useQuery({
    queryKey: ["parts"],
    queryFn: getParts,
  });

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data: {error.message}</div>
  }

  // Process the data for the chart, using 'name' for the label and 'currentStock' for the value
  const chartData = partsData?.map(part => ({
    name: part.name,
    stock: part.currentStock,
  })) || [];

  // Define the chart configuration for the 'stock' data key
  const chartConfig = {
    stock: {
      label: "Stock",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <BarChartComponent
      data={chartData}
      chartConfig={chartConfig}
      title="Current Part Stock"
      description="Current stock levels for each part"
      dataKey="stock"
      xAxisKey="name"
    />
  )
}