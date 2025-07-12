export interface Person {
  _id: string;
  name: string;
  avatar: { url: string };
  email?: string; // Added optional email field
}

export interface Picture {
  publicId: string;
  url: string;
}

export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskColorMode = 'success' | 'danger' | 'warning' | 'info' | 'green' | 'red' | 'brown' | 'black';

export interface Task {
  _id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  colorMode: TaskColorMode;
  start: string;
  end?: string;
  assignedPeople?: Person[];
  comments?: Comment[];
  pictures?: Picture[];
  onKanban: boolean;
  createdAt?: string;
  updatedAt?: string;
  jobId?: string; // Added jobId property
}