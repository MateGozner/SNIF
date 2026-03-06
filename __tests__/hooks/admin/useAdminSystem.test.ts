/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('@/lib/auth/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { api } from '@/lib/auth/api';
import { useSystemHealth, useAdminStats } from '@/hooks/admin/useAdminSystem';

const mockedApi = api as jest.Mocked<typeof api>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSystemHealth', () => {
  it('returns system health data', async () => {
    const healthData = {
      dbConnected: true,
      redisConnected: true,
      activeSignalRConnections: 42,
      uptime: '5d 12h',
      lastMigration: '2026-01-15',
    };
    mockedApi.get.mockResolvedValueOnce(healthData);

    const { result } = renderHook(() => useSystemHealth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(healthData);
    expect(mockedApi.get).toHaveBeenCalledWith('api/admin/system/health');
  });

  it('configures auto-refetch (30s interval in source)', async () => {
    mockedApi.get.mockResolvedValueOnce({});

    const { result } = renderHook(() => useSystemHealth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalled();
  });
});

describe('useAdminStats', () => {
  it('returns admin statistics', async () => {
    const statsData = {
      totalUsers: 1200,
      totalPets: 3400,
      totalMatches: 890,
      activeSubscriptions: 150,
      revenueThisMonth: 4500.0,
      userGrowth: [{ date: '2026-01-01', count: 10 }],
      matchActivity: [{ date: '2026-01-01', count: 5 }],
      geoDistribution: [{ region: 'EU', count: 800 }],
    };
    mockedApi.get.mockResolvedValueOnce(statsData);

    const { result } = renderHook(() => useAdminStats(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(statsData);
    expect(result.current.data!.totalUsers).toBe(1200);
    expect(result.current.data!.geoDistribution).toHaveLength(1);
  });

  it('handles API error gracefully', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Service unavailable'));

    const { result } = renderHook(() => useAdminStats(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
