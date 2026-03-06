'use client';

import { useState, useMemo } from 'react';
import { useConversations } from '@/hooks/chat/useConversations';
import { ConversationList } from '@/components/chat/ConversationList';
import { EmptyConversations } from '@/components/chat/EmptyConversations';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessagesPage() {
  const { data: conversations, isLoading } = useConversations();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!conversations) return [];
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.partnerName.toLowerCase().includes(q) ||
        c.lastMessage.content.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Conversation List Panel */}
      <div className="w-full lg:w-96 lg:border-r border-white/[0.06] flex flex-col h-full">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="space-y-3 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-white/[0.05]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/[0.05]" />
                    <Skeleton className="h-3 w-40 bg-white/[0.05]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyConversations />
          ) : (
            <ConversationList conversations={filtered} />
          )}
        </div>
      </div>

      {/* Chat Panel - placeholder for desktop */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-white/20" />
          </div>
          <p className="text-white/40">Select a conversation to start messaging</p>
        </div>
      </div>
    </div>
  );
}
