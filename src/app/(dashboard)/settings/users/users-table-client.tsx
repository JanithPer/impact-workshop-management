"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DataTable } from "@/components/blocks/data-table"
import { columns, User } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"

interface UsersTableClientProps {
  onSelectionChange: (selectedUsers: User[]) => void;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get("/users")
  return response.data.data
}

const UsersTableClient: React.FC<UsersTableClientProps> = ({ onSelectionChange }) => {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="container mx-auto px-4 text-red-500">Error loading users.</div>
  }

  return (
    <div className="container mx-auto px-4">
      <DataTable
        columns={columns}
        data={users || []}
        filterColumn="name"
        onSelectionChange={onSelectionChange}
      />
    </div>
  )
}

export default UsersTableClient