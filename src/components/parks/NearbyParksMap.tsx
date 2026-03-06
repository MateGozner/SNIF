'use client';

import dynamic from 'next/dynamic';
import { Park } from '@/lib/types/park';
import { Skeleton } from '@/components/ui/skeleton';

const MapContent = dynamic(() => import('./NearbyParksMapContent'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
});

interface NearbyParksMapProps {
  parks: Park[];
  center: { lat: number; lng: number };
  selectedParkId?: string;
  onParkSelect?: (park: Park) => void;
}

export function NearbyParksMap({ selectedParkId: _, ...props }: NearbyParksMapProps) {
  void _;
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-white/10">
      <MapContent {...props} />
    </div>
  );
}
