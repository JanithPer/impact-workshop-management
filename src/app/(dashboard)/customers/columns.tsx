"use client"

import React, { useState } from 'react';
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditCustomerDialog } from "./edit-customer-dialog"; // Import the EditCustomerDialog component

export type Customer = {
  _id: string
  name: string
  address: string
  email: string
  phone: string
}

// Define CellComponent outside of columns definition to use hooks
const ActionsCell: React.FC<{ row: any }> = ({ row }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customer = row.original as Customer;

  const handleEditClick = () => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  // TODO: Implement Delete functionality - likely needs mutation from parent
  const handleDeleteClick = () => {
    console.log("Delete clicked for:", customer._id); // Placeholder
    // Typically, you'd call a function passed down via props to trigger deletion
    // e.g., props.onDelete(customer._id);
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEditClick}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* Delete option can be added here if handled individually */}
          {/* <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">Delete</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCustomerDialog
        customer={selectedCustomer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
};

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />, // Use the ActionsCell component
  },
]