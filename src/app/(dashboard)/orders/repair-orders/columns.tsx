"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Define the Customer type based on the backend model (only name is needed)
export type Customer = {
  _id: string;
  name: string;
  // Add other customer fields if needed elsewhere
};

// Define the RepairOrder type based on the backend schema
export type RepairOrder = {
  _id: string;
  customer: Customer; // Use the Customer type
  registrationNumber: string;
  kilometers: number;
  vin: string;
  dealAmount?: number;
  dateBooked: string; // Use string for date display, format later if needed
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the props for the CellContext to include edit handling
interface RepairOrderCellContextProps {
  row: any; // Adjust type as per tanstack-table documentation if needed
  openEditDialog: (repairOrder: RepairOrder) => void;
}

export const columns = (/* openEditDialog: (repairOrder: RepairOrder) => void */): ColumnDef<RepairOrder>[] => [ // openEditDialog removed as edit is on detail page
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "customer.name", // Explicit ID
    accessorKey: "customer.name", // Access nested customer name
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.customer.name}</div>,
  },
  {
    accessorKey: "registrationNumber",
    header: "Reg Number",
  },
  {
    accessorKey: "kilometers",
    header: "Kilometers",
  },
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "dealAmount",
    header: () => <div className="text-right">Deal Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("dealAmount") || '0')
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // Adjust currency as needed
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "dateBooked",
    header: "Date Booked",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateBooked"))
      const formatted = date.toLocaleDateString() // Simple date format
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const repairOrder = row.original
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
          await api.delete(`/repair-orders/${id}`);
        },
        onSuccess: () => {
          toast.success('Repair order deleted successfully!');
          queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Failed to delete repair order.';
          toast.error(errorMessage);
          console.error("Error deleting repair order:", error);
        },
      });

      const handleDelete = () => {
        // Optional: Add a confirmation dialog here if needed for single delete
        deleteMutation.mutate(repairOrder._id);
      };

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
              onClick={() => navigator.clipboard.writeText(repairOrder._id)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => openEditDialog(repairOrder)}>Edit Order</DropdownMenuItem> */}
            {/* Edit Order functionality is now on the detail page */}
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">Delete Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]