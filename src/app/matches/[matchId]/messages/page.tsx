//app/matches/[matchId]/messages/page.tsx
"use client";
import { Chat } from "@/components/chat/Chat";
import { Button } from "@/components/ui/button";
import { useMatch } from "@/hooks/matches/useMatches";
import { useProfile } from "@/hooks/profile/useProfile";
import { useAuthStore } from "@/lib/store/authStore";
import { ArrowLeft, Loader2 } from "lucide-react";
import { redirect, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChatPage() {
  const params = useParams();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: match, isLoading } = useMatch(params.matchId as string);
  const router = useRouter();

  // Move targetPet calculation before useProfile to avoid conditional hook call
  const targetPet = match
    ? match.initiatorPet.ownerId === userId
      ? match.targetPet
      : match.initiatorPet
    : null;

  // Call useProfile unconditionally
  const { data: receiver } = useProfile(targetPet?.ownerId ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
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
    redirect("/");
  }

  if (!receiver) {
    toast.error("Receiver not found");
    redirect("/");
  }

  return (
    <div className="relative min-h-screen inset-0 bg-black/[0.96] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="relative h-full flex flex-col">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex-1 overflow-hidden px-4">
          <Chat
            matchId={params.matchId as string}
            receiverId={receiver.id}
            receiverName={receiver.name}
            receiverAvatar={receiver.profilePicturePath}
          />
        </div>
      </div>
    </div>
  );
}
