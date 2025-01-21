import { LocationDto } from "@/lib/types/location";
import { PetPurpose } from "@/lib/types/pet";
import { MapPin, PawPrint, Target, Heart } from "lucide-react";
import { LocationMap } from "@/components/map/LocationMap";

// Import shadcn components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
  [PetPurpose.Friendship]: {
    label: "Friendship",
    icon: <PawPrint className="w-4 h-4" />,
  },
  [PetPurpose.Playdate]: {
    label: "Playdate",
    icon: <Heart className="w-4 h-4" />,
  },
};

export function PetInfo({ personality, purpose, location }: PetInfoProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        {/* Personality Section */}
        <Card className="overflow-hidden bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
                <PawPrint className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl font-medium">Personality</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {personality.map((trait) => (
                <Badge
                  key={trait}
                  variant="secondary"
                  className="px-4 py-2 text-sm justify-center hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition-colors"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purpose Section */}
        <Card className="overflow-hidden bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl font-medium">Looking For</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {purpose.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl 
                           bg-purple-50 dark:bg-purple-900/20 
                           text-purple-700 dark:text-purple-300"
                >
                  {purposeLabels[p].icon}
                  <span className="text-sm font-medium">
                    {purposeLabels[p].label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Section */}
        {location && (
          <Card className="overflow-hidden bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-medium">Location</CardTitle>
              </div>
            </CardHeader>
            <Separator />
            <div className="relative h-64">
              <LocationMap location={location} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-lg font-medium text-white">
                  {location.city}
                </p>
                <p className="text-sm text-white/80">{location.country}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
