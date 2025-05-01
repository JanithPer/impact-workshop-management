"use client";

import PageHeader from "@/components/blocks/page-header"
import PageTitle from "@/components/blocks/page-title"
import CustomersTableClient from "./customers-table-client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DeleteCustomersDialog } from "./delete-customers-dialog"
import { AddCustomerDialog } from "./add-customer-dialog"
import { Customer } from "./columns"
import { toast } from 'sonner';

const CustomersPage = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Use the bulk delete endpoint if multiple IDs are provided
      if (ids.length > 1) {
        await api.delete('/customers', { data: { ids } });
      } else if (ids.length === 1) {
        await api.delete(`/customers/${ids[0]}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setSelectedCustomers([])
      toast.success(`${selectedCustomers.length} customer${selectedCustomers.length !== 1 ? 's' : ''} deleted successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete customers. Please try again.';
      toast.error(errorMessage);
      console.error("Error deleting customers:", error);
    }
  })

  return (
    <div>
      <PageHeader firstLinkName="Dashboard" secondLinkName="Customers" />
      <PageTitle
        name="Customers"
        onAdd={() => setAddDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        deleteDisabled={selectedCustomers.length === 0}
      />
      <CustomersTableClient onSelectionChange={setSelectedCustomers} />
      <DeleteCustomersDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedCustomers.map(c => c._id))
          setDeleteDialogOpen(false)
        }}
        count={selectedCustomers.length}
      />
      <AddCustomerDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  )
}

export default CustomersPage