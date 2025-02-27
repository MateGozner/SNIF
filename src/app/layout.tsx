"use client";

import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar/SideBar";
import { Toaster } from "sonner";
import { SignalRProvider } from "@/contexts/signalR/SignalRContext";
import { OnlineProvider } from "@/contexts/signalR/OnlineContext";
import { MatchNotification } from "@/components/matches/MatchNotification";
import { VideoProvider } from "@/contexts/signalR/VideoContext";
import IncomingCallNotification from "@/components/chat/IncomingCallNotification";
import { ChatProvider } from "@/contexts/signalR/ChatContext";

const queryClient = new QueryClient();

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
      </body>
    </html>
  );
}
