"use client";

import { useState } from 'react'; // Removed useEffect
import { useQuery, useQueryClient } from '@tanstack/react-query'; // Added
import PageTitle from "@/components/blocks/page-title";
import { PartsInventory, columns } from "./columns";
import { PartsInventoryTableClient } from "./parts-inventory-table-client";
import PageHeader from "@/components/blocks/page-header";
import { AddInventoryDialog } from './add-inventory-dialog';
import { api } from '@/lib/axios'; // Added

// Removed getPartsInventoryData function

export default function PartsInventoryPage() {
  const queryClient = useQueryClient(); // Added
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data: partsInventoryData = [], isLoading, error } = useQuery<PartsInventory[], Error>({
    queryKey: ['partsInventory'],
    queryFn: async () => {
      const response = await api.get('/inventory');
      return response.data.data; // Assuming your API returns data in a 'data' field
    },
  });

  // Removed useEffect for fetching data

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
      />
      <div className="px-4">
      <PartsInventoryTableClient columns={columns} data={partsInventoryData} />
      </div>
      <AddInventoryDialog
        open={addDialogOpen}
        onOpenChange={handleDialogClose} // Updated to use handleDialogClose
      />
    </div>
  );
}