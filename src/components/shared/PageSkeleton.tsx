import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  headerHeight?: string;
  rows?: number;
}

export function PageSkeleton({ headerHeight = 'h-10', rows = 4 }: PageSkeletonProps) {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className={`${headerHeight} w-48 rounded-lg`} />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
