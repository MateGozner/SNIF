// src/components/matches/PotentialMatchCard.tsx
import { motion } from "framer-motion";
import { PetDto, PetPurpose } from "@/lib/types/pet";
import { useCreateMatch } from "@/hooks/matches/useMatches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetGallery } from "@/components/pets/detail/PetGallery";
import { Heart, X, PawPrint, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PotentialMatchCardProps {
  pet: PetDto;
  currentPetId: string;
  purpose: PetPurpose;
}

export function PotentialMatchCard({
  pet,
  currentPetId,
  purpose,
}: PotentialMatchCardProps) {
  const createMatch = useCreateMatch();

  const handleMatch = async () => {
    await createMatch.mutateAsync({
      initiatorPetId: currentPetId,
      targetPetId: pet.id,
      matchPurpose: purpose,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="overflow-hidden backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="relative">
          <PetGallery
            photos={pet.photos}
            videos={pet.videos}
            name={pet.name}
            petId={pet.id}
            showAddMedia={false}
            variant="minimal"
            aspectRatio="wide"
            className="bg-transparent"
          />

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">
                  {pet.name}
                </h3>
                <span className="text-white/80">{pet.age} years</span>
              </div>

              <div className="flex items-center gap-4 text-white/60">
                <div className="flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  <span>{pet.breed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{pet.gender === 0 ? "Male" : "Female"}</span>
                </div>
              </div>

              {pet.personality.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {pet.personality.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/80"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              onClick={() => {
                /* Skip logic */
              }}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full",
                "bg-[#2997FF] hover:bg-[#147CE5]",
                "shadow-lg shadow-blue-500/20",
                "transition-all duration-200"
              )}
              onClick={handleMatch}
              disabled={createMatch.isPending}
            >
              <Heart className="h-6 w-6 text-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
