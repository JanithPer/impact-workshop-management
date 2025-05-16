'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCorners, Active, Over } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { StatusColumn } from './status-column'
import { TaskCard } from './task-card'
import { Task, TaskStatus } from '../types/task' // Updated import
import { api } from '@/lib/axios' // Import API instance

export function KanbanBoard() { // Removed initialData prop
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const statuses: TaskStatus[] = ['todo', 'in-progress', 'done']

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get<Task[]>('/tasks/kanban')
        setTasks(response.data)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        // Handle error (e.g., show a notification to the user)
      }
    }
    fetchTasks()
  }, [])

  const handleDragStart = (event: { active: Active }) => {
    const task = tasks.find(t => t._id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: { active: Active; over: Over | null }) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const currentActiveTask = tasks.find(task => task._id === active.id)
    if (!currentActiveTask) return

    const overId = over.id.toString() // Ensure overId is a string

    // Scenario 1: Dragging over a status column
    if (statuses.includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus
      if (currentActiveTask.status !== newStatus) {
        try {
          await api.patch(`/tasks/${currentActiveTask._id}/kanban`, { status: newStatus })
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === active.id ? { ...task, status: newStatus } : task
            )
          )
        } catch (error) {
          console.error('Failed to update task status:', error)
          // Optionally revert or show error
        }
      }
      return
    }

    // Scenario 2: Dragging over another task card
    const overTask = tasks.find(task => task._id === overId)
    if (!overTask) return

    // If dragging within the same column, reorder
    if (currentActiveTask.status === overTask.status) {
      const oldIndex = tasks.findIndex(task => task._id === active.id)
      const newIndex = tasks.findIndex(task => task._id === overId)
      if (oldIndex !== newIndex) {
        setTasks(prevTasks => arrayMove(prevTasks, oldIndex, newIndex))
        // Note: Backend reordering might be complex and is not handled here.
        // This only updates frontend order.
      }
    } else {
      // If dragging to a different column (implicitly by dropping on a task in that column)
      const newStatus = overTask.status
      try {
        await api.patch(`/tasks/${currentActiveTask._id}/kanban`, { status: newStatus })
        // Update local state: move task and change its status
        setTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task =>
            task._id === active.id ? { ...task, status: newStatus } : task
          )
          // Reorder within the new column if necessary (simplified here)
          const oldIdx = updatedTasks.findIndex(t => t._id === active.id)
          const newIdx = updatedTasks.findIndex(t => t._id === overId)
          return arrayMove(updatedTasks, oldIdx, newIdx) 
        })
      } catch (error) {
        console.error('Failed to update task status and reorder:', error)
      }
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}/kanban`, { onKanban: false })
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))
    } catch (error) {
      console.error('Failed to delete task (set onKanban to false):', error)
      // Handle error
    }
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
              tasks={tasks.filter(task => task.status === status && task.onKanban)}
              deleteTask={deleteTask}
            />
          ))}
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} deleteTask={() => {}} /> // deleteTask in DragOverlay might not be fully functional as it's a snapshot
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}