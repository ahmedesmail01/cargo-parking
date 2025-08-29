import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Normalize error shape from backend
    const message =
      err?.response?.data?.message || err.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);
