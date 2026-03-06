'use client';

import { useAdminSubscriptions, useAdminSubscriptionStats } from '@/hooks/admin/useAdminSubscriptions';
import { KpiCard } from '@/components/admin/dashboard/KpiCard';
import { SubscriptionChart } from '@/components/admin/analytics/SubscriptionChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Users, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function SubscriptionsPage() {
  const { data: subs, isLoading: subsLoading } = useAdminSubscriptions();
  const { data: stats, isLoading: statsLoading } = useAdminSubscriptionStats();

  if (subsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const chartData = stats
    ? [
        { name: 'Free', value: stats.totalFree },
        { name: 'GoodBoy', value: stats.totalGoodBoy },
        { name: 'AlphaPack', value: stats.totalAlphaPack },
        { name: 'TreatBag', value: stats.totalTreatBag },
      ]
    : [];

  const subscriptions = subs?.items ?? [];

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Free Users" value={stats.totalFree.toLocaleString()} icon={Users} />
          <KpiCard title="GoodBoy" value={stats.totalGoodBoy.toLocaleString()} icon={CreditCard} />
          <KpiCard title="AlphaPack" value={stats.totalAlphaPack.toLocaleString()} icon={TrendingUp} />
          <KpiCard title="MRR" value={`$${stats.mrr.toLocaleString()}`} icon={DollarSign} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionChart data={chartData} />

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Active Subscriptions</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Period End</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{sub.userName}</p>
                        <p className="text-xs text-gray-500">{sub.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.planId}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={sub.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                      No active subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
