"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DataTable } from "@/components/blocks/data-table"
import { columns, Customer } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"

interface CustomersTableClientProps {
  onSelectionChange: (selectedCustomers: Customer[]) => void;
}

const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("/customers")
  // Assuming the backend returns { message: '...', data: [...] }
  return response.data.data
}

const CustomersTableClient: React.FC<CustomersTableClientProps> = ({ onSelectionChange }) => {
  const { data: customers, isLoading, error } = useQuery<Customer[]>({ // Changed queryKey and fetch function
    queryKey: ['customers'],
    queryFn: fetchCustomers,
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
    return <div className="container mx-auto px-4 text-red-500">Error loading customers.</div> // Updated error message
  }

  return (
    <div className="container mx-auto px-4">
      <DataTable
        columns={columns} // Using customer columns
        data={customers || []} // Using customer data
        filterColumn="name" // Assuming filtering by name is desired
        onSelectionChange={onSelectionChange}
      />
    </div>
  )
}

export default CustomersTableClient