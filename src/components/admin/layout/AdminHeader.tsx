'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/moderation': 'Moderation',
  '/admin/subscriptions': 'Subscriptions',
  '/admin/analytics': 'Analytics',
  '/admin/system': 'System',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/admin/users/')) return 'User Detail';
  return 'Admin';
}

export function AdminHeader() {
  const pathname = usePathname();
  const { user, removeAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    removeAuth();
    router.replace('/login');
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{user?.name}</span>
          <Badge variant="secondary" className="text-xs capitalize">
            {user?.role ?? 'User'}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
