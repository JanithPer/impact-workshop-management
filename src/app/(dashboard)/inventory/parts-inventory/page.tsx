import PageTitle from "@/components/blocks/page-title";
import { PartsInventory, columns } from "./columns";
import { PartsInventoryTableClient } from "./parts-inventory-table-client";
import PageHeader from "@/components/blocks/page-header";

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

export default async function PartsInventoryPage() {
  const data = await getPartsInventoryData();

  return (
    <div>
      <PageHeader firstLinkName="Parts Inventory" secondLinkName="Inventory" />
      <PageTitle
        name="Parts Inventory"
      />
      <div className="px-4">
      <PartsInventoryTableClient columns={columns} data={data} />
      </div>
    </div>
  );
}