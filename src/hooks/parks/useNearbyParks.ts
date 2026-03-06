'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Park, ParkAmenity } from '@/lib/types/park';

interface GeoPosition {
  lat: number;
  lng: number;
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function extractAmenities(tags: Record<string, string>): ParkAmenity[] {
  const amenities: ParkAmenity[] = [];
  if (tags.dog === 'yes' || tags.leisure === 'dog_park') amenities.push('dog-friendly');
  if (tags.fenced === 'yes' || tags.fence === 'yes') amenities.push('fenced');
  if (tags.drinking_water === 'yes' || tags.water === 'yes') amenities.push('water');
  if (tags.parking === 'yes') amenities.push('parking');
  if (tags.lit === 'yes') amenities.push('lighting');
  if (tags.bench === 'yes') amenities.push('benches');
  if (tags.waste_disposal === 'yes') amenities.push('waste-bins');
  if (tags.dog === 'unleashed') amenities.push('off-leash');
  return amenities;
}

async function fetchParksFromOverpass(
  lat: number,
  lng: number,
  radiusMeters: number
): Promise<Park[]> {
  const query = `
    [out:json][timeout:10];
    (
      way["leisure"="park"](around:${radiusMeters},${lat},${lng});
      way["leisure"="dog_park"](around:${radiusMeters},${lat},${lng});
      node["leisure"="dog_park"](around:${radiusMeters},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) throw new Error('Failed to fetch parks');

  const data = await response.json();

  return data.elements.map(
    (el: { id: number; tags?: Record<string, string>; center?: { lat: number; lon: number }; lat?: number; lon?: number }) => {
      const parkLat = el.center?.lat ?? el.lat ?? 0;
      const parkLng = el.center?.lon ?? el.lon ?? 0;
      const tags = el.tags ?? {};

      return {
        id: String(el.id),
        name: tags.name || 'Unnamed Park',
        lat: parkLat,
        lng: parkLng,
        amenities: extractAmenities(tags),
        distance: haversineDistance(lat, lng, parkLat, parkLng),
      } satisfies Park;
    }
  ).sort((a: Park, b: Park) => (a.distance ?? 0) - (b.distance ?? 0));
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message)
    );
  }, []);

  return { position, error };
}

export function useNearbyParks(radiusKm = 5) {
  const { position, error: geoError } = useGeolocation();

  const query = useQuery({
    queryKey: ['parks', position?.lat, position?.lng, radiusKm],
    queryFn: () =>
      fetchParksFromOverpass(position!.lat, position!.lng, radiusKm * 1000),
    enabled: !!position,
    staleTime: 300_000,
  });

  return {
    ...query,
    geoError,
    position,
  };
}
