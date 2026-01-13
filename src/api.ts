import axios, { type AxiosInstance } from "axios";
import type { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";
import { clearState } from "./store";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export const getToken = (): string | null => localStorage.getItem("auth_token");

export const setToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("auth_token");
};

export const extractErrorMessage = (error: unknown): string => {
  if (typeof error !== "object" || error === null) return "An unexpected error occurred";
  const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.error) return err.response.data.error;
  if (err.message) return err.message;
  return "An unexpected error occurred";
};

const handleLogout = (navigate?: NavigateFunction) => {
  // Clear token from localStorage
  removeToken();
  
  // Clear entire Redux store and persisted state
  clearState();
  
  // Redirect to login page
  if (navigate) {
    navigate("/auth/login", { replace: true });
  } else {
    window.location.href = "/auth/login";
  }
};

export const createAxiosInstance = (navigate?: NavigateFunction): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = extractErrorMessage(error);
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Session expired", {
          description: "Please log in again to continue.",
          duration: 5000,
        });
        handleLogout(navigate);
      } else if (status) {
        toast.error(status >= 500 ? "Server error" : "Request error", {
          description: message,
          duration: 5000,
        });
      } else {
        toast.error("Network error", {
          description: message,
          duration: 5000,
        });
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance();

export default api;
