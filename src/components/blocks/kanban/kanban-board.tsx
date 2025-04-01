'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { StatusColumn } from './status-column'
import { TaskCard } from './task-card'
import { Task, tasks as initialTasks } from '@/app/(dashboard)/kanban/data'

export function KanbanBoard({ initialData = initialTasks }: { initialData?: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialData)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const statuses: Task['status'][] = ['todo', 'in-progress', 'done']

  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveTask(null)
    
    if (!over) return

    const activeTask = tasks.find(task => task.id === active.id)
    if (!activeTask) return

    const overId = over.id
    const isOverColumn = statuses.includes(overId as Task['status'])

    if (isOverColumn) {
      setTasks(tasks.map(task => 
        task.id === active.id 
          ? { ...task, status: overId as Task['status'] }
          : task
      ))
      return
    }

    const overTask = tasks.find(task => task.id === overId)
    if (!overTask) return

    if (activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex(task => task.id === active.id)
      const newIndex = tasks.findIndex(task => task.id === over.id)
      setTasks(arrayMove(tasks, oldIndex, newIndex))
    } else {
      const newTasks = tasks.map(task => 
        task.id === active.id 
          ? { ...task, status: overTask.status }
          : task
      )
      const oldIndex = newTasks.findIndex(task => task.id === active.id)
      const newIndex = newTasks.findIndex(task => task.id === over.id)
      setTasks(arrayMove(newTasks, oldIndex, newIndex))
    }
  }

  const addTask = (status: Task['status'], title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status,
      assignedPeople: [],
      colorMode: 'info'
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 p-4 min-w-[800px] max-[800px]:flex-nowrap">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {statuses.map(status => (
            <StatusColumn
              key={status}
              status={status}
              tasks={tasks.filter(task => task.status === status)}
              addTask={addTask}
              deleteTask={deleteTask}
            />
          ))}
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} deleteTask={() => {}} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}