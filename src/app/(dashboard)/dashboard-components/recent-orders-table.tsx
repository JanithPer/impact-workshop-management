"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { RepairOrder, columns } from "./recent-orders-columns";
import { useRouter } from 'next/navigation';

const fetchRecentRepairOrders = async (): Promise<RepairOrder[]> => {
  // Fetch all and slice the most recent 5.
  // For better performance, your API should support pagination and sorting.
  const response = await api.get('/repair-orders?limit=5&sort=-createdAt');
  return response.data.data.map((order: any) => ({
    ...order,
    customer: order.customer || { _id: '', name: 'N/A' }
  }));
};

export default function RecentOrdersTable() {
  const { data: recentOrders = [], isLoading, error } = useQuery<RepairOrder[]>({
    queryKey: ['recent-repair-orders'],
    queryFn: fetchRecentRepairOrders
  });

  const table = useReactTable({
    data: recentOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div className="p-4">Loading recent orders...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading recent orders: {(error as Error).message}</div>;

  return (
    <div className="w-full">
        <h3 className="text-lg font-semibold p-4">Recent Orders</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const router = useRouter();
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => router.push(`/orders/repair-orders/${row.original._id}`)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No recent orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}