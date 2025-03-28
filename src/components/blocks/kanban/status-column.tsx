'use client'

import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SortableTaskCard } from './task-card'
import { TaskForm } from './task-form'
import { Task } from '../types/task'

export function StatusColumn({
  status,
  tasks,
  addTask,
  deleteTask,
}: {
  status: Task['status']
  tasks: Task[]
  addTask: (status: Task['status'], title: string, description: string) => void
  deleteTask: (id: string) => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{status.replace('-', ' ')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={(title, description) => {
                addTask(status, title, description)
                setIsDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-4 min-h-[200px] ${
          tasks.length === 0 ? 'border-2 border-dashed border-gray-300 rounded-lg' : ''
        }`}
      >
        <SortableContext
          id={status}
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} deleteTask={deleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}