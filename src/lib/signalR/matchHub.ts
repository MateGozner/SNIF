// lib/signalR/matchHub.ts
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from "@microsoft/signalr";
import { useState, useCallback, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function useSignalRConnection() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);
  const attemptingReconnect = useRef(false);

  const startConnection = useCallback(async (userId: string) => {
    // If we already have an active connection, don't create a new one
    if (connectionRef.current?.state === HubConnectionState.Connected) {
      console.log("Connection already exists and is connected");
      return connectionRef.current;
    }

    // If we're already attempting to reconnect, don't start a new connection
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
      console.log("Starting new SignalR connection");

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}matchHub`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount < 3) return 2000;
            return null; // Stop reconnecting after 3 attempts
          },
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Set up connection event handlers
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

        try {
          // Rejoin the user group after reconnection
          await newConnection.invoke("JoinUserGroup", userId);
          console.log("Successfully rejoined group after reconnection");
        } catch (error) {
          console.error("Error rejoining group after reconnection:", error);
        }
      });

      await newConnection.start();
      await newConnection.invoke("JoinUserGroup", userId);
      console.log("SignalR Connected and joined group");

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

  return { connection, startConnection, stop };
}
