//lib/types/message.ts
export interface MessageReactionDto {
  id: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  isRead: boolean;
  createdAt: string;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentFileName?: string;
  attachmentSizeBytes?: number;
  reactions: MessageReactionDto[];
}

export interface CreateMessageDto {
  content: string;
  receiverId: string;
  matchId: string;
}

export interface ChatSummaryDto {
  matchId: string;
  partnerId: string;
  partnerName: string;
  lastMessage: MessageDto;
  unreadCount: number;
}
