// status-column.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTaskCard } from './task-card'
import { Task } from '../types/task'

export function StatusColumn({
  status,
  tasks,
  deleteTask,
}: {
  status: Task['status']
  tasks: Task[]
  deleteTask: (id: string) => void
}) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{status.replace('-', ' ')}</h2>
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