//lib/types/message.ts
export interface MessageDto {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  isRead: boolean;
  createdAt: string;
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
