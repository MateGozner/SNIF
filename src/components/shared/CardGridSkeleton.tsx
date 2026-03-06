import { Skeleton } from '@/components/ui/skeleton';

interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
}

export function CardGridSkeleton({ count = 6, columns = 3 }: CardGridSkeletonProps) {
  const gridClass =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  );
}
