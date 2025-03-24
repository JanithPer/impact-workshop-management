import PageHeader from "@/components/blocks/page-header"
import { RepairOrder, columns } from "./columns"
import PageTitle from "@/components/blocks/page-title"
import { DataTable } from "@/components/blocks/data-table"

async function getData(): Promise<RepairOrder[]>{
 return[
    {
        id: "aab001",
        company_name: "South Coast Party Hire",
        registration_number: "AR40FN",
        km: 142265,
        vin: "JAANSKGJSDDAKFGJAFSDJOG",
        date_booked: "March 14, 2025",
        notes: "B service as required, front brake, rego check"
    },
    {
        id: "aab002",
        company_name: "SCPW",
        registration_number: "SSDG",
        km: 15662,
        vin: "SDGASFHGFSDH",
        date_booked: "May 3, 2025",
        notes: "B service"
    }
 ]
}

const RepairOrders = async () => {
    const data = await getData()

  return (
    <>
    <PageHeader firstLinkName="Orders" secondLinkName="Repair Orders" />
    <PageTitle name="Repair Orders" />
    <div className="container mx-auto px-4">
      <DataTable columns={columns} data={data} filterColumn="company_name" />
    </div>
    </>
  )
}

export default RepairOrders