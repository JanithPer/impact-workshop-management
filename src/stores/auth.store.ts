import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/types/user';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
};

const initialToken = typeof window !== 'undefined' ? Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!) : undefined;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: !!initialToken,
  isLoading: false,
  login: (token, user) => {
    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!, token, { secure: true });
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  initialize: () => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    set({ isAuthenticated: !!token, isLoading: false });
  },
}));