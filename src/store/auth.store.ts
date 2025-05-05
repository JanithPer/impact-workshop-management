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
  isLoading: true, // Start with loading true
  login: (token, user) => {
    // Set cookie to expire in 7 days to persist across sessions
    Cookies.set(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!, token, { secure: true, expires: 7 }); 
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    Cookies.remove(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  initialize: () => {
    set({ isLoading: true }); // Set loading true initially
    const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME!); 
    // TODO: Optionally fetch user details here if token exists
    set({ isAuthenticated: !!token, isLoading: false }); // Set final state
  },
}));