'use client';

import { Park } from '@/lib/types/park';
import { Card, CardContent } from '@/components/ui/card';
import { ParkAmenityBadge } from './ParkAmenityBadge';
import { MapPin } from 'lucide-react';

interface ParkCardProps {
  park: Park;
  onClick?: () => void;
  selected?: boolean;
}

export function ParkCard({ park, onClick, selected }: ParkCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-[#2997FF] bg-[#2997FF]/5' : 'bg-white/5 border-white/10'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate">{park.name}</h3>
            {park.distance !== undefined && (
              <div className="flex items-center gap-1 text-sm text-white/50 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{park.distance < 1 ? `${(park.distance * 1000).toFixed(0)}m` : `${park.distance.toFixed(1)}km`} away</span>
              </div>
            )}
          </div>
        </div>
        {park.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {park.amenities.map((amenity) => (
              <ParkAmenityBadge key={amenity} amenity={amenity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
