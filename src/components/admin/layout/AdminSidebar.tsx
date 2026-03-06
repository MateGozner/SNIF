'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Shield,
  CreditCard,
  Settings,
  ArrowLeft,
  PawPrint,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminGuard } from '@/hooks/admin/useAdminGuard';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Moderation', href: '/admin/moderation', icon: Shield },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Analytics', href: '/admin/analytics', icon: LineChart },
  { name: 'System', href: '/admin/system', icon: Settings, superAdminOnly: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSuperAdmin } = useAdminGuard();

  const visibleItems = navItems.filter(
    (item) => !item.superAdminOnly || isSuperAdmin
  );

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2">
          <PawPrint className="h-7 w-7 text-[#2997FF]" />
          <span className="text-xl font-bold text-gray-900">SNIF</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#2997FF]/10 text-[#2997FF]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-[#2997FF]' : 'text-gray-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
          Back to App
        </Link>
      </div>
    </aside>
  );
}
