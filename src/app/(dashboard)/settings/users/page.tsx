import PageHeader from "@/components/blocks/page-header"
import PageTitle from "@/components/blocks/page-title"
import UsersTableClient from "./users-table-client"

const UsersPage = () => {
  return (
    <div>
      <PageHeader firstLinkName="Settings" secondLinkName="Users" />
      <PageTitle name="Users" />
      <UsersTableClient />
    </div>
  )
}

export default UsersPage