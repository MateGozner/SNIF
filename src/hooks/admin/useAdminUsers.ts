'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { AdminUserDto, AdminUserDetailDto, PagedResult } from '@/lib/types/admin';

interface UserFilter {
  search?: string;
  status?: 'all' | 'active' | 'banned' | 'suspended';
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useAdminUsers(filter: UserFilter) {
  return useQuery({
    queryKey: ['admin', 'users', filter],
    queryFn: () =>
      api.get<PagedResult<AdminUserDto>>('api/admin/users', {
        params: {
          search: filter.search || undefined,
          status: filter.status !== 'all' ? filter.status : undefined,
          page: filter.page ?? 1,
          pageSize: filter.pageSize ?? 10,
          sortBy: filter.sortBy,
          sortDirection: filter.sortDirection,
        },
      }),
    staleTime: 30_000,
  });
}

export function useAdminUserDetail(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => api.get<AdminUserDetailDto>(`api/admin/users/${userId}`),
    enabled: !!userId,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, durationDays, reason }: { userId: string; durationDays: number; reason: string }) =>
      api.post(`api/admin/users/${userId}/suspend`, { durationDays, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.post(`api/admin/users/${userId}/ban`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.post(`api/admin/users/${userId}/unban`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.post(`api/admin/users/${userId}/unsuspend`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
