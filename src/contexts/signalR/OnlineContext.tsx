"use client";

// contexts/OnlineStatusContext.tsx
import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useOnlineStatusConnection } from "@/lib/signalR/onlineHub";
import { useAuthStore } from "@/lib/store/authStore";

interface OnlineStatusContextType {
  isConnected: boolean;
  onlineUsers: string[];
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  isConnected: false,
  onlineUsers: [],
});

export function OnlineStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const token = useAuthStore((state) => state.token);
  const { connection, startConnection, stop, onlineUsers } =
    useOnlineStatusConnection();
  const connectionAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      if (!token || !user?.id || !mounted) return;

      try {
        await startConnection(user.id);
      } catch (error) {
        console.error("Failed to establish SignalR connection:", error);

        if (mounted) {
          connectionAttemptTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              console.log("Retrying connection...");
              initializeConnection();
            }
          }, 5000);
        }
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      if (connectionAttemptTimeoutRef.current) {
        clearTimeout(connectionAttemptTimeoutRef.current);
      }
      stop();
    };
  }, [user?.id, token, startConnection, stop]);

  return (
    <OnlineStatusContext.Provider
      value={{ isConnected: !!connection, onlineUsers }}
    >
      {children}
    </OnlineStatusContext.Provider>
  );
}

export const useOnlineStatus = () => useContext(OnlineStatusContext);
