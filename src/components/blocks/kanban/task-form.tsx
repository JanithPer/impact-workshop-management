'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function TaskForm({ onSubmit }: { onSubmit: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSubmit(title, description)
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  )
}