// src/hooks/useNotifications.tsx
import { useState, useEffect } from "react";
import { connectToRabbitMQ, subscribeToMatches } from "@/services/stompService";
import { PetMatchNotification } from "@/lib/types/notification";
import { useAuthStore } from "@/lib/store/authStore";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<PetMatchNotification[]>(
    []
  );
  const { user } = useAuthStore();

  useEffect(() => {
    console.log("🔄 Initializing notifications hook");
    let disconnect: () => void;
    let unsubscribe: () => void;

    try {
      disconnect = connectToRabbitMQ();
      unsubscribe = subscribeToMatches((notification) => {
        console.log("📝 Received notification:", notification);
        if (notification.OwnerId === user?.id) {
          console.log("🚫 Ignoring self-notification");
          return;
        }
        setNotifications((prev) => [...prev, notification]);
      });
    } catch (error) {
      console.error("❌ Error in notifications setup:", error);
    }

    return () => {
      console.log("🧹 Cleaning up notifications hook");
      disconnect?.();
      unsubscribe?.();
    };
  }, [user]);

  const clearNotification = (matchedPetId: string) => {
    console.log("🗑️ Clearing notification:", matchedPetId);
    setNotifications((prev) =>
      prev.filter((n) => n.MatchedPetId !== matchedPetId)
    );
  };

  return { notifications, clearNotification };
};
