"use client";

import PageHeader from "@/components/blocks/page-header"
import PageTitle from "@/components/blocks/page-title"
import UsersTableClient from "./users-table-client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DeleteUsersDialog } from "./delete-users-dialog"
import { AddUserDialog } from "./add-user-dialog"
import { User } from "./columns"
import { toast } from 'sonner'; // Import toast

const UsersPage = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => api.delete(`/users/${id}`)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelectedUsers([])
      toast.success(`${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''} deleted successfully!`); // Add success toast
    },
    onError: (error: any) => { // Optional: Add error handling
      const errorMessage = error.response?.data?.message || 'Failed to delete users. Please try again.';
      toast.error(errorMessage);
      console.error("Error deleting users:", error);
    }
  })

  return (
    <div>
      <PageHeader firstLinkName="Settings" secondLinkName="Users" />
      <PageTitle
        name="Users"
        onAdd={() => setAddDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
        deleteDisabled={selectedUsers.length === 0}
      />
      <UsersTableClient onSelectionChange={setSelectedUsers} />
      <DeleteUsersDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedUsers.map(u => u._id))
          setDeleteDialogOpen(false)
        }}
        count={selectedUsers.length}
      />
      <AddUserDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
      />
    </div>
  )
}

export default UsersPage