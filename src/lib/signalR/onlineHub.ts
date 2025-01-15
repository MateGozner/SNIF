"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

type ConnectionState = "disconnected" | "connecting" | "connected";

export function useOnlineStatusConnection() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    let mounted = true;
    let currentConnection: HubConnection | null = null;

    const setupConnection = async () => {
      if (!token || !userId) return;

      try {
        setConnectionState("connecting");

        const newConnection = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_URL}onlineHub`, {
            accessTokenFactory: () => token,
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        newConnection.on("InitialOnlineUsers", (users: string[]) => {
          if (mounted) {
            console.log("Received initial online users:", users);
            setOnlineUsers(users);
          }
        });

        newConnection.on("UserOnline", (userId: string) => {
          if (mounted) {
            setOnlineUsers((prev) => [...new Set([...prev, userId])]);
          }
        });

        newConnection.on("UserOffline", (userId: string) => {
          if (mounted) {
            setOnlineUsers((prev) => prev.filter((id) => id !== userId));
          }
        });

        newConnection.onclose(() => {
          if (mounted) setConnectionState("disconnected");
        });

        newConnection.onreconnecting(() => {
          if (mounted) setConnectionState("connecting");
        });

        newConnection.onreconnected(async () => {
          if (mounted) {
            setConnectionState("connected");
            try {
              await newConnection.invoke("GetOnlineUsers");
            } catch (error) {
              console.error(
                "Failed to get online users after reconnection:",
                error
              );
            }
          }
        });

        await newConnection.start();
        currentConnection = newConnection;

        if (mounted) {
          setConnection(newConnection);
          setConnectionState("connected");
        }
      } catch (error) {
        console.error("Failed to establish connection", error);
        setConnectionState("disconnected");
      }
    };

    setupConnection();

    return () => {
      mounted = false;
      if (currentConnection) {
        currentConnection.stop();
      }
    };
  }, [token, userId]);

  return {
    connection,
    onlineUsers,
    connectionState,
  };
}
