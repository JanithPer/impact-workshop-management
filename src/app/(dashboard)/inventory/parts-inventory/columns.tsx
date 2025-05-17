"use client"

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
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PartsInventory = {
  _id: string;
  serviceType: "sell" | "buy";
  part: {
    _id: string;
    name: string;
  };
  entryDate: string; // Assuming it's a string date from backend, will format in cell
  recordedBy: {
    _id: string;
    name: string;
  };
  numberOfParts: number;
};

export const columns: ColumnDef<PartsInventory>[] = [
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
    accessorKey: "serviceType",
    header: "Service Type",
    cell: ({ row }) => {
      const serviceType = row.getValue("serviceType") as string

      return (
        <Badge variant={serviceType === 'sell' ? "destructive" : "default"}><span className="p-1 px-2 capitalize">{serviceType}</span></Badge>
      )
    },
  },
  {
    accessorKey: "part.name", // Access nested data
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Part Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
      const part = row.original.part;
      return <div>{part.name}</div>;
    },
  },
  {
    accessorKey: "entryDate",
    header: "Entry Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("entryDate"));
      const formattedDate = date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "recordedBy.name", // Access nested data
    header: "Recorded By",
    cell: ({ row }) => {
      const recordedBy = row.original.recordedBy;
      return <div>{recordedBy.name}</div>;
    },
  },
  {
    accessorKey: "numberOfParts",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Parts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const partsinventory = row.original
 
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(partsinventory._id)}
  //           >
  //             Edit
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Delete</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
