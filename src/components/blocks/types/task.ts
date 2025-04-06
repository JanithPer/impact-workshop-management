// types/task.ts
export interface AssignedPerson {
  id: string;
  name: string;
  avatar: string;
}


export type Task = {
    id: string
    title: string
    description: string
    assignedPeople: AssignedPerson[];
    status: 'todo' | 'in-progress' | 'done'
    colorMode:'success' | 'danger' | 'warning' | 'info'
  }