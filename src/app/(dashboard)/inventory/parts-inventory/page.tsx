"use client";

import { useState, useEffect } from 'react'; // Added
import PageTitle from "@/components/blocks/page-title";
import { PartsInventory, columns } from "./columns";
import { PartsInventoryTableClient } from "./parts-inventory-table-client";
import PageHeader from "@/components/blocks/page-header";
import { AddInventoryDialog } from './add-inventory-dialog'; // Added

async function getPartsInventoryData(): Promise<PartsInventory[]> {
  // Fetch data from your API endpoint
  // Replace with your actual API call
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, { // Make sure NEXT_PUBLIC_API_URL is set in your .env.local
      cache: "no-store", // Or 'force-cache' or 'default' depending on your needs
    });
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch parts inventory data');
    }
    const responseJson = await res.json();
    // Assuming your API returns data in a 'data' field like: { message: '...', data: [...] }
    // And that each item in 'data' matches the PartsInventory type structure
    // (especially part.name and recordedBy.name)
    return responseJson.data as PartsInventory[]; 
  } catch (error) {
    console.error("Error fetching parts inventory:", error);
    return []; // Return empty array on error or handle appropriately
  }
}

export default function PartsInventoryPage() { // Changed from async function
  const [data, setData] = useState<PartsInventory[]>([]); // Added for client-side data handling
  const [addDialogOpen, setAddDialogOpen] = useState(false); // Added

  // Fetch data on component mount and when addDialogOpen becomes false (after adding new item)
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getPartsInventoryData();
      setData(fetchedData);
    }
    fetchData();
  }, [addDialogOpen]); // Re-fetch when dialog closes after potential add

  return (
    <div>
      <PageHeader firstLinkName="Parts Inventory" secondLinkName="Inventory" />
      <PageTitle
        name="Parts Inventory"
        onAdd={() => setAddDialogOpen(true)} // Added
      />
      <div className="px-4">
      <PartsInventoryTableClient columns={columns} data={data} />
      </div>
      <AddInventoryDialog // Added
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </div>
  );
}