import { z } from "zod";
import { LocationDto } from "./location";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface AuthToken {
  exp: number;
  email: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  location?: LocationDto;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  removeAuth: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  location?: LocationDto;
}

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  name: string;
  location?: LocationDto;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
  location? : LocationDto;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string, location?: LocationDto) => Promise<void>;
  logout: () => Promise<void>;
}
