export interface Person {
  _id: string;
  name: string;
  avatar: { url: string };
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

export interface Task {
  _id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  colorMode: 'success' | 'warning' | 'danger' | 'info';
  start: string;
  end?: string;
  assignedPeople?: Person[];
  comments?: Comment[];
  pictures?: Picture[];
  onKanban: boolean;
  createdAt?: string;
  updatedAt?: string;
}