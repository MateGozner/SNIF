"use client";
// components/chat/Chat.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2, Send, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useMatchMessages } from "@/hooks/message/useMessage";
import { useChat } from "@/contexts/signalR/ChatContext";
import { ProfileAvatarWithStatus } from "../profile/ProfileAvatarWithStatus";
import { AnimatePresence, motion } from "framer-motion";
import { useOnlineStatus } from "@/contexts/signalR/OnlineContext";
import { MessageDto } from "@/lib/types/message";
import { MessageStatus } from "./MessageStatus";
import { useRouter } from "next/navigation";

interface ChatProps {
  matchId: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export function Chat({
  matchId,
  receiverId,
  receiverName,
  receiverAvatar,
}: ChatProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages: realtimeMessages,
    sendMessage,
    joinChat,
    leaveChat,
    connectionState,
    markMessageAsRead,
  } = useChat(matchId);
  const { data: initialMessages } = useMatchMessages(matchId);
  const { onlineUsers } = useOnlineStatus();
  const isReceiverOnline = onlineUsers.includes(receiverId);
  const router = useRouter();

  const allMessages = useMemo(() => {
    const messageMap = new Map<string, MessageDto>();

    // Add initial messages to map
    initialMessages?.forEach((msg) => messageMap.set(msg.id, msg));

    // Add realtime messages to map, overwriting duplicates
    realtimeMessages.forEach((msg) => messageMap.set(msg.id, msg));

    // Convert map values back to array and sort by date
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [initialMessages, realtimeMessages]);

  useEffect(() => {
    const setupChat = async () => {
      try {
        await joinChat(matchId);
        console.log("[Chat] Successfully joined chat room:", matchId);
      } catch (error) {
        console.error("[Chat] Failed to join chat room:", error);
      }
    };

    setupChat();

    return () => {
      leaveChat(matchId).catch((error) => {
        console.error("[Chat] Failed to leave chat room:", error);
      });
    };
  }, [matchId, joinChat, leaveChat]);

  useEffect(() => {
    if (!allMessages.length) return;

    const unreadMessages = allMessages.filter(
      (msg) =>
        !msg.isRead &&
        msg.receiverId !== receiverId &&
        msg.senderId === receiverId
    );

    unreadMessages.forEach((msg) => {
      markMessageAsRead(msg.id).catch((error) => {
        console.error("Failed to mark message as read:", error);
      });
    });
  }, [allMessages, receiverId, markMessageAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(matchId, receiverId, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleStartCall = () => {
    router.push(`/messages/${matchId}/call?receiverId=${receiverId}`);
  };

  return (
    <Card className="h-screen bg-transparent border-0 overflow-hidden">
      <CardHeader className="border-b border-white/[0.05] py-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {" "}
            <ProfileAvatarWithStatus
              profilePicture={receiverAvatar}
              name={receiverName}
              isOnline={isReceiverOnline}
              showStatus={true}
              onFileSelect={undefined}
              isOnFileSelect={false}
              size="sm"
            />
            <div className="space-y-1">
              <h2 className="text-xl font-medium text-white/90">
                {receiverName}
              </h2>
              <p className="text-sm text-white/50">
                {isReceiverOnline ? "Active Now" : "Offline"}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartCall}
            className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors duration-200"
          >
            <Video className="h-5 w-5 text-[#2997FF]" />
          </motion.button>
        </motion.div>
      </CardHeader>

      <CardContent className="flex flex-col h-[calc(100vh-8rem)] p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          <AnimatePresence>
            {allMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-end gap-2",
                  msg.senderId === receiverId ? "flex-row" : "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 transition-all",
                    msg.senderId === receiverId
                      ? "bg-white/[0.05] text-white/90"
                      : "bg-[#2997FF] text-white"
                  )}
                >
                  <p className="break-words">{msg.content}</p>
                  <div className="flex items-center gap-1 text-xs opacity-60 mt-1">
                    <span>
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {msg.senderId !== receiverId && (
                      <MessageStatus isRead={msg.isRead} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/[0.05] bg-white/[0.02]">
          {connectionState !== "connected" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-yellow-500 text-sm mb-4"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {connectionState === "connecting" ? "Connecting..." : "Offline"}
            </motion.div>
          )}
          <div className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-white/[0.05] border-white/[0.05] rounded-full text-white/90 placeholder:text-white/40"
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                disabled={connectionState !== "connected"}
                className="bg-[#2997FF] hover:bg-[#147CE5] rounded-full px-6 transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
