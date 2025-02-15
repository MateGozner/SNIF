import { api } from "@/lib/auth/api";
import { ChatSummaryDto, MessageDto } from "@/lib/types/message";
import { useQuery } from "@tanstack/react-query";

export function useMatchMessages(matchId: string) {
  return useQuery({
    queryKey: ["messages", matchId],
    queryFn: () =>
      api.get<MessageDto[]>(`api/chats/matches/${matchId}/messages`),
  });
}

export function useUserChats(userId: string) {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => api.get<ChatSummaryDto[]>(`api/chats/users/${userId}`),
  });
}
