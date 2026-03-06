'use client';

import { MessageSquare } from 'lucide-react';

export function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="h-16 w-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-white/20" />
      </div>
      <h3 className="text-lg font-medium text-white/60 mb-2">No conversations yet</h3>
      <p className="text-sm text-white/40 max-w-xs">
        Match with pets to start chatting! Your conversations will appear here.
      </p>
    </div>
  );
}
