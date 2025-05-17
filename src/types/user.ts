export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string; // Optional because you might not want to expose this in the frontend
    role: 'user' | 'admin';
    avatar: {
      url: string;
      publicId: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }