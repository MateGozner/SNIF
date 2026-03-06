"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { SignalRProvider } from "@/contexts/signalR/SignalRContext";
import { OnlineProvider } from "@/contexts/signalR/OnlineContext";
import { MatchNotification } from "@/components/matches/MatchNotification";
import { VideoProvider } from "@/contexts/signalR/VideoContext";
import IncomingCallNotification from "@/components/chat/IncomingCallNotification";
import { ChatProvider } from "@/contexts/signalR/ChatContext";
import { Sidebar } from "@/components/sidebar/SideBar";
import { Toaster } from "sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SignalRProvider>
          <OnlineProvider>
            <MatchNotification />
            <VideoProvider>
              <ChatProvider>
                <IncomingCallNotification />
                <div className="flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 md:pl-64 pb-[4.5rem] md:pb-0">
                    {children}
                  </main>
                </div>
                <Toaster
                  position="top-right"
                  richColors
                  toastOptions={{
                    className: "!p-0 !bg-transparent !border-0",
                    duration: 5000,
                    style: { zIndex: 9999 },
                  }}
                />
              </ChatProvider>
            </VideoProvider>
          </OnlineProvider>
        </SignalRProvider>
      </AuthProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
