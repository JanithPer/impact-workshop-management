"use client";

import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import PageTitle from "@/components/blocks/page-title";
import { PartsInventory, columns } from "./columns";
import { PartsInventoryTableClient } from "./parts-inventory-table-client";
import PageHeader from "@/components/blocks/page-header";
import { AddInventoryDialog } from './add-inventory-dialog';
import { DeleteInventoriesDialog } from './delete-inventories-dialog'; // Added
import { api } from '@/lib/axios';
import { toast } from 'sonner'; // Added

// Removed getPartsInventoryData function

export default function PartsInventoryPage() {
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Added
  const [selectedInventories, setSelectedInventories] = useState<PartsInventory[]>([]); // Added

  const { data: partsInventoryData = [], isLoading, error } = useQuery<PartsInventory[], Error>({
    queryKey: ['partsInventory'],
    queryFn: async () => {
      const response = await api.get('/inventory');
      return response.data.data; // Assuming your API returns data in a 'data' field
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await api.delete('/inventory', { data: { ids } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partsInventory'] });
      const count = selectedInventories.length;
      setSelectedInventories([]);
      toast.success(`${count} inventory item${count !== 1 ? 's' : ''} deleted successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete inventory items. Please try again.';
      toast.error(errorMessage);
      console.error("Error deleting inventory items:", error);
    }
  });

  const handleDialogClose = (open: boolean) => {
    setAddDialogOpen(open);
    if (!open) {
      // Invalidate and refetch the query when the dialog closes after a potential add
      queryClient.invalidateQueries({ queryKey: ['partsInventory'] });
    }
  };

  if (isLoading) return <div>Loading...</div>; // Added loading state
  if (error) return <div>Error fetching data: {error.message}</div>; // Added error state

  return (
    <div>
      <PageHeader firstLinkName="Parts Inventory" secondLinkName="Inventory" />
      <PageTitle
        name="Parts Inventory"
        onAdd={() => setAddDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)} // Added
        deleteDisabled={selectedInventories.length === 0} // Added
      />
      <div className="px-4">
      <PartsInventoryTableClient 
        columns={columns} 
        data={partsInventoryData} 
        onSelectionChange={setSelectedInventories} // Added
      />
      </div>
      <AddInventoryDialog
        open={addDialogOpen}
        onOpenChange={handleDialogClose}
      />
      <DeleteInventoriesDialog // Added
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedInventories.map(item => item._id));
          setDeleteDialogOpen(false);
        }}
        count={selectedInventories.length}
      />
    </div>
  );
}