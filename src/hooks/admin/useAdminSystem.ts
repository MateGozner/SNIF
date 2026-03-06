'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { SystemHealthDto, DailyStatDto } from '@/lib/types/admin';

export interface AdminStatsDto {
  totalUsers: number;
  totalPets: number;
  totalMatches: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
  userGrowth: DailyStatDto[];
  matchActivity: DailyStatDto[];
  geoDistribution: { region: string; count: number }[];
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'system', 'health'],
    queryFn: () => api.get<SystemHealthDto>('api/admin/system/health'),
    refetchInterval: 30_000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<AdminStatsDto>('api/admin/stats'),
    staleTime: 60_000,
  });
}
