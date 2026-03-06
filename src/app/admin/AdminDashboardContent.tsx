'use client';

import {
  Users,
  PawPrint,
  Heart,
  Percent,
  DollarSign,
  UserPlus,
  CalendarPlus,
  CreditCard,
} from 'lucide-react';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { KpiCard } from '@/components/admin/dashboard/KpiCard';
import { UserGrowthChart } from '@/components/admin/dashboard/UserGrowthChart';
import { MatchRateChart } from '@/components/admin/dashboard/MatchRateChart';
import { TopBreedsChart } from '@/components/admin/dashboard/TopBreedsChart';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Users" value={data.totalUsers.toLocaleString()} icon={Users} />
        <KpiCard title="Total Pets" value={data.totalPets.toLocaleString()} icon={PawPrint} />
        <KpiCard title="Active Matches" value={data.totalMatches.toLocaleString()} icon={Heart} />
        <KpiCard title="Match Rate" value={`${data.matchRate.toFixed(1)}%`} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Revenue / Month"
          value={`$${data.revenueThisMonth.toLocaleString()}`}
          icon={DollarSign}
        />
        <KpiCard title="New Users Today" value={data.newUsersToday} icon={UserPlus} />
        <KpiCard title="New This Week" value={data.newUsersThisWeek} icon={CalendarPlus} />
        <KpiCard
          title="Active Subscriptions"
          value={data.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={data.userGrowth} />
        <MatchRateChart data={data.matchesOverTime} />
        <TopBreedsChart data={data.topBreeds} />
      </div>
    </div>
  );
}
