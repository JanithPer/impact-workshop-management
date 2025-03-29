// types/task.ts
export type Task = {
    id: string
    title: string
    description: string
    avatar: string
    status: 'todo' | 'in-progress' | 'done'
    colorMode:'success' | 'danger' | 'warning' | 'info'
  }