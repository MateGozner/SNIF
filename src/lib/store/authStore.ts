import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/auth";
import { cookies } from "../auth/cookies";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: cookies.getToken() || null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        cookies.setToken(token);
        set({ token, user, isAuthenticated: true });
      },
      removeAuth: () => {
        cookies.removeToken();
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
