'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Move, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Task } from '../types/task'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

export function SortableTaskCard({ task, deleteTask }: { task: Task; deleteTask: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard task={task} deleteTask={deleteTask} listeners={listeners} />
    </div>
  )
}

export function TaskCard({
  task,
  deleteTask,
  listeners,
}: {
  task: Task
  deleteTask: (id: string) => void
  listeners?: any
}) {
  return (
    <Card className="p-4">
      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage 
              src="https://i.pinimg.com/736x/c0/a2/ca/c0a2ca2edf6d03227430d4fb639ba4aa.jpg" 
            />
          </Avatar>
          <h3 className="font-medium">{task.title}</h3>
        </div>
        
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7 cursor-grab active:cursor-grabbing"
            {...listeners}
          >
            <Move />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7"
            onClick={() => deleteTask(task.id)}
          >
            <Trash />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{task.description}</p>
    </Card>
  )
}