'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/auth/api';
import { AdminReportDto, PagedResult } from '@/lib/types/admin';
import { toast } from 'sonner';

interface ReportFilter {
  status?: string;
  page?: number;
  pageSize?: number;
}

export function useReports(filter: ReportFilter = {}) {
  return useQuery({
    queryKey: ['admin', 'reports', filter],
    queryFn: () =>
      api.get<PagedResult<AdminReportDto>>('api/admin/reports', {
        params: {
          status: filter.status && filter.status !== 'all' ? filter.status : undefined,
          page: filter.page ?? 1,
          pageSize: filter.pageSize ?? 20,
        },
      }),
    staleTime: 30_000,
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      resolution,
      notes,
    }: {
      reportId: string;
      resolution: string;
      notes?: string;
    }) => api.post(`api/admin/reports/${reportId}/resolve`, { resolution, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      toast.success('Report resolved successfully.');
    },
    onError: () => {
      toast.error('Failed to resolve report.');
    },
  });
}

export function useDismissReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, notes }: { reportId: string; notes?: string }) =>
      api.post(`api/admin/reports/${reportId}/dismiss`, { notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      toast.success('Report dismissed.');
    },
    onError: () => {
      toast.error('Failed to dismiss report.');
    },
  });
}

export function useWarnUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      api.post(`api/admin/users/${userId}/warn`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User warned successfully.');
    },
    onError: () => {
      toast.error('Failed to warn user.');
    },
  });
}
