// contexts/ChatContext.tsx
import { createContext, useContext, useEffect, useMemo } from "react";
import { useChatHub } from "@/lib/signalR/chatHub";
import { MessageDto } from "@/lib/types/message";
import { produce } from "immer";
import React from "react";

type ConnectionState = "connecting" | "connected" | "disconnected";

interface ChatState {
  messages: Record<string, MessageDto[]>;
  connectionState: ConnectionState;
}

interface ChatContextType extends ChatState {
  sendMessage: (
    matchId: string,
    receiverId: string,
    content: string
  ) => Promise<void>;
  joinChat: (matchId: string) => Promise<void>;
  leaveChat: (matchId: string) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<ChatState>({
    messages: {},
    connectionState: "disconnected",
  });

  const {
    connection,
    sendMessage: hubSendMessage,
    joinChat: hubJoinChat,
    leaveChat: hubLeaveChat,
    markMessageAsRead: hubMarkMessageAsRead,
    connectionState,
  } = useChatHub();

  // Update connection state
  useEffect(() => {
    setState((state) => ({
      ...state,
      connectionState,
    }));
  }, [connectionState]);

  // Set up SignalR event handlers
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = (message: MessageDto) => {
      setState((currentState) =>
        produce(currentState, (draft) => {
          const matchMessages = draft.messages[message.matchId] || [];
          // Prevent duplicate messages
          if (!matchMessages.some((m) => m.id === message.id)) {
            draft.messages[message.matchId] = [...matchMessages, message];
          }
        })
      );
    };

    const handleMessageRead = (messageId: string) => {
      setState((currentState) =>
        produce(currentState, (draft) => {
          Object.keys(draft.messages).forEach((matchId) => {
            const messageIndex = draft.messages[matchId].findIndex(
              (m) => m.id === messageId
            );
            if (messageIndex !== -1) {
              draft.messages[matchId][messageIndex].isRead = true;
            }
          });
        })
      );
    };

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageRead", handleMessageRead);

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageRead", handleMessageRead);
    };
  }, [connection]);

  const sendMessage = React.useCallback(
    async (
      matchId: string,
      receiverId: string,
      content: string
    ): Promise<void> => {
      if (!connection) throw new Error("No connection available");
      await hubSendMessage(matchId, receiverId, content);
    },
    [connection, hubSendMessage]
  );

  const joinChat = React.useCallback(
    async (matchId: string): Promise<void> => {
      if (!connection) throw new Error("No connection available");
      await hubJoinChat(matchId);
    },
    [connection, hubJoinChat]
  );

  const leaveChat = React.useCallback(
    async (matchId: string): Promise<void> => {
      if (!connection) throw new Error("No connection available");
      await hubLeaveChat(matchId);
    },
    [connection, hubLeaveChat]
  );

  const markMessageAsRead = React.useCallback(
    async (messageId: string): Promise<void> => {
      if (!connection) throw new Error("No connection available");
      await hubMarkMessageAsRead(messageId);
    },
    [connection, hubMarkMessageAsRead]
  );

  const value = React.useMemo(
    () => ({
      ...state,
      sendMessage,
      joinChat,
      leaveChat,
      markMessageAsRead,
    }),
    [state, sendMessage, joinChat, leaveChat, markMessageAsRead]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

interface UseChatResult extends Omit<ChatContextType, "messages"> {
  messages: MessageDto[];
}

export const useChat = (matchId?: string): UseChatResult => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }

  return useMemo(() => {
    if (matchId) {
      return {
        ...context,
        messages: context.messages[matchId] || [],
      };
    }
    return {
      ...context,
      messages: [],
    };
  }, [context, matchId]);
};
