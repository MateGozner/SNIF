export interface Park {
  id: string;
  name: string;
  lat: number;
  lng: number;
  amenities: ParkAmenity[];
  distance?: number;
}

export type ParkAmenity =
  | 'dog-friendly'
  | 'fenced'
  | 'water'
  | 'parking'
  | 'lighting'
  | 'benches'
  | 'waste-bins'
  | 'off-leash'
  | 'agility'
  | 'shade';

export interface MeetupLocation {
  parkId: string;
  parkName: string;
  lat: number;
  lng: number;
}
