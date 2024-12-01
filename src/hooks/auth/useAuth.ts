import { api } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/store/authStore";
import { AuthResponse, LoginData, User } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>("api/User/login", data);
      console.log(response);
      const user: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        location: response.location,
      };
      setAuth(response.token, user);
      router.push("/");
      return response;
    },
  });
}

export function useLogout() {
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post("api/User/logout", {});
      removeAuth();
      router.push("/login");
    },
  });
}
