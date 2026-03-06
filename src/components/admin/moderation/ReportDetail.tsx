'use client';

import { AdminReportDto } from '@/lib/types/admin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ModerationActions } from './ModerationActions';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ReportDetailProps {
  report: AdminReportDto;
  onClose: () => void;
}

export function ReportDetail({ report, onClose }: ReportDetailProps) {
  return (
    <Card className="bg-white border-[#2997FF]/20">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
          <p className="text-sm text-gray-500">
            Submitted {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Reporter</span>
            <p className="text-gray-900">{report.reporterName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Reported User</span>
            <p className="text-gray-900">{report.targetUserName}</p>
          </div>
          {report.targetPetName && (
            <div>
              <span className="font-medium text-gray-500">Reported Pet</span>
              <p className="text-gray-900">{report.targetPetName}</p>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-500">Reason</span>
            <Badge variant="outline" className="mt-1">{report.reason}</Badge>
          </div>
        </div>

        {report.description && (
          <div className="rounded-lg bg-gray-50 p-4">
            <span className="text-xs font-medium text-gray-500 block mb-1">Description</span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </div>
        )}

        {report.status.toLowerCase() === 'pending' && (
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-2">Actions</span>
            <ModerationActions
              reportId={report.id}
              targetUserId={report.targetUserId}
              targetUserName={report.targetUserName}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
