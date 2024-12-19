// src/components/matches/ExistingMatchCard.tsx
import { motion } from "framer-motion";
import { MatchDto, MatchStatus } from "@/lib/types/match";
import { useUpdateMatchStatus } from "@/hooks/matches/useMatches";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetGallery } from "@/components/pets/detail/PetGallery";
import { Check, X, Clock, Calendar, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ExistingMatchCardProps {
  match: MatchDto;
  currentPetId: string;
}

export function ExistingMatchCard({
  match,
  currentPetId,
}: ExistingMatchCardProps) {
  const updateStatus = useUpdateMatchStatus(match.id);
  const targetPet =
    match.initiatorPet.id === currentPetId
      ? match.targetPet
      : match.initiatorPet;

  const statusConfig = {
    [MatchStatus.Pending]: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      icon: <Clock className="h-5 w-5" />,
      label: "Pending",
    },
    [MatchStatus.Accepted]: {
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: <Check className="h-5 w-5" />,
      label: "Accepted",
    },
    [MatchStatus.Rejected]: {
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      icon: <X className="h-5 w-5" />,
      label: "Rejected",
    },
    [MatchStatus.Expired]: {
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
      icon: <Calendar className="h-5 w-5" />,
      label: "Expired",
    },
  };

  const currentStatus = statusConfig[match.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden backdrop-blur-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="relative">
          <PetGallery
            photos={targetPet.photos}
            videos={targetPet.videos}
            name={targetPet.name}
            petId={targetPet.id}
          />

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-30">
            <div
              className={cn(
                "px-3 py-1.5 rounded-full backdrop-blur-md",
                "bg-black/40 border",
                "flex items-center gap-2",
                currentStatus.color,
                currentStatus.borderColor
              )}
            >
              {currentStatus.icon}
              <span className="text-sm font-medium">{currentStatus.label}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {targetPet.name}
            </h3>
            {match.expiresAt && (
              <span className="text-sm text-white/60">
                {formatDistanceToNow(new Date(match.expiresAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <Heart className="h-4 w-4 text-[#2997FF]" />
            <span>Match Purpose: {match.matchPurpose}</span>
          </div>
        </CardContent>

        {match.status === MatchStatus.Pending &&
          match.targetPet.id === currentPetId && (
            <CardFooter className="p-6 pt-0 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10"
                onClick={() =>
                  updateStatus.mutate({ status: MatchStatus.Rejected })
                }
                disabled={updateStatus.isPending}
              >
                Decline
              </Button>
              <Button
                className="flex-1 bg-[#2997FF] hover:bg-[#147CE5] text-white"
                onClick={() =>
                  updateStatus.mutate({ status: MatchStatus.Accepted })
                }
                disabled={updateStatus.isPending}
              >
                Accept
              </Button>
            </CardFooter>
          )}
      </Card>
    </motion.div>
  );
}
