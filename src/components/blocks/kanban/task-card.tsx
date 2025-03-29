'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Move, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Task } from '../types/task'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils' // assuming you're using tailwind classnames utility

// Define the color modes and their corresponding colors
const colorModes = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
} as const

type ColorMode = keyof typeof colorModes

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
  task: Task & { colorMode?: ColorMode } // Add colorMode to Task type or make it optional
  deleteTask: (id: string) => void
  listeners?: any
}) {
  // Default to 'info' if no colorMode is provided
  const colorMode = task.colorMode || 'info'
  const colorClass = colorModes[colorMode]

  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Color strip */}
      <div className={cn(
        'absolute left-0 top-0 h-full w-1.5',
        colorClass
      )} />
      
      <div className='flex justify-between pl-2'> {/* Added pl-2 to account for the color strip */}
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage 
              src={task.avatar} 
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
      <p className="text-sm text-muted-foreground pl-2">{task.description}</p> {/* Added pl-2 here as well */}
    </Card>
  )
}