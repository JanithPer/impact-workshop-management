import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/types/user';
import { api } from '@/lib/axios'; 

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>; // Initialize will now be asynchronous
};

const JWT_COOKIE_NAME = process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'jwt_token'; // Use a default if not defined

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false, // Initially false, will be determined by initialize
  isLoading: true, // Start with loading true

  login: (token, user) => {
    // Set cookie to expire in 7 days to persist across sessions
    Cookies.set(JWT_COOKIE_NAME, token, { secure: true, expires: 7 });
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    Cookies.remove(JWT_COOKIE_NAME);
    set({ user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login'; // Redirect to login page after logout
  },

  initialize: async () => {
    set({ isLoading: true }); // Set loading true initially
    const token = Cookies.get(JWT_COOKIE_NAME);

    if (token) {
      try {
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data.data; 

        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch user on initialize:", error);
        // If token is invalid or fetching fails, clear the token and log out
        Cookies.remove(JWT_COOKIE_NAME);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));