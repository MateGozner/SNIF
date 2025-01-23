// src/hooks/profile/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UpdateUserPersonalInfoDto, UserDto } from "@/lib/types/user";
import { toast } from "sonner";

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserPersonalInfoDto) => {
      const formData = new FormData();
      console.log(data);
      if (data.name) {
        formData.append("name", data.name);
      }
      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      const response = await api.put<UserDto>(
        `api/User/profile/${userId}`,
        formData
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
