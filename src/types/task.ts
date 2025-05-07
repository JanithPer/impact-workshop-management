export interface Task {
  _id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  colorMode: 'success' | 'warning' | 'danger' | 'info';
  start: string;
  end?: string;
  assignedPeople?: { id: string; name: string; avatar: { url: string } }[];
  onKanban: boolean;
  createdAt?: string;
  updatedAt?: string;
}