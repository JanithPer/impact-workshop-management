export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar?: {
      url: string;
      publicId: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }