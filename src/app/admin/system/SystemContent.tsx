'use client';

import { useSystemHealth } from '@/hooks/admin/useAdminSystem';
import { KpiCard } from '@/components/admin/dashboard/KpiCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Wifi, Activity, Clock } from 'lucide-react';

export default function SystemPage() {
  const { data, isLoading, error } = useSystemHealth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Failed to load system health data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Database"
          value={data.dbConnected ? 'Connected' : 'Disconnected'}
          icon={Database}
        />
        <KpiCard
          title="Redis"
          value={data.redisConnected ? 'Connected' : 'Disconnected'}
          icon={Wifi}
        />
        <KpiCard
          title="SignalR Connections"
          value={data.activeSignalRConnections}
          icon={Activity}
        />
        <KpiCard title="Uptime" value={data.uptime} icon={Clock} />
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">API Server</span>
              <Badge variant={data.dbConnected ? 'default' : 'destructive'}>
                {data.dbConnected ? 'Healthy' : 'Down'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Database (PostgreSQL)</span>
              <Badge variant={data.dbConnected ? 'default' : 'destructive'}>
                {data.dbConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Redis Cache</span>
              <Badge variant={data.redisConnected ? 'default' : 'destructive'}>
                {data.redisConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-700">Real-time (SignalR)</span>
              <Badge variant="default">
                {data.activeSignalRConnections} connections
              </Badge>
            </div>
            {data.lastMigration && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Last Migration</span>
                <span className="text-sm text-gray-500">{data.lastMigration}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
