"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserChats } from "@/hooks/message/useMessage";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatListSkeleton } from "@/components/chat/ChatListSkeleton";
import { ChatListItem } from "@/components/chat/ChatListItem";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: chats, isLoading } = useUserChats(userId || "");
  const pathname = usePathname();
  const selectedMatchId = pathname.split("/").pop();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black/[0.96]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="relative h-screen flex">
        <div className="w-80 border-r border-white/[0.05] overflow-y-auto">
          <div className="p-4">
            <h1 className="text-2xl font-semibold text-white/90 mb-4">
              Messages
            </h1>
            <div className="space-y-2">
              {isLoading ? (
                <ChatListSkeleton />
              ) : (
                chats?.map((chat) => (
                  <ChatListItem
                    key={chat.matchId}
                    chat={chat}
                    isSelected={selectedMatchId === chat.matchId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
