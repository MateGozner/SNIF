import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UserDto } from "@/lib/types/user";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await api.get<UserDto>(`api/User/profile/${userId}`);
      return response;
    },
  });
}