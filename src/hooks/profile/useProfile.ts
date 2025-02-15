import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UserDto } from "@/lib/types/user";
import { transformProfileData } from "@/lib/utils/urlTransformer";
import { toast } from "sonner";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      try {
        const response = await api.get<UserDto>(`api/users/${userId}`);
        return transformProfileData(response);
      } catch (error) {
        toast.error("Failed to load profile");
        throw error;
      }
    },
  });
}

export function useProfilePicture(userId: string) {
  return useQuery({
    queryKey: ["profile-picture", userId],
    queryFn: async () => {
      try {
        const response = await api.get(`api/users/${userId}/picture`);
        return response;
      } catch (error) {
        throw error;
      }
    },
  });
}
