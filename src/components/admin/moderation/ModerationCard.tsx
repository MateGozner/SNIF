'use client';

import { AdminReportDto } from '@/lib/types/admin';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ModerationCardProps {
  report: AdminReportDto;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig: Record<string, { color: string; icon: typeof Clock; label: string }> = {
  pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
  reviewed: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertTriangle, label: 'Reviewed' },
  resolved: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Resolved' },
  dismissed: { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: XCircle, label: 'Dismissed' },
};

export function ModerationCard({ report, isSelected, onClick }: ModerationCardProps) {
  const status = statusConfig[report.status.toLowerCase()] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-[#2997FF] shadow-md'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 truncate">
                {report.targetUserName}
              </span>
              {report.targetPetName && (
                <span className="text-xs text-gray-500">
                  (pet: {report.targetPetName})
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">{report.reason}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <span>by {report.reporterName}</span>
              <span>·</span>
              <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
          <Badge variant="outline" className={cn('shrink-0 gap-1', status.color)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
