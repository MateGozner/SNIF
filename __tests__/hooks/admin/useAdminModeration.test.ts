/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the api module
jest.mock('@/lib/auth/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { api } from '@/lib/auth/api';
import { toast } from 'sonner';
import { useReports, useResolveReport, useDismissReport } from '@/hooks/admin/useAdminModeration';

const mockedApi = api as jest.Mocked<typeof api>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useReports', () => {
  it('fetches reports with default filter', async () => {
    const mockData = {
      items: [
        { id: 'r1', reporterName: 'Alice', targetUserName: 'Bob', reason: 'Spam', status: 'pending', createdAt: '2026-01-01' },
      ],
      totalCount: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    };
    mockedApi.get.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useReports(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(mockedApi.get).toHaveBeenCalledWith(
      'api/admin/reports',
      expect.objectContaining({ params: expect.objectContaining({ page: 1, pageSize: 20 }) })
    );
  });

  it('passes status filter when not "all"', async () => {
    mockedApi.get.mockResolvedValueOnce({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 });

    const { result } = renderHook(() => useReports({ status: 'pending' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith(
      'api/admin/reports',
      expect.objectContaining({ params: expect.objectContaining({ status: 'pending' }) })
    );
  });

  it('omits status when filter is "all"', async () => {
    mockedApi.get.mockResolvedValueOnce({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 });

    const { result } = renderHook(() => useReports({ status: 'all' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.get).toHaveBeenCalledWith(
      'api/admin/reports',
      expect.objectContaining({ params: expect.objectContaining({ status: undefined }) })
    );
  });
});

describe('useResolveReport', () => {
  it('calls resolve endpoint and shows success toast', async () => {
    mockedApi.post.mockResolvedValueOnce({});

    const { result } = renderHook(() => useResolveReport(), { wrapper: createWrapper() });

    result.current.mutate({ reportId: 'r1', resolution: 'warned', notes: 'test' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.post).toHaveBeenCalledWith('api/admin/reports/r1/resolve', {
      resolution: 'warned',
      notes: 'test',
    });
    expect(toast.success).toHaveBeenCalledWith('Report resolved successfully.');
  });

  it('shows error toast on failure', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useResolveReport(), { wrapper: createWrapper() });

    result.current.mutate({ reportId: 'r1', resolution: 'warned' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to resolve report.');
  });
});

describe('useDismissReport', () => {
  it('calls dismiss endpoint and shows success toast', async () => {
    mockedApi.post.mockResolvedValueOnce({});

    const { result } = renderHook(() => useDismissReport(), { wrapper: createWrapper() });

    result.current.mutate({ reportId: 'r2', notes: 'Not actionable' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApi.post).toHaveBeenCalledWith('api/admin/reports/r2/dismiss', {
      notes: 'Not actionable',
    });
    expect(toast.success).toHaveBeenCalledWith('Report dismissed.');
  });

  it('shows error toast on failure', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useDismissReport(), { wrapper: createWrapper() });

    result.current.mutate({ reportId: 'r2' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to dismiss report.');
  });
});
