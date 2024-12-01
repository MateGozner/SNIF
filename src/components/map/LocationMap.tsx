// src/components/LocationMap.tsx
'use client';

import { LocationDto } from "@/lib/types/location";
import dynamic from "next/dynamic";

interface LocationMapProps {
  location: LocationDto;
}

const MapWithNoSSR = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted animate-pulse" />
  ),
});

export function LocationMap({ location }: LocationMapProps) {
  return <MapWithNoSSR location={location} />;
}