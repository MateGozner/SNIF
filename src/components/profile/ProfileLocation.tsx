import { LocationDto } from "@/lib/types/location";
import { LocationMap } from "../map/LocationMap";

interface ProfileLocationProps {
  location: LocationDto;
}

export function ProfileLocation({ location }: ProfileLocationProps) {
  if (!location) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Location</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : location.address || "Location available"}
          </span>
        </div>
        <LocationMap location={location} />
      </div>
    </div>
  );
}
