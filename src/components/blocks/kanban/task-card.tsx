'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Move, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Task, Person } from '@/types/task' // Updated import
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import Link from 'next/link'

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
  } = useSortable({ id: task._id })

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
  task: Task // colorMode is now part of Task type
  deleteTask: (id: string) => void
  listeners?: any
}) {
  const [isChecked, setIsChecked] = useState(false)
  const colorMode = task.colorMode || 'info'
  const colorClass = colorModes[colorMode]

  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Color strip */}
      <div className={cn(
        'absolute left-0 top-0 h-full w-1.5',
        colorClass
      )} />
      
      <div className='flex justify-between pl-2'>
        <div className='flex flex-col gap-2 w-full'>
        <Link href={`/orders/job/task/${task._id}`} passHref>
            <h3 className="text-lg font-semibold cursor-pointer hover:underline">
              {task.name} {/* Changed from title to name */}
            </h3>
        </Link>
          
          {task.assignedPeople && task.assignedPeople.length > 0 && (
            <div className="flex items-center gap-0.5">
              {task.assignedPeople.map((person: Person) => (
                <Avatar key={person._id} className="h-8 w-8"> {/* Changed person.id to person._id */}
                  <AvatarImage 
                    src={person.avatar?.url || '/default-avatar.png'} 
                    alt={person.name}
                  />
                </Avatar>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7 cursor-grab active:cursor-grabbing"
            {...listeners}
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7"
            onClick={() => deleteTask(task._id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground pl-2 mt-2">{task.description}</p>
    </Card>
  )
}