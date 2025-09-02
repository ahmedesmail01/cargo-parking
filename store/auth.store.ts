import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse, UserRole } from "@/lib/auth";
import { api } from "@/lib/api";

interface AuthState {
  token?: string;
  user?: { id: string; username: string; role: UserRole };
  // ⬇️ return the API payload
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      token: undefined,
      user: undefined,
      login: async (username, password) => {
        const { data } = await api.post<LoginResponse>("/auth/login", {
          username,
          password,
        });
        set({ token: data.token, user: data.user });
        return data; // ⬅️ matches the signature now
      },
      logout: () => set({ token: undefined, user: undefined }),
    }),
    { name: "prs-auth" }
  )
);
