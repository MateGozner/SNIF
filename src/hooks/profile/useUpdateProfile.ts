// src/hooks/profile/useUpdateProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UpdateUserPersonalInfoDto, UserDto } from "@/lib/types/user";
import { toast } from "sonner";
import { fileToBase64 } from "@/lib/utils/fileHelpers";

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserPersonalInfoDto) => {
      const response = await api.put<UserDto>(`api/users/${userId}`, {
        name: data.name,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

export function useUpdateProfilePicture(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const base64 = await fileToBase64(file);

      const response = await api.put<UserDto>(`api/users/${userId}/picture`, {
        fileName: file.name,
        contentType: file.type,
        base64Data: base64,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile-picture", userId] });
    },
  });
}
