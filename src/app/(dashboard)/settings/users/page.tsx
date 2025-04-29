"use client";

import PageHeader from "@/components/blocks/page-header"
import PageTitle from "@/components/blocks/page-title"
import UsersTableClient from "./users-table-client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { DeleteUsersDialog } from "./delete-users-dialog"
import { User } from "./columns"

const UsersPage = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => api.delete(`/users/${id}`)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelectedUsers([])
    }
  })

  return (
    <div>
      <PageHeader firstLinkName="Settings" secondLinkName="Users" />
      <PageTitle
        name="Users"
        onDelete={() => setDialogOpen(true)}
        deleteDisabled={selectedUsers.length === 0}
      />
      <UsersTableClient onSelectionChange={setSelectedUsers} />
      <DeleteUsersDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={() => {
          deleteMutation.mutate(selectedUsers.map(u => u._id))
          setDialogOpen(false)
        }}
        count={selectedUsers.length}
      />
    </div>
  )
}

export default UsersPage