'use client';

import { Park } from '@/lib/types/park';
import { ParkCard } from './ParkCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ParkListProps {
  parks: Park[];
  selectedParkId?: string;
  onParkSelect?: (park: Park) => void;
}

export function ParkList({ parks, selectedParkId, onParkSelect }: ParkListProps) {
  if (parks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/40 text-sm">
        No parks found nearby.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-2">
      <div className="space-y-3">
        {parks.map((park) => (
          <ParkCard
            key={park.id}
            park={park}
            selected={selectedParkId === park.id}
            onClick={() => onParkSelect?.(park)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
