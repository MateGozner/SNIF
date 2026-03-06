'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { AdminSubscriptionStatsDto, PagedResult } from '@/lib/types/admin';

export interface AdminSubscriptionDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export function useAdminSubscriptions(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['admin', 'subscriptions', page, pageSize],
    queryFn: () =>
      api.get<PagedResult<AdminSubscriptionDto>>('api/admin/subscriptions', {
        params: { page, pageSize },
      }),
    staleTime: 60_000,
  });
}

export function useAdminSubscriptionStats() {
  return useQuery({
    queryKey: ['admin', 'subscriptions', 'stats'],
    queryFn: () => api.get<AdminSubscriptionStatsDto>('api/admin/subscriptions/stats'),
    staleTime: 60_000,
  });
}

export function useAdminRevenue() {
  return useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: () => api.get<RevenueDataPoint[]>('api/admin/revenue'),
    staleTime: 300_000,
  });
}
