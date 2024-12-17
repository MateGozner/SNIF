// src/components/pets/detail/PetInfo.tsx
import { LocationDto } from "@/lib/types/location";
import { PetPurpose } from "@/lib/types/pet";
import { MapPin, PawPrint, Target, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { LocationMap } from "@/components/map/LocationMap";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PetInfoProps {
  personality: string[];
  purpose: PetPurpose[];
  location?: LocationDto;
}

const purposeLabels: Record<
  PetPurpose,
  { label: string; icon: React.ReactNode }
> = {
  [PetPurpose.Breeding]: {
    label: "Breeding",
    icon: <Heart className="w-4 h-4" />,
  },
  [PetPurpose.PlayDate]: {
    label: "Play Date",
    icon: <PawPrint className="w-4 h-4" />,
  },
  [PetPurpose.Both]: {
    label: "Breeding & Play Dates",
    icon: <Heart className="w-4 h-4" />,
  },
};

export function PetInfo({ personality, purpose, location }: PetInfoProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        {/* Personality Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]"
        >
          <Card className="p-6 bg-transparent border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl">
                <PawPrint className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-medium text-white tracking-tight">
                Personality
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {personality.map((trait) => (
                <motion.div
                  key={trait}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl p-4 bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
                  <span className="relative text-base font-medium text-white/90">
                    {trait}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Purpose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]"
        >
          <Card className="p-6 bg-transparent border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-medium text-white tracking-tight">
                Looking For
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {purpose.map((p) => (
                <motion.div
                  key={p}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
                    {purposeLabels[p].icon}
                  </div>
                  <span className="text-white/90">
                    {purposeLabels[p].label}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Location Section */}
        {location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]"
          >
            <Card className="bg-transparent border-none">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-medium text-white tracking-tight">
                    Location
                  </h2>
                </div>
              </div>

              <div className="relative">
                <LocationMap location={location} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xl font-medium text-white mb-1">
                    {location.city}
                  </p>
                  <p className="text-sm text-white/60">{location.country}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}
