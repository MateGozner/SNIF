'use client';

import { useState } from 'react';
import { useNearbyParks } from '@/hooks/parks/useNearbyParks';
import { NearbyParksMap } from '@/components/parks/NearbyParksMap';
import { ParkList } from '@/components/parks/ParkList';
import { Park } from '@/lib/types/park';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, TreePine, AlertCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function ParksPage() {
  const [radius, setRadius] = useState(5);
  const { data: parks, isLoading, geoError, position } = useNearbyParks(radius);
  const [selectedParkId, setSelectedParkId] = useState<string | undefined>();

  const handleParkSelect = (park: Park) => {
    setSelectedParkId(park.id);
  };

  return (
    <div className="min-h-screen bg-black/[0.98] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <TreePine className="h-7 w-7 text-emerald-400" />
          <h1 className="text-2xl font-bold">Nearby Parks</h1>
        </div>

        {geoError ? (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <div>
              <p className="font-medium text-red-300">Location access required</p>
              <p className="text-sm text-red-400/70">
                Enable location access in your browser to discover nearby parks.
              </p>
            </div>
          </div>
        ) : isLoading || !position ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Radius control */}
            <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <MapPin className="h-5 w-5 text-[#2997FF] shrink-0" />
              <div className="flex-1">
                <label className="text-sm text-white/60 block mb-2">
                  Search radius: {radius} km
                </label>
                <Slider
                  value={[radius]}
                  onValueChange={([v]) => setRadius(v)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NearbyParksMap
                  parks={parks ?? []}
                  center={position}
                  selectedParkId={selectedParkId}
                  onParkSelect={handleParkSelect}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60 mb-3">
                  {parks?.length ?? 0} parks found
                </h3>
                <ParkList
                  parks={parks ?? []}
                  selectedParkId={selectedParkId}
                  onParkSelect={handleParkSelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
