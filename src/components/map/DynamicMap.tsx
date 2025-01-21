import React from "react";
import { Map, Marker } from "pigeon-maps";
import { LocationDto } from "@/lib/types/location";
import { Player } from "@lottiefiles/react-lottie-player";

const mapTilerProvider = (x: number, y: number, z: number) => {
  // Using OpenStreetMap for demo, replace with your MapTiler key in production
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
};

interface DynamicMapProps {
  location: LocationDto;
}

export default function DynamicMap({ location }: DynamicMapProps) {
  if (!location.latitude || !location.longitude) return null;

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden shadow-lg">
      <Map
        defaultCenter={[location.latitude, location.longitude]}
        defaultZoom={13}
        provider={mapTilerProvider}
        metaWheelZoom={true}
        animate={true}
        attribution={false}
      >
        <Marker
          width={50}
          anchor={[location.latitude, location.longitude]}
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
            )
          }
        >
          <div className="relative cursor-pointer transform hover:scale-110 transition-transform duration-200">
            <div className="w-16 h-16">
              <Player
                src="/animations/pet-location.json"
                loop={true}
                autoplay={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
}
