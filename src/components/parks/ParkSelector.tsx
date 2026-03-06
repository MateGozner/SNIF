'use client';

import { useState } from 'react';
import { Park, MeetupLocation } from '@/lib/types/park';
import { useNearbyParks } from '@/hooks/parks/useNearbyParks';
import { ParkList } from './ParkList';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MapPin, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ParkSelectorProps {
  onSelect: (location: MeetupLocation) => void;
  trigger?: React.ReactNode;
}

export function ParkSelector({ onSelect, trigger }: ParkSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const { data: parks, isLoading, geoError } = useNearbyParks(5);

  const handleConfirm = () => {
    if (!selectedPark) return;
    onSelect({
      parkId: selectedPark.id,
      parkName: selectedPark.name,
      lat: selectedPark.lat,
      lng: selectedPark.lng,
    });
    setOpen(false);
    setSelectedPark(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-1.5">
            <MapPin className="h-4 w-4" />
            Suggest Park
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a meetup park</DialogTitle>
        </DialogHeader>

        {geoError ? (
          <p className="text-sm text-red-400 py-4">
            Location access denied. Enable location to find nearby parks.
          </p>
        ) : isLoading ? (
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding nearby parks...
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <ParkList
            parks={parks ?? []}
            selectedParkId={selectedPark?.id}
            onParkSelect={setSelectedPark}
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPark}>
            Select Park
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
