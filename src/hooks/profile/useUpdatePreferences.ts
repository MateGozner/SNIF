import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UpdatePreferencesDto, UserDto } from "@/lib/types/user";
import { toast } from "sonner";

export function useUpdatePreferences(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesDto) => {
      const response = await api.put<UserDto>(
        `api/users/${userId}/preferences`,
        data
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
