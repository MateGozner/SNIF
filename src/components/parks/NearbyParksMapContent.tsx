'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Park } from '@/lib/types/park';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface NearbyParksMapContentProps {
  parks: Park[];
  center: { lat: number; lng: number };
  onParkSelect?: (park: Park) => void;
}

export default function NearbyParksMapContent({
  parks,
  center,
  onParkSelect,
}: NearbyParksMapContentProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      <Circle
        center={[center.lat, center.lng]}
        radius={100}
        pathOptions={{ color: '#2997FF', fillColor: '#2997FF', fillOpacity: 0.3 }}
      />

      {/* Park markers */}
      {parks.map((park) => (
        <Marker
          key={park.id}
          position={[park.lat, park.lng]}
          eventHandlers={{
            click: () => onParkSelect?.(park),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{park.name}</p>
              {park.distance !== undefined && (
                <p className="text-gray-500">
                  {park.distance < 1
                    ? `${(park.distance * 1000).toFixed(0)}m`
                    : `${park.distance.toFixed(1)}km`}
                </p>
              )}
              {park.amenities.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {park.amenities.join(', ')}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
