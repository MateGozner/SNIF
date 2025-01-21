import { PetDto, Gender } from "@/lib/types/pet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils/urlTransformer";

import { PawPrint, MapPin, Cat, Dog } from "lucide-react";
import { cn } from "@/lib/utils";

interface PetCardProps {
  pet: PetDto;
}

export function PetCard({ pet }: PetCardProps) {
  const router = useRouter();
  const coverImage = pet.photos[0] ? getImageUrl(pet.photos[0]) : null;

  // Species-specific styling
  const speciesConfig = {
    Cat: {
      icon: Cat,
      gradient: "from-purple-500/10 via-transparent to-pink-500/10",
      activeBg: "group-hover:from-purple-500/20 group-hover:to-pink-500/20",
      badge: "bg-purple-500/20 border-purple-500/30 text-purple-300",
      iconColor: "text-purple-400",
    },
    Dog: {
      icon: Dog,
      gradient: "from-blue-500/10 via-transparent to-cyan-500/10",
      activeBg: "group-hover:from-blue-500/20 group-hover:to-cyan-500/20",
      badge: "bg-blue-500/20 border-blue-500/30 text-blue-300",
      iconColor: "text-blue-400",
    },
  };

  const speciesStyle = speciesConfig[pet.species as keyof typeof speciesConfig];
  const SpeciesIcon = speciesStyle.icon;

  // Gender-specific styling
  const genderConfig = {
    [Gender.Male]: {
      icon: PawPrint,
      color: "text-blue-300",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    [Gender.Female]: {
      icon: PawPrint,
      color: "text-pink-300",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
  };

  const genderStyle = genderConfig[pet.gender];
  const GenderIcon = genderStyle.icon;

  return (
    <Card
      onClick={() => router.push(`/pets/${pet.id}`)}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "bg-white/5 hover:bg-white/10",
        "backdrop-blur-xl border-white/10",
        "transition-all duration-500"
      )}
    >
      <div className="aspect-[4/3] relative">
        {/* Image or Avatar */}
        <div className="absolute inset-0">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={pet.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center",
                "bg-gradient-to-br",
                speciesStyle.gradient
              )}
            >
              <Avatar className="h-24 w-24 ring-2 ring-white/10">
                <AvatarFallback className="bg-white/5 text-2xl text-white">
                  {pet.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Gradient Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b",
              "from-black/20 via-transparent to-black/80"
            )}
          />

          {/* Species Gradient Effect */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
              speciesStyle.gradient,
              "group-hover:opacity-100"
            )}
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top Badges */}
          <div className="flex justify-between items-start">
            {/* Species Badge */}
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1.5",
                "bg-black/30 backdrop-blur-md",
                "text-white/90 text-xs px-2.5 py-1",
                speciesStyle.badge
              )}
            >
              <SpeciesIcon className="h-3.5 w-3.5" />
              {pet.species}
            </Badge>

            {/* Gender Badge */}
            <div
              className={cn(
                "flex items-center justify-center",
                "w-7 h-7 rounded-full",
                "backdrop-blur-md border",
                genderStyle.bg,
                genderStyle.border
              )}
            >
              <GenderIcon className={cn("h-4 w-4", genderStyle.color)} />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-medium text-white truncate">
                {pet.name}
              </h3>
              <span className="text-sm text-white/60 shrink-0">
                {pet.age} years
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <PawPrint
                  className={cn("h-3.5 w-3.5", speciesStyle.iconColor)}
                />
                <span className="truncate">{pet.breed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
