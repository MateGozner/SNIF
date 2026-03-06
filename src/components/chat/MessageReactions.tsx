"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageReactionDto } from "@/lib/types/message";

const REACTION_EMOJIS = ["❤️", "😂", "👍", "😮", "😢", "🙏"];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute bottom-full mb-2 left-0 z-50"
    >
      <div className="flex gap-1 bg-black/80 backdrop-blur-md rounded-full px-2 py-1.5 shadow-xl border border-white/10">
        {REACTION_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-lg hover:scale-125 transition-transform p-1 rounded-full hover:bg-white/10"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

interface ReactionDisplayProps {
  reactions: MessageReactionDto[];
  currentUserId: string;
  onToggleReaction: (emoji: string) => void;
}

function ReactionDisplay({
  reactions,
  currentUserId,
  onToggleReaction,
}: ReactionDisplayProps) {
  if (!reactions || reactions.length === 0) return null;

  const grouped = reactions.reduce(
    (acc, r) => {
      acc[r.emoji] = acc[r.emoji] || { count: 0, hasOwn: false };
      acc[r.emoji].count++;
      if (r.userId === currentUserId) acc[r.emoji].hasOwn = true;
      return acc;
    },
    {} as Record<string, { count: number; hasOwn: boolean }>
  );

  return (
    <div className="flex gap-1 mt-1 flex-wrap">
      {Object.entries(grouped).map(([emoji, data]) => (
        <button
          key={emoji}
          onClick={() => onToggleReaction(emoji)}
          className={cn(
            "flex items-center gap-0.5 text-xs rounded-full px-1.5 py-0.5 transition-colors",
            data.hasOwn
              ? "bg-[#2997FF]/30 border border-[#2997FF]/50"
              : "bg-white/10 border border-white/5 hover:bg-white/15"
          )}
        >
          <span>{emoji}</span>
          {data.count > 1 && (
            <span className="text-white/70">{data.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReactionDto[];
  currentUserId: string;
  isMe: boolean;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

export function MessageReactions({
  messageId,
  reactions,
  currentUserId,
  isMe,
  onAddReaction,
  onRemoveReaction,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleToggleReaction = (emoji: string) => {
    const hasOwn = reactions?.some(
      (r) => r.emoji === emoji && r.userId === currentUserId
    );
    if (hasOwn) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showPicker && (
          <ReactionPicker
            onSelect={(emoji) => handleToggleReaction(emoji)}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>

      <ReactionDisplay
        reactions={reactions || []}
        currentUserId={currentUserId}
        onToggleReaction={handleToggleReaction}
      />

      <button
        onClick={() => setShowPicker(!showPicker)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/40 hover:text-white/60 mt-0.5"
      >
        😊+
      </button>
    </div>
  );
}
