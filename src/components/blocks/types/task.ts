// types/task.ts
export interface AssignedPerson {
  _id: string; // MongoDB ObjectId as string
  name: string;
  avatar: string; // URL to avatar image
}

export interface RepairOrder { // Basic representation, expand as needed
  _id: string; // MongoDB ObjectId as string
  // Add other relevant fields from your RepairOrder model if they are populated and needed by the frontend
  // e.g., orderNumber?: string;
}

export interface Picture {
  _id?: string; // MongoDB ObjectId as string (often present in subdocuments)
  url: string;
  publicId: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskColorMode = 'success' | 'warning' | 'danger' | 'info';

export type Task = {
  _id: string; // MongoDB ObjectId as string
  repairOrder: string | RepairOrder; // ObjectId string or populated RepairOrder object
  name: string; // Was 'title'
  description?: string; // Optional, backend has default ''
  status: TaskStatus;
  colorMode: TaskColorMode;
  start: string; // ISO date string
  end?: string; // Optional ISO date string
  assignedPeople: AssignedPerson[];
  comments?: string[];
  pictures?: Picture[];
  onKanban: boolean;
  // Timestamps from backend if needed
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
};