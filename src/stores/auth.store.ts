import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/types/user'; // Updated import path

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (token, user) => {
    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!, token, { secure: true });
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    set({ user: null, isAuthenticated: false });
  },
  initialize: () => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    set({ isLoading: !!token });
    // You might want to add a token validation API call here
    set({ isLoading: false, isAuthenticated: !!token });
  },
}));