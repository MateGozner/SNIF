'use client';

import { useState, useCallback } from 'react';
import { SortingState } from '@tanstack/react-table';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserFilters } from '@/components/admin/users/UserFilters';
import { SuspendUserDialog } from '@/components/admin/users/SuspendUserDialog';
import { BanUserDialog } from '@/components/admin/users/BanUserDialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminUserDto } from '@/lib/types/admin';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [suspendTarget, setSuspendTarget] = useState<AdminUserDto | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUserDto | null>(null);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    status: status as 'all' | 'active' | 'banned' | 'suspended',
    page,
    pageSize: 10,
    sortBy: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  return (
    <div className="space-y-4">
      <UserFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <Skeleton className="h-96 rounded-xl" />
      ) : (
        <>
          <UserTable
            data={data?.items ?? []}
            sorting={sorting}
            onSortingChange={setSorting}
            onSuspend={setSuspendTarget}
            onBan={setBanTarget}
          />

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Page {data.page} of {data.totalPages} ({data.totalCount} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {suspendTarget && (
        <SuspendUserDialog
          userId={suspendTarget.id}
          userName={suspendTarget.name}
          open={!!suspendTarget}
          onOpenChange={(open) => !open && setSuspendTarget(null)}
        />
      )}

      {banTarget && (
        <BanUserDialog
          userId={banTarget.id}
          userName={banTarget.name}
          open={!!banTarget}
          onOpenChange={(open) => !open && setBanTarget(null)}
        />
      )}
    </div>
  );
}
