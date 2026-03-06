'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { AdminDashboardDto } from '@/lib/types/admin';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.get<AdminDashboardDto>('api/admin/dashboard'),
    staleTime: 60_000,
  });
}
