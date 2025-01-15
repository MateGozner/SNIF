import { api } from "@/lib/auth/api";
import { ChatSummaryDto, MessageDto } from "@/lib/types/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMatchMessages(matchId: string) {
  return useQuery({
    queryKey: ["messages", matchId],
    queryFn: () => api.get<MessageDto[]>(`api/chat/${matchId}`),
  });
}

export function useUserChats(userId: string) {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => api.get<ChatSummaryDto[]>(`api/chat/${userId}/chats`),
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      api.post(`api/chat/${messageId}/read`, {}),
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", messageId],
      });
    },
  });
}
