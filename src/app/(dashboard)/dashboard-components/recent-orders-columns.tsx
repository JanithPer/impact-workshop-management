"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';

// Define the Customer type
export type Customer = {
  _id: string;
  name: string;
};

// Define the RepairOrder type
export type RepairOrder = {
  _id: string;
  customer: Customer;
  registrationNumber: string;
  dateBooked: string;
  dealAmount?: number;
}

export const columns: ColumnDef<RepairOrder>[] = [
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => <div>{row.original.customer.name}</div>,
  },
  {
    accessorKey: "registrationNumber",
    header: "Reg Number",
  },
  {
    accessorKey: "dealAmount",
    header: () => <div className="text-right">Deal Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("dealAmount") || '0')
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "dateBooked",
    header: "Date Booked",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateBooked"))
      const formatted = date.toLocaleDateString()
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const repairOrder = row.original
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/orders/repair-orders/${repairOrder._id}`)}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]