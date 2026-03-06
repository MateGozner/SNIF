import { Skeleton } from '@/components/ui/skeleton';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-black/[0.98] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-10 w-64 mx-auto rounded-lg" />
          <Skeleton className="h-5 w-80 mx-auto rounded" />
          <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
