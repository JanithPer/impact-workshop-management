"use client"

import { useQuery } from "@tanstack/react-query"
import { User, columns } from "./columns"
import { DataTable } from "@/components/blocks/data-table"
import { api } from "@/lib/axios"

const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<{ message: string; data: User[] }>('/users');
  return response.data.data;
};

export default function UsersTableClient() {
  const { data, isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <div className="container mx-auto px-4">Loading users...</div>;
  }

  if (isError) {
    console.error("Failed to fetch users:", error);
    return <div className="container mx-auto px-4 text-red-600">Error: {error.message || "An error occurred while fetching users."}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <DataTable columns={columns} data={data ?? []} filterColumn="name" />
    </div>
  )
}