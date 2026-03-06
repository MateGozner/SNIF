'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { ChatSummaryDto } from '@/lib/types/message';
import { useAuthStore } from '@/lib/store/authStore';

export function useConversations() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => api.get<ChatSummaryDto[]>(`api/chats/users/${user!.id}`),
    enabled: !!user?.id,
    staleTime: 15_000,
  });
}
