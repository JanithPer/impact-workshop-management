"use client";

import PageHeader from "@/components/blocks/page-header";
import PageTitle from "@/components/blocks/page-title";
import PartsTableClient from "./parts-table-client"; // To be created
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { DeletePartsDialog } from "./delete-parts-dialog"; // To be created
import { AddPartDialog } from "./add-part-dialog"; // To be created
import { Part } from "./columns"; // To be created
import { toast } from 'sonner';

const PartsPage = () => {
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // Edit dialog state will be added later when implementing edit functionality
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      // Use the bulk delete endpoint if multiple IDs are provided
      if (ids.length > 1) {
        // Assuming backend endpoint is '/parts' for bulk delete
        await api.delete('/parts', { data: { partIds: ids } });
      } else if (ids.length === 1) {
        // Assuming backend endpoint is '/parts/:id' for single delete
        await api.delete(`/parts/${ids[0]}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] }); // Use 'parts' query key
      setSelectedParts([]);
      toast.success(`${selectedParts.length} part${selectedParts.length !== 1 ? 's' : ''} deleted successfully!`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete parts. Please try again.';
      toast.error(errorMessage);
      console.error("Error deleting parts:", error);
    }
  });

  return (
    <div>
      <PageHeader firstLinkName="Inventory" secondLinkName="Parts" />
      <PageTitle
        name="Parts"
        onAdd={() => setAddDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        deleteDisabled={selectedParts.length === 0}
      />
      <div className="container mx-auto px-4">
        <PartsTableClient onSelectionChange={setSelectedParts} />
      </div> 
      <DeletePartsDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedParts.map(p => p._id));
          setDeleteDialogOpen(false);
        }}
        count={selectedParts.length}
      />
      <AddPartDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
      {/* EditPartDialog will be added here later */}
    </div>
  );
};

export default PartsPage;