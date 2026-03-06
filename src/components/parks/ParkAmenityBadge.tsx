import { Badge } from '@/components/ui/badge';
import { ParkAmenity } from '@/lib/types/park';
import {
  Fence,
  Droplets,
  CarFront,
  Lightbulb,
  Armchair,
  Trash2,
  Dog,
  TreePine,
  Dumbbell,
} from 'lucide-react';

const amenityConfig: Record<ParkAmenity, { label: string; icon: typeof Dog }> = {
  'dog-friendly': { label: 'Dog Friendly', icon: Dog },
  fenced: { label: 'Fenced', icon: Fence },
  water: { label: 'Water', icon: Droplets },
  parking: { label: 'Parking', icon: CarFront },
  lighting: { label: 'Lit', icon: Lightbulb },
  benches: { label: 'Benches', icon: Armchair },
  'waste-bins': { label: 'Waste Bins', icon: Trash2 },
  'off-leash': { label: 'Off-Leash', icon: Dog },
  agility: { label: 'Agility', icon: Dumbbell },
  shade: { label: 'Shade', icon: TreePine },
};

interface ParkAmenityBadgeProps {
  amenity: ParkAmenity;
}

export function ParkAmenityBadge({ amenity }: ParkAmenityBadgeProps) {
  const config = amenityConfig[amenity];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="gap-1 text-xs bg-white/5 border-white/10 text-white/70">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
