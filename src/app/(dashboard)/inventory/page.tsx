import PageHeader from "@/components/blocks/page-header"
import { PartsInventory, columns } from "./columns"
import PageTitle from "@/components/blocks/page-title"
import { DataTable } from "@/components/blocks/data-table"

async function getData(): Promise<PartsInventory[]>{
 return[
    {
        id: "1",
        service_type: "Sell",
        part_number: "VIN-1112",
        entry_date: "May 6, 2023 at 7:15 PM",
        recorded_by: "emma@autotechexperts.com"
      },
      {
        id: "2",
        service_type: "Sell",
        part_number: "FLT-2020",
        entry_date: "May 6, 2023 at 3:45 PM",
        recorded_by: "maya@reliancecorp.com"
      },
      {
        id: "3",
        service_type: "Sell",
        part_number: "VIN-1112",
        entry_date: "May 5, 2023 at 8:00 PM",
        recorded_by: "alex@certifiedtech.com"
      },
      {
        id: "4",
        service_type: "Sell",
        part_number: "VIN-6789",
        entry_date: "May 5, 2023 at 7:30 PM",
        recorded_by: "maya@reliancecorp.com"
      },
      {
        id: "5",
        service_type: "Sell",
        part_number: "LBR-2134",
        entry_date: "May 5, 2023 at 1:41 PM",
        recorded_by: "rachel@certifiedtech.com"
      },
      {
        id: "6",
        service_type: "Sell",
        part_number: "SPK-2707",
        entry_date: "May 5, 2023 at 1:41 PM",
        recorded_by: "sophia@reliancecorp.com"
      },
      {
        id: "7",
        service_type: "Sell",
        part_number: "FF-5678",
        entry_date: "May 4, 2023 at 7:48 PM",
        recorded_by: "alex@certifiedtech.com"
      },
      {
        id: "8",
        service_type: "Sell",
        part_number: "SPK-2707",
        entry_date: "May 4, 2023 at 5:45 PM",
        recorded_by: "emma@autotechexperts.com"
      },
      {
        id: "9",
        service_type: "Sell",
        part_number: "FF-5678",
        entry_date: "May 3, 2023 at 5:51 PM",
        recorded_by: "lucy@reliancecorp.com"
      },
      {
        id: "10",
        service_type: "Sell",
        part_number: "MTL-1818",
        entry_date: "May 3, 2023 at 4:30 PM",
        recorded_by: "sophia@reliancecorp.com"
      },
      {
        id: "11",
        service_type: "Sell",
        part_number: "BPK-2150",
        entry_date: "May 2, 2023 at 4:15 PM",
        recorded_by: "rachel@certifiedtech.com"
      },
      {
        id: "12",
        service_type: "Sell",
        part_number: "FF-3456",
        entry_date: "May 2, 2023 at 2:44 PM",
        recorded_by: "lucy@reliancecorp.com"
    }
 ]
}

const Inventory = async () => {
    const data = await getData()

  return (
    <>
    <PageHeader firstLinkName="Inventory" secondLinkName="Parts Inventory" />
    <PageTitle name="Parts Inventory" />
    <div className="container mx-auto px-4">
      <DataTable columns={columns} data={data} filterColumn="part_number" />
    </div>
    </>
  )
}

export default Inventory