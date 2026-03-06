'use client';

import { useState } from 'react';
import { useReports } from '@/hooks/admin/useAdminModeration';
import { ModerationCard } from './ModerationCard';
import { ReportDetail } from './ReportDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'resolved', label: 'Resolved' },
];

export function ModerationQueue() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const { data, isLoading, error } = useReports({ status: statusFilter });

  const reports = data?.items ?? [];
  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-80 rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Failed to load reports.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Report List */}
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No reports found.
                  </div>
                ) : (
                  reports.map((report) => (
                    <ModerationCard
                      key={report.id}
                      report={report}
                      isSelected={selectedReportId === report.id}
                      onClick={() =>
                        setSelectedReportId(
                          selectedReportId === report.id ? null : report.id
                        )
                      }
                    />
                  ))
                )}
              </div>

              {/* Detail Panel */}
              <div>
                {selectedReport ? (
                  <ReportDetail
                    report={selectedReport}
                    onClose={() => setSelectedReportId(null)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    Select a report to view details
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
