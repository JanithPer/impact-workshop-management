"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from 'sonner';
import PageHeader from "@/components/blocks/page-header";
import PageTitle from "@/components/blocks/page-title";
import RepairOrdersTableClient from "./repair-orders-table-client";
import { DeleteRepairOrdersDialog } from "./delete-repair-orders-dialog";
import { AddRepairOrderDialog } from "./add-repair-order-dialog";
import { RepairOrder } from "./columns";

const RepairOrdersPage = () => {
  const [selectedRepairOrders, setSelectedRepairOrders] = useState<RepairOrder[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // Edit dialog state is managed within RepairOrdersTableClient
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Use the bulk delete endpoint
      await api.delete('/repair-orders', { data: { ids } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      const count = selectedRepairOrders.length;
      setSelectedRepairOrders([]);
      toast.success(`${count} repair order${count !== 1 ? 's' : ''} deleted successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete repair orders. Please try again.';
      toast.error(errorMessage);
      console.error("Error deleting repair orders:", error);
    }
  });

  return (
    <div>
      <PageHeader firstLinkName="Orders" secondLinkName="Repair Orders" />
      <PageTitle
        name="Repair Orders"
        onAdd={() => setAddDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        deleteDisabled={selectedRepairOrders.length === 0}
      />
      {/* Pass selection handler to the table client */}
      <RepairOrdersTableClient onSelectionChange={setSelectedRepairOrders} />
      
      {/* Delete Confirmation Dialog */}
      <DeleteRepairOrdersDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedRepairOrders.map(ro => ro._id));
          setDeleteDialogOpen(false);
        }}
        count={selectedRepairOrders.length}
      />
      
      {/* Add Repair Order Dialog */}
      <AddRepairOrderDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
      />
      
      {/* Edit Repair Order Dialog is rendered inside RepairOrdersTableClient */}
    </div>
  );
};

export default RepairOrdersPage;