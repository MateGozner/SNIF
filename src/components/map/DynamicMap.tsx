// src/components/DynamicMap.tsx
'use client';

import { LocationDto } from "@/lib/types/location";
import { Map, Marker } from 'pigeon-maps';

interface DynamicMapProps {
  location: LocationDto;
}

export default function DynamicMap({ location }: DynamicMapProps) {
  if (!location.latitude || !location.longitude) return null;

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden">
      <Map
        defaultCenter={[location.latitude, location.longitude]}
        defaultZoom={13}
      >
        <Marker
          width={50}
          anchor={[location.latitude, location.longitude]}
          onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}`)}
        />
      </Map>
    </div>
  );
}