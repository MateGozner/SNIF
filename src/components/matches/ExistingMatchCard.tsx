import { motion } from "framer-motion";
import { MatchDto, MatchStatus } from "@/lib/types/match";
import { useUpdateMatchStatus } from "@/hooks/matches/useMatches";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PetGallery } from "@/components/pets/detail/PetGallery";
import {
  Check,
  X,
  Clock,
  Calendar,
  PawPrint,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useProfile, useProfilePicture } from "@/hooks/profile/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PetPurpose } from "@/lib/types/pet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ProfilePictureDto } from "@/lib/types/user";

interface ExistingMatchCardProps {
  match: MatchDto;
  currentPetId: string;
}

export function ExistingMatchCard({
  match,
  currentPetId,
}: ExistingMatchCardProps) {
  const updateStatus = useUpdateMatchStatus();
  const targetPet =
    match.initiatorPet.id === currentPetId
      ? match.targetPet
      : match.initiatorPet;
  const { data: owner } = useProfile(targetPet.ownerId);
  const { data: reciveProfilePicture } = useProfilePicture(
    targetPet.ownerId
  ) as {
    data: ProfilePictureDto | undefined;
  };

  const statusConfig = {
    [MatchStatus.Pending]: {
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
      icon: Clock,
      label: "Pending",
    },
    [MatchStatus.Accepted]: {
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
      icon: Check,
      label: "Accepted",
    },
    [MatchStatus.Rejected]: {
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
      icon: X,
      label: "Rejected",
    },
    [MatchStatus.Expired]: {
      color: "text-gray-400",
      bgColor: "bg-gray-400/10",
      borderColor: "border-gray-400/20",
      icon: Calendar,
      label: "Expired",
    },
  };

  const currentStatus = statusConfig[match.status];
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/5 backdrop-blur-xl border-white/10">
        <div className="relative">
          <PetGallery
            media={targetPet.media || []}
            name={targetPet.name}
            petId={targetPet.id}
            showAddMedia={false}
            variant="minimal"
            aspectRatio="square"
            className="bg-transparent"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-30">
            <div
              className={cn(
                "px-2.5 py-1 rounded-full",
                "bg-black/30 backdrop-blur-md border",
                "flex items-center gap-1.5",
                "text-xs font-medium",
                currentStatus.color,
                currentStatus.borderColor
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {currentStatus.label}
            </div>
          </div>

          {/* Match Purpose Badge */}
          <div className="absolute bottom-3 right-3 z-30">
            <Badge
              variant="outline"
              className="bg-black/30 backdrop-blur-md border-white/10"
            >
              {PetPurpose[match.matchPurpose]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Pet Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <h3 className="text-lg font-medium text-white truncate">
                {targetPet.name}
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <PawPrint className="h-3.5 w-3.5" />
                <span className="truncate">{targetPet.breed}</span>
              </div>
            </div>
            {match.expiresAt && (
              <span className="text-xs text-white/40 shrink-0">
                {formatDistanceToNow(new Date(match.expiresAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          {owner && (
            <>
              <Separator className="bg-white/[0.08]" />

              <div className="flex items-center gap-3">
                <Link href={`/profile/${owner.id}`}>
                  <Avatar className="h-8 w-8 ring-1 ring-white/10 transition-transform hover:scale-105">
                    <AvatarImage
                      src={reciveProfilePicture?.url || ""}
                      alt={owner.name}
                    />
                    <AvatarFallback className="bg-white/5 text-white/80 text-xs">
                      {owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 truncate">
                      {owner.name}
                    </span>
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        owner.isOnline ? "bg-emerald-400" : "bg-white/20"
                      )}
                    />
                  </div>
                  {match.status === MatchStatus.Accepted && (
                    <Link href={`/messages/${match.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#2997FF] hover:bg-[#2997FF]/10 transition-all duration-200"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>

        {match.status === MatchStatus.Pending &&
          match.targetPet.id === currentPetId && (
            <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() =>
                  updateStatus.mutate({
                    id: match.id,
                    status: MatchStatus.Rejected,
                  })
                }
                disabled={updateStatus.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                onClick={() =>
                  updateStatus.mutate({
                    id: match.id,
                    status: MatchStatus.Accepted,
                  })
                }
                disabled={updateStatus.isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
            </CardFooter>
          )}
      </Card>
    </motion.div>
  );
}
