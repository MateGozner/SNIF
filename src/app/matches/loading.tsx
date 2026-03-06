import { Skeleton } from '@/components/ui/skeleton';

export default function MatchesLoading() {
  return (
    <div className="min-h-screen bg-black/[0.98] p-6 space-y-6">
      <Skeleton className="h-10 w-40 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
