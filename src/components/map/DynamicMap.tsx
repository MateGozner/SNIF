import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LocationDto } from "@/lib/types/location";
import { Player } from "@lottiefiles/react-lottie-player";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface DynamicMapProps {
  location: LocationDto;
}

export default function DynamicMap({ location }: DynamicMapProps) {
  if (!location.latitude || !location.longitude) return null;

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <div
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
                )
              }
            >
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
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
