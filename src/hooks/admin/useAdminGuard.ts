'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function useAdminGuard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'superadmin' || role === 'admin' || role === 'moderator';

    if (!isAdmin) {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  const role = user?.role?.toLowerCase();
  return {
    isAdmin: role === 'superadmin' || role === 'admin' || role === 'moderator',
    isSuperAdmin: role === 'superadmin',
    role: user?.role,
  };
}
