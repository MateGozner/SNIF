import { api } from "@/lib/auth/api";
import { ChatSummaryDto, MessageDto } from "@/lib/types/message";
import { useQuery, useMutation } from "@tanstack/react-query";

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

export function useSendImageMessage(matchId: string) {
  return useMutation({
    mutationFn: async ({
      image,
      receiverId,
    }: {
      image: File;
      receiverId: string;
    }) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("receiverId", receiverId);
      return api.post<MessageDto>(
        `api/chats/matches/${matchId}/messages/image`,
        formData
      );
    },
  });
}
