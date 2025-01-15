import { LocationDto } from "@/lib/types/location";
import { LocationMap } from "../map/LocationMap";
import { motion } from "framer-motion";

interface ProfileLocationProps {
  location: LocationDto;
}

export function ProfileLocation({ location }: ProfileLocationProps) {
  if (!location) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium text-white/90">
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : location.address || "Location available"}
          </span>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/[0.1] shadow-2xl">
        <LocationMap location={location} />
      </div>
    </motion.div>
  );
}
