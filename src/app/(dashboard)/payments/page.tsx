import PageHeader from "@/components/blocks/page-header"
import { Payment, columns } from "./columns"
import PageTitle from "@/components/blocks/page-title"
import { DataTable } from "@/components/blocks/data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "a@example.com",
    },
    {
      id: "728ed53f",
      amount: 20,
      status: "pending",
      email: "b@example.com",
    },
    {
      id: "728ed54f",
      amount: 500,
      status: "success",
      email: "c@example.com",
    },
    {
      id: "728ed55f",
      amount: 250,
      status: "processing",
      email: "d@example.com",
    },
    {
      id: "728ed56f",
      amount: 320,
      status: "failed",
      email: "e@example.com",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <>
    <PageHeader firstLinkName="Payments" secondLinkName="All Payments" />
    <PageTitle name="Payments" />
    <div className="container mx-auto px-4">
      <DataTable columns={columns} data={data} filterColumn="email" />
    </div>
    </>
  )
}
