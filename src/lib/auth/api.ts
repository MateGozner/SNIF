"use client";

import { useAuthStore } from "../store/authStore";
import { AuthResponse } from "../types/auth";
import { cookies } from "./cookies";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const DEFAULT_TIMEOUT = 8000;


const createAbortController = (timeout: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
};

export const validateToken = async (): Promise<AuthResponse | null> => {
  const token = cookies.getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}api/users/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) throw new Error('Token validation failed');

    const data: AuthResponse = await response.json();
    if (data.token) {
      cookies.setToken(data.token);
      useAuthStore.getState().setAuth(data.token, {
        id: data.id,
        email: data.email,
        name: data.name,
        location: data.location,
      });
      return data;
    }
    return null;
  } catch (error) {
    cookies.removeToken();
    useAuthStore.getState().removeAuth();
    return null;
  }
};

const fetchWithAuth = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const { controller, timeoutId } = createAbortController(timeout);

  try {
    const makeRequest = async (token?: string) => {
      const isFormData = fetchOptions.body instanceof FormData;
      const headers = new Headers({
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      });

      return fetch(`${BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });
    };

    const token = cookies.getToken();
    let response = await makeRequest(token);

    if (response.status === 401) {
      const validationResult = await validateToken();
      if (validationResult?.token) {
        response = await makeRequest(validationResult.token);
      } else {
        cookies.removeToken();
        useAuthStore.getState().removeAuth();
        window.location.href = "/login";
        throw new Error('Authentication failed');
      }
    }

    return handleResponse(response);
  } finally {
    clearTimeout(timeoutId);
  }
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWithAuth<T>(endpoint, options),

  post: <T>(endpoint: string, data: unknown, options?: FetchOptions) => {
    const isFormData = data instanceof FormData;

    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  put: <T>(endpoint: string, data: unknown, options?: FetchOptions) => {
    const isFormData = data instanceof FormData;
    const headers = {
      ...(!isFormData && { "Content-Type": "application/json" }),
    };

    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PUT",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  delete: async <T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T | null> => {
    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};
