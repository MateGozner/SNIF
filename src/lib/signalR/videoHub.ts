// lib/signalR/videoHub.ts
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function useVideoHub() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    let mounted = true;

    const setupConnection = async () => {
      if (!token) {
        console.log("🔴 No token available, skipping connection");
        return;
      }

      try {
        console.log("🔄 Initializing SignalR connection...");
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_URL}videoHub`, {
            accessTokenFactory: () => token,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .configureLogging(LogLevel.Debug)
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              console.log("🔄 Retry attempt:", retryContext.previousRetryCount);
              return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
            },
          })
          .build();

        // Set up connection event handlers
        newConnection.onclose((error) => {
          console.log("🔴 Connection closed", error);
        });

        newConnection.onreconnecting((error) => {
          console.log("🟡 Reconnecting...", error);
        });

        newConnection.onreconnected((connectionId) => {
          console.log("🟢 Reconnected! ID:", connectionId);
        });

        await newConnection.start();
        console.log("🟢 Connection started successfully!");

        if (mounted) {
          setConnection(newConnection);
        }
      } catch (err) {
        console.error("❌ Connection failed:", err);
      }
    };

    setupConnection();

    return () => {
      mounted = false;
      if (connection) {
        console.log("🧹 Cleaning up connection...");
        connection.stop().catch((err) => {
          console.error("❌ Error stopping connection:", err);
        });
      }
    };
  }, [token]);

  const joinCall = async (matchId: string) => {
    if (!connection) throw new Error("No connection");
    console.log("🔄 Joining call room:", matchId);
    await connection.invoke("JoinCall", matchId);
  };

  const sendSignal = async (matchId: string, signal: unknown, type: string) => {
    if (!connection) throw new Error("No connection");
    try {
      console.log("📡 Sending signal:", type);
      await connection.invoke("SendSignal", matchId, JSON.stringify(signal), type);
    } catch (err) {
      console.error("❌ Error sending signal:", err);
      throw err;
    }
  };

  const initiateCall = async (matchId: string, receiverId: string) => {
    if (!connection) throw new Error("No connection");
    try {
      console.log("📞 Initiating call to:", receiverId);
      await connection.invoke("InitiateCall", matchId, receiverId);
    } catch (err) {
      console.error("❌ Error initiating call:", err);
      throw err;
    }
  };

  const acceptCall = async (matchId: string, callerId: string) => {
    if (!connection) throw new Error("No connection");
    try {
      console.log("📞 Accepting call from:", callerId);
      await connection.invoke("AcceptCall", matchId, callerId);
    } catch (err) {
      console.error("❌ Error accepting call:", err);
      throw err;
    }
  };

  const endCall = async (matchId: string) => {
    if (!connection) throw new Error("No connection");
    try {
      console.log("📞 Ending call:", matchId);
      await connection.invoke("EndCall", matchId);
    } catch (err) {
      console.error("❌ Error ending call:", err);
      throw err;
    }
  };

  return {
    connection,
    joinCall,
    sendSignal,
    initiateCall,
    acceptCall,
    endCall,
  };
}