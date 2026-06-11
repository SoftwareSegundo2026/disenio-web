import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export interface AuthUser {
  user_id: number | null;
  username: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  disabled: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setToken: async (token: string | null) => {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    set({ token });
  },

  setUser: (user: AuthUser | null) => {
    if (user) {
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } else {
      SecureStore.deleteItemAsync(USER_KEY);
    }
    set({ user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ token: null, user: null });
  },

  loadStoredAuth: async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);
      const user = userJson ? JSON.parse(userJson) as AuthUser : null;
      set({ token, user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
