"use client";
import { Chat } from "@/components/chat/Chat";
import { useAuthStore } from "@/lib/store/authStore";
import { useProfile, useProfilePicture } from "@/hooks/profile/useProfile";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMatch } from "@/hooks/matches/useMatches";
import { toast } from "sonner";
import { ProfilePictureDto } from "@/lib/types/user";

export default function ChatPage() {
  const params = useParams();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: match, isLoading: isLoadingChat } = useMatch(
    params.matchId as string
  );
  const router = useRouter();

  const targetPet = match
    ? match.initiatorPet.ownerId === userId
      ? match.targetPet
      : match.initiatorPet
    : null;

  const { data: receiver, isLoading: isLoadingUser } = useProfile(
    targetPet?.ownerId ?? ""
  );
    const { data: reciveProfilePicture } = useProfilePicture(
      targetPet?.ownerId ?? ""
    ) as {
      data: ProfilePictureDto | undefined;
    };

  if (isLoadingChat || isLoadingUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
      </div>
    );
  }

  if (!match || !userId) {
    if (!userId) {
      toast.error("User not found");
    } else {
      toast.error("Match not found");
    }
    router.back();
  }

  if (!receiver) return null;

  return (
    <Chat
      matchId={params.matchId as string}
      receiverId={receiver.id}
      receiverName={receiver.name}
      receiverAvatar={reciveProfilePicture?.url}
    />
  );
}
