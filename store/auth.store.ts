import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse, UserRole } from "@/lib/auth";
import { api } from "@/lib/api";

interface AuthState {
  token?: string;
  user?: { id: string; username: string; role: UserRole };
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      login: async (username, password) => {
        const { data } = await api.post<LoginResponse>("/auth/login", {
          username,
          password,
        });
        set({ token: data.token, user: data.user });
      },
      logout: () => set({ token: undefined, user: undefined }),
    }),
    { name: "prs-auth" }
  )
);
