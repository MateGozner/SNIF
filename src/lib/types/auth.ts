import { z } from "zod";
import { LocationDto } from "./location";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter");

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Name can only contain letters and numbers");

export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email cannot exceed 255 characters"),
    password: passwordSchema,
    confirmPassword: z.string(),
    name: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
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
  location?: LocationDto;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (
    email: string,
    password: string,
    location?: LocationDto
  ) => Promise<void>;
  logout: () => Promise<void>;
}
