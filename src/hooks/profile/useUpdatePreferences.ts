import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { UpdatePreferencesDto, UserDto } from "@/lib/types/user";

export function useUpdatePreferences(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesDto) => {
      const response = await api.put<UserDto>(
        `api/User/preferences/${userId}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
