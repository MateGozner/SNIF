import { api } from "@/lib/auth/api";
import { useAuthStore } from "@/lib/store/authStore";
import { AuthResponse, RegisterData, User } from "@/lib/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>("api/users", data);
      const user: User = {
        id: response.id,
        email: response.email,
        name: response.name,
        location: response.location,
      };
      setAuth(response.token, user);
      toast.success("Registered successfully");
      router.push("/");
      return response;
    },
  });
}
