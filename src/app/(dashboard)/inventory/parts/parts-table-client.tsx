"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DataTable } from "@/components/blocks/data-table"
import { columns, Part } from "./columns"
import { EditPartDialog } from "./edit-part-dialog"; // To be created

interface PartsTableClientProps {
  onSelectionChange: (selectedParts: Part[]) => void;
}

const PartsTableClient: React.FC<PartsTableClientProps> = ({ onSelectionChange }) => {
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: partsData, isLoading, error } = useQuery({
    queryKey: ['parts'], // Use 'parts' query key
    queryFn: async () => {
      const response = await api.get('/parts'); // Assuming backend endpoint is '/parts'
      return response.data.data as Part[]; // Adjust based on your API response structure
    },
    refetchOnWindowFocus: false, // Optional: configure refetching behavior
  });

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setEditDialogOpen(true);
  };

  if (error) {
    // Handle error state, maybe show an error message
    console.error("Error fetching parts:", error);
    return <div>Error loading parts data. Please try again later.</div>;
  }

  // Pass the handleEdit function to the columns definition
  const tableColumns = columns(handleEdit);

  return (
    <>
      <DataTable<Part, any>
        columns={tableColumns}
        data={partsData || []} // Provide empty array as default if data is loading or undefined
        filterColumn="name" // Allow filtering by part name
        onSelectionChange={onSelectionChange}
      />
      {editingPart && (
        <EditPartDialog
          key={editingPart._id} // Ensure dialog remounts with new data
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          part={editingPart}
        />
      )}
    </>
  );
}

export default PartsTableClient;