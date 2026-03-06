'use client';

import { useAdminGuard } from '@/hooks/admin/useAdminGuard';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdminGuard();

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
