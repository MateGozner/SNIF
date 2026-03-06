'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChatSummaryDto } from '@/lib/types/message';
import { useProfile, useProfilePicture } from '@/hooks/profile/useProfile';
import { ProfileAvatarWithStatus } from '@/components/profile/ProfileAvatarWithStatus';
import { useOnlineStatus } from '@/contexts/signalR/OnlineContext';
import { ProfilePictureDto } from '@/lib/types/user';

interface ConversationListItemProps {
  chat: ChatSummaryDto;
  isSelected: boolean;
}

export function ConversationListItem({ chat, isSelected }: ConversationListItemProps) {
  const { data: partner } = useProfile(chat.partnerId);
  const { data: profilePicture } = useProfilePicture(chat.partnerId) as {
    data: ProfilePictureDto | undefined;
  };
  const { onlineUsers } = useOnlineStatus();
  const isOnline = onlineUsers.includes(chat.partnerId);

  if (!partner) return null;

  return (
    <Link
      href={`/messages/${chat.matchId}`}
      className={cn(
        'block p-3 rounded-xl transition-all',
        'hover:bg-white/[0.05]',
        isSelected && 'bg-white/[0.08]'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <ProfileAvatarWithStatus
            profilePicture={profilePicture?.url}
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
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="text-white/90 font-medium truncate text-sm">
              {partner.name}
            </h3>
            <span className="text-xs text-white/40 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-white/50 truncate">
            {chat.lastMessage.content}
          </p>
        </div>
      </div>
    </Link>
  );
}
