"use client";

import { createContext, useContext } from "react";
import { useOnlineStatusConnection } from "@/lib/signalR/onlineHub";

interface OnlineContextValue {
  isConnected: boolean;
  onlineUsers: string[];
  connectionState: "disconnected" | "connecting" | "connected";
}

const OnlineContext = createContext<OnlineContextValue>({
  isConnected: false,
  onlineUsers: [],
  connectionState: "disconnected",
});

export function OnlineProvider({ children }: { children: React.ReactNode }) {
  const { connection, onlineUsers, connectionState } =
    useOnlineStatusConnection();

  return (
    <OnlineContext.Provider
      value={{
        isConnected: connectionState === "connected",
        onlineUsers,
        connectionState,
      }}
    >
      {children}
    </OnlineContext.Provider>
  );
}

export const useOnlineStatus = () => useContext(OnlineContext);
