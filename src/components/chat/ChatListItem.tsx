import { useProfile, useProfilePicture } from "@/hooks/profile/useProfile";
import { useMatch } from "@/hooks/matches/useMatches";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProfileAvatarWithStatus } from "@/components/profile/ProfileAvatarWithStatus";
import { useOnlineStatus } from "@/contexts/signalR/OnlineContext";
import { ChatSummaryDto } from "@/lib/types/message";
import { ProfilePictureDto } from "@/lib/types/user";

export function ChatListItem({
  chat,
  isSelected,
}: {
  chat: ChatSummaryDto;
  isSelected: boolean;
}) {
  const { data: match } = useMatch(chat.matchId);
  const { data: partner } = useProfile(chat.partnerId);
  const { data: reciveProfilePicture } = useProfilePicture(chat.partnerId) as {
    data: ProfilePictureDto | undefined;
  };
  const { onlineUsers } = useOnlineStatus();
  const isOnline = onlineUsers.includes(chat.partnerId);

  if (!match || !partner) return null;

  const { initiatorPet, targetPet } = match;

  return (
    <Link
      href={`/messages/${chat.matchId}`}
      className={cn(
        "block p-4 rounded-xl transition-all",
        "hover:bg-white/[0.05]",
        isSelected && "bg-white/[0.08]"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ProfileAvatarWithStatus
            profilePicture={reciveProfilePicture?.url}
            name={partner.name}
            isOnline={isOnline}
            showStatus={true}
            isOnFileSelect={false}
            onFileSelect={undefined}
          />
          {chat.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2997FF] rounded-full flex items-center justify-center text-xs font-medium text-white">
              {chat.unreadCount}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-white/90 font-medium truncate">
              {partner.name}
            </h3>
            <span className="text-xs text-white/40 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-white/60 truncate">
              {chat.lastMessage.content}
            </p>
            <p className="text-xs text-white/40 truncate">
              {initiatorPet.name} & {targetPet.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
