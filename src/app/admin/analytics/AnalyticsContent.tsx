'use client';

import { useAdminStats } from '@/hooks/admin/useAdminSystem';
import { useAdminRevenue } from '@/hooks/admin/useAdminSubscriptions';
import { UserGrowthAnalyticsChart } from '@/components/admin/analytics/UserGrowthChart';
import { MatchActivityChart } from '@/components/admin/analytics/MatchActivityChart';
import { GeoDistributionChart } from '@/components/admin/analytics/GeoDistributionChart';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: revenue, isLoading: revenueLoading } = useAdminRevenue();

  if (statsLoading || revenueLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.userGrowth && <UserGrowthAnalyticsChart data={stats.userGrowth} />}
        {stats?.matchActivity && <MatchActivityChart data={stats.matchActivity} />}
        {revenue && <RevenueChart data={revenue} />}
        {stats?.geoDistribution && <GeoDistributionChart data={stats.geoDistribution} />}
      </div>
    </div>
  );
}
