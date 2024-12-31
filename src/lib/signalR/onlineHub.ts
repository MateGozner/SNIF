"use client";

// lib/signalR/onlineHub.ts
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import { useState, useCallback, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function useOnlineStatusConnection() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);
  const attemptingReconnect = useRef(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const startConnection = useCallback(async (userId: string) => {
    if (connectionRef.current?.state === HubConnectionState.Connected) {
      console.log("Connection already exists and is connected");
      return connectionRef.current;
    }

    if (attemptingReconnect.current) {
      console.log("Already attempting to reconnect");
      return null;
    }

    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        console.log("No auth token available");
        return null;
      }

      attemptingReconnect.current = true;
      console.log("Starting new SignalR connection for online status");
      console.log("Token being used:", token);

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}onlineHub`, {
          accessTokenFactory: () => token,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount < 3) return 2000;
            return null;
          },
        })
        .configureLogging(LogLevel.Debug)
        .build();

      // Set up online status event handlers
      newConnection.on("UserOnline", (userId: string) => {
        setOnlineUsers((prev) => [...prev, userId]);
      });

      newConnection.on("UserOffline", (userId: string) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      newConnection.onclose((error) => {
        console.log("Connection closed:", error);
        if (connectionRef.current === newConnection) {
          connectionRef.current = null;
          setConnection(null);
        }
        attemptingReconnect.current = false;
      });

      newConnection.onreconnecting((error) => {
        console.log("Connection reconnecting:", error);
        attemptingReconnect.current = true;
      });

      newConnection.onreconnected(async (connectionId) => {
        console.log("Connection reestablished. ID:", connectionId);
        attemptingReconnect.current = false;
      });

      await newConnection.start();
      console.log("Online status SignalR Connected");

      connectionRef.current = newConnection;
      setConnection(newConnection);
      attemptingReconnect.current = false;

      return newConnection;
    } catch (err) {
      console.error("SignalR Connection Error:", err);
      connectionRef.current = null;
      setConnection(null);
      attemptingReconnect.current = false;
      throw err;
    }
  }, []);

  const stop = useCallback(async () => {
    const currentConnection = connectionRef.current;
    if (currentConnection) {
      try {
        await currentConnection.stop();
        console.log("SignalR connection stopped");
      } catch (err) {
        console.error("Error stopping SignalR connection:", err);
      } finally {
        connectionRef.current = null;
        setConnection(null);
        attemptingReconnect.current = false;
      }
    }
  }, []);

  return { connection, startConnection, stop, onlineUsers };
}
