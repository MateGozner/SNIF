'use client';

import { ChatSummaryDto } from '@/lib/types/message';
import { ConversationListItem } from './ConversationListItem';

interface ConversationListProps {
  conversations: ChatSummaryDto[];
  selectedMatchId?: string;
}

export function ConversationList({ conversations, selectedMatchId }: ConversationListProps) {
  return (
    <div className="space-y-1">
      {conversations.map((chat) => (
        <ConversationListItem
          key={chat.matchId}
          chat={chat}
          isSelected={chat.matchId === selectedMatchId}
        />
      ))}
    </div>
  );
}
