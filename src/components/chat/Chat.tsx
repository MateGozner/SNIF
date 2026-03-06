"use client";
// components/chat/Chat.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Image as ImageIcon, Loader2, Send, Video, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useMatchMessages, useSendImageMessage } from "@/hooks/message/useMessage";
import { useChat } from "@/contexts/signalR/ChatContext";
import { ProfileAvatarWithStatus } from "../profile/ProfileAvatarWithStatus";
import { AnimatePresence, motion } from "framer-motion";
import { useOnlineStatus } from "@/contexts/signalR/OnlineContext";
import { MessageDto } from "@/lib/types/message";
import { MessageStatus } from "./MessageStatus";
import { MessageReactions } from "./MessageReactions";
import { ImageLightbox } from "./ImageLightbox";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

const MAX_IMAGE_DIM = 1200;
const JPEG_QUALITY = 0.8;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= MAX_IMAGE_DIM && height <= MAX_IMAGE_DIM) {
        resolve(file);
        return;
      }
      const ratio = Math.min(MAX_IMAGE_DIM / width, MAX_IMAGE_DIM / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

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
  const [imagePreview, setImagePreview] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages: realtimeMessages,
    sendMessage,
    joinChat,
    leaveChat,
    connectionState,
    markMessageAsRead,
    sendReaction,
    removeReaction,
  } = useChat(matchId);
  const { data: initialMessages } = useMatchMessages(matchId);
  const { onlineUsers } = useOnlineStatus();
  const isReceiverOnline = onlineUsers.includes(receiverId);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const currentUserId = user?.id || "";
  const sendImageMutation = useSendImageMessage(matchId);

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) return;
    setImagePreview({ file, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleSendImage = async () => {
    if (!imagePreview) return;
    try {
      const compressed = await compressImage(imagePreview.file);
      await sendImageMutation.mutateAsync({
        image: compressed,
        receiverId,
      });
      URL.revokeObjectURL(imagePreview.url);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to send image:", error);
    }
  };

  const handleStartCall = () => {
    router.push(`/messages/${matchId}/call?receiverId=${receiverId}`);
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      await sendReaction(messageId, emoji, receiverId);
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    try {
      await removeReaction(messageId, emoji, receiverId);
    } catch (error) {
      console.error("Failed to remove reaction:", error);
    }
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
                  "flex items-end gap-2 group",
                  msg.senderId === receiverId ? "flex-row" : "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "max-w-[80%]",
                  msg.senderId === receiverId ? "" : "flex flex-col items-end"
                )}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 transition-all",
                      msg.senderId === receiverId
                        ? "bg-white/[0.05] text-white/90"
                        : "bg-[#2997FF] text-white"
                    )}
                  >
                    {msg.attachmentUrl && msg.attachmentType === "image" && (
                      <button
                        onClick={() => setLightboxSrc(msg.attachmentUrl!)}
                        className="block mb-2 rounded-lg overflow-hidden max-w-[300px]"
                      >
                        <img
                          src={msg.attachmentUrl}
                          alt={msg.attachmentFileName || "Photo"}
                          className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {msg.content && !(msg.attachmentUrl && msg.content === "📷 Photo") && (
                      <p className="break-words">{msg.content}</p>
                    )}
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
                  <MessageReactions
                    messageId={msg.id}
                    reactions={msg.reactions || []}
                    currentUserId={currentUserId}
                    isMe={msg.senderId !== receiverId}
                    onAddReaction={handleAddReaction}
                    onRemoveReaction={handleRemoveReaction}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {imagePreview && (
          <div className="px-4 pt-2 border-t border-white/[0.05]">
            <div className="relative inline-block">
              <img
                src={imagePreview.url}
                alt="Preview"
                className="h-24 rounded-lg object-cover"
              />
              <button
                onClick={() => {
                  URL.revokeObjectURL(imagePreview.url);
                  setImagePreview(null);
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
            <div className="mt-2">
              <Button
                onClick={handleSendImage}
                disabled={sendImageMutation.isPending}
                className="bg-[#2997FF] hover:bg-[#147CE5] rounded-full px-6"
              >
                {sendImageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-2">Send Photo</span>
              </Button>
            </div>
          </div>
        )}

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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="text-white/50 hover:text-white/80 rounded-full"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            </motion.div>
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

      <ImageLightbox
        src={lightboxSrc || ""}
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </Card>
  );
}
