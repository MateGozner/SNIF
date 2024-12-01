import { useAuthStore } from "../store/authStore";
import { AuthService } from "./auth";

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

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      AuthService.removeToken();
      window.location.href = "/login";
    }
    throw new Error(await response.text());
  }
  return response.json();
};

const fetchWithAuth = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const { controller, timeoutId } = createAbortController(timeout);

  try {
    const token = useAuthStore.getState().token;
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    });

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    const data = await handleResponse(response);
    return data as T;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWithAuth<T>(endpoint, options),

  post: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown, options?: FetchOptions) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchWithAuth<T>(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
