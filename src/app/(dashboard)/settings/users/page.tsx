import PageHeader from "@/components/blocks/page-header"
import { User, columns } from "./columns"
import PageTitle from "@/components/blocks/page-title"
import { DataTable } from "@/components/blocks/data-table"

async function getData(): Promise<User[]>{
 return[
    {
        id: "aab001",
        avatar: "https://i.pinimg.com/736x/c0/a2/ca/c0a2ca2edf6d03227430d4fb639ba4aa.jpg",
        name: "Drew Heath",
        role: "Technician",
        email: "drewheath@impactworkshop.com",
    },
    {
      id: "aab002",
      avatar: "https://thebaffler.com/wp-content/uploads/2017/08/Flat800x800075f.jpg",
      name: "True",
      role: "Technician",
      email: "true@impactworkshop.com",
  },
 ]
}

const Users = async () => {
    const data = await getData()

  return (
    <div>
    <PageHeader firstLinkName="Orders" secondLinkName="Repair Orders" />
    <PageTitle name="Repair Orders" />
    <div className="container mx-auto px-4">
      <DataTable columns={columns} data={data} filterColumn="name" />
    </div>
    </div>
  )
}

export default Users