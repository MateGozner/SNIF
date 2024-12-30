// contexts/SignalRContext.tsx
import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import { useSignalRConnection } from "@/lib/signalR/matchHub";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MatchDto, MatchStatus } from "@/lib/types/match";
import { NewMatchNotification } from "@/hooks/notifications/NewMatchNotification";
import { MatchUpdateNotification } from "@/hooks/notifications/MatchUpdateNotification";

interface SignalRContextType {
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType>({
  isConnected: false,
});

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const token = useAuthStore((state) => state.token);
  const { connection, startConnection, stop } = useSignalRConnection();
  const connectionAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const setupSignalRHandlers = (connection: signalR.HubConnection) => {
      // Handle new match notifications
      connection.on("ReceiveNewMatch", (match: MatchDto) => {
        console.log("New match received:", match);

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["matches"] });
        queryClient.invalidateQueries({
          queryKey: ["matches", match.initiatorPet.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["matches", match.targetPet.id],
        });

        // Show notification
        toast.custom(() => <NewMatchNotification match={match} />, {
          duration: 5000,
          position: "top-right",
        });
      });

      // Handle match update notifications
      connection.on("ReceiveMatchUpdate", (match: MatchDto) => {
        console.log("Match update received:", match);

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["matches"] });
        queryClient.invalidateQueries({
          queryKey: ["matches", match.initiatorPet.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["matches", match.targetPet.id],
        });

        // Show notification
        const statusMessages = {
          [MatchStatus.Accepted]: "accepted your match request!",
          [MatchStatus.Rejected]: "declined your match request",
          [MatchStatus.Expired]: "cancelled the match request",
          [MatchStatus.Pending]: "updated the match status",
        };

        toast.custom(
          () => (
            <MatchUpdateNotification
              match={match}
              message={
                statusMessages[match.status] ||
                `updated the match status to ${match.status}`
              }
            />
          ),
          {
            duration: 5000,
            position: "top-right",
          }
        );
      });
    };

    const initializeConnection = async () => {
      if (!token || !user?.id || !mounted) return;

      try {
        const conn = await startConnection(user.id);
        if (conn && mounted) {
          setupSignalRHandlers(conn);
        }
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
      if (connection) {
        connection.off("ReceiveNewMatch");
        connection.off("ReceiveMatchUpdate");
      }
      stop();
    };
  }, [user?.id, token, startConnection, stop, queryClient]);

  return (
    <SignalRContext.Provider value={{ isConnected: !!connection }}>
      {children}
    </SignalRContext.Provider>
  );
}

export const useSignalR = () => useContext(SignalRContext);
