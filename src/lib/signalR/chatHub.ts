//lib/signalR/chatHub.ts
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function useChatHub() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const token = useAuthStore((state) => state.token);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");

  useEffect(() => {
    let mounted = true;

    const setupConnection = async () => {
      if (!token) {
        console.log("No token, disconnecting chat connection");
        setConnectionState("disconnected");
        return;
      }

      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_URL}chatHub`, {
            accessTokenFactory: () => token,
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              // Custom retry logic
              return Math.min(
                1000 * Math.pow(2, retryContext.previousRetryCount),
                30000
              );
            },
          })
          .build();

        newConnection.onclose(() => {
          if (mounted) {
            console.log("Chat connection closed");
            setConnectionState("disconnected");
          }
        });

        newConnection.onreconnecting(() => {
          if (mounted) {
            console.log("Chat connection lost, reconnecting...");
            setConnectionState("connecting");
          }
        });

        newConnection.onreconnected(() => {
          if (mounted) {
            console.log("Chat connection reconnected");
            setConnectionState("connected");
          }
        });

        newConnection
          .start()
          .then(() => {
            setConnection(newConnection);
            setConnectionState("connected");
          })
          .catch(() => setConnectionState("disconnected"));
        if (mounted) {
          console.log("Chat connection established");
          setConnection(newConnection);
          setConnectionState("connected");
        }
        if (mounted) setConnection(newConnection);
      } catch (err) {
        console.error("Chat connection failed:", err);
        setConnectionState("disconnected");
      }
    };

    setupConnection();
    return () => {
      mounted = false;
      connection?.stop();
    };
  }, [token]);

  const sendMessage = async (
    matchId: string,
    receiverId: string,
    content: string
  ) => {
    if (!connection) throw new Error("No connection");
    await connection.invoke("SendMessage", matchId, receiverId, content);
  };

  const joinChat = async (matchId: string) => {
    if (!connection) throw new Error("No connection");
    await connection.invoke("JoinChat", matchId);
  };

  const leaveChat = async (matchId: string) => {
    if (!connection) throw new Error("No connection");
    await connection.invoke("LeaveChat", matchId);
  };

  const markMessageAsRead = async (messageId: string) => {
    if (!connection) throw new Error("No connection");
    await connection.invoke("MarkMessageAsRead", messageId);
  };

  return {
    connection,
    sendMessage,
    joinChat,
    leaveChat,
    markMessageAsRead,
    connectionState,
  };
}
