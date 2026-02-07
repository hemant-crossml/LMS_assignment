import { create } from 'zustand';
import { User, LoginCredentials, RegisterData, AuthTokens } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthTokens>('/login/', credentials);
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Fetch user profile
      const userResponse = await api.get<User>('/users/me/');
      set({ user: userResponse.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      await api.post('/users/', data);
      // After registration, log in automatically
      await useAuthStore.getState().login({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await api.get<User>('/users/me/');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
