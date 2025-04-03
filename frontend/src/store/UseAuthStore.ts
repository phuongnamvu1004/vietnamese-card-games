import {create} from 'zustand';

interface AuthState {
    user: {
      id?: string;
      username?: string;
      // Add other user properties
    } | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    // Add other methods
  }
  
  export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (username, password) => {
      // Implement login logic
      set({ user: { username }, isAuthenticated: true });
    },
    logout: () => {
      set({ user: null, isAuthenticated: false });
    }
  }));