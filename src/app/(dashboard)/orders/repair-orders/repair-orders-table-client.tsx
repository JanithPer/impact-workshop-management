"use client"

import * as React from "react"
import { 
  ColumnDef, 
  ColumnFiltersState, 
  SortingState, 
  VisibilityState, 
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { RepairOrder, columns as getColumns } from "./columns"; // Import RepairOrder type and columns function
import { EditRepairOrderDialog } from "./edit-repair-order-dialog"; // Import Edit dialog

interface RepairOrdersTableClientProps {
  onSelectionChange: (selectedRows: RepairOrder[]) => void;
}

const fetchRepairOrders = async (): Promise<RepairOrder[]> => {
  const response = await api.get('/repair-orders');
  // Ensure the data structure matches RepairOrder[], especially the nested customer object
  return response.data.data.map((order: any) => ({
    ...order,
    customer: order.customer || { _id: '', name: 'N/A' } // Handle potential null customer
  })); 
};

export default function RepairOrdersTableClient({ onSelectionChange }: RepairOrdersTableClientProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({}) 
  const [rowSelection, setRowSelection] = React.useState({})
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedRepairOrder, setSelectedRepairOrder] = React.useState<RepairOrder | null>(null);

  const { data: repairOrders = [], isLoading, error } = useQuery<RepairOrder[]>({ 
    queryKey: ['repair-orders'], 
    queryFn: fetchRepairOrders 
  });

  const openEditDialog = (repairOrder: RepairOrder) => {
    setSelectedRepairOrder(repairOrder);
    setIsEditDialogOpen(true);
  };

  // Memoize columns to prevent unnecessary re-renders
  const columns = React.useMemo(() => getColumns(openEditDialog), []);

  const table = useReactTable({
    data: repairOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    const selectedRowsData = table.getSelectedRowModel().rows.map(row => row.original);
    onSelectionChange(selectedRowsData);
  }, [rowSelection, table, onSelectionChange]);

  if (isLoading) return <div>Loading repair orders...</div>;
  if (error) return <div>Error loading repair orders: {(error as Error).message}</div>;

  return (
    <div className="w-full px-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by customer name..."
          value={(table.getColumn("customer.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customer.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {/* Handle nested accessor key display */} 
                    {column.id === 'customer.name' ? 'Customer' : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
      {/* Render Edit Dialog */} 
      {selectedRepairOrder && (
        <EditRepairOrderDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          repairOrder={selectedRepairOrder}
        />
      )}
    </div>
  )
}