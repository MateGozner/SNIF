import { CardGridSkeleton } from '@/components/shared/CardGridSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function PetsLoading() {
  return (
    <div className="min-h-screen bg-black/[0.98] p-6 space-y-6">
      <Skeleton className="h-10 w-40 rounded-lg" />
      <CardGridSkeleton count={6} columns={3} />
    </div>
  );
}
