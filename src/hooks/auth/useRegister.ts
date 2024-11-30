import { api } from "@/lib/auth/api";
import { useMutation } from "@tanstack/react-query";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      api.post<{ token: string }>("api/User/register", data),
  });
}
