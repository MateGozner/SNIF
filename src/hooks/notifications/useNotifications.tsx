// src/hooks/useNotifications.tsx
import { useState, useEffect } from "react";
import { PetMatchNotification } from "@/lib/types/notification";
import { useAuthStore } from "@/lib/store/authStore";
import { usePetMatching } from "./usePetMatching";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<PetMatchNotification[]>(
    []
  );
  const { user } = useAuthStore();
  const matchingService = usePetMatching();

  useEffect(() => {
    if (!matchingService || !user?.id) return;

    console.log("🔄 Setting up notification subscriptions");

    const unsubscribeMatches = matchingService.subscribeToPetMatches(
      (notification) => {
        console.log("📝 Received match notification:", notification);
        if (notification.OwnerId === user.id) {
          console.log("🚫 Ignoring self-notification");
          return;
        }
        setNotifications((prev) => [...prev, notification]);
      }
    );

    const unsubscribeWatchlist = matchingService.subscribeToWatchlist(
      (notification) => {
        console.log("📝 Received watchlist notification:", notification);
        if (notification.OwnerId === user.id) {
          console.log("🚫 Ignoring self-notification");
          return;
        }
        setNotifications((prev) => [...prev, notification]);
      }
    );

    return () => {
      console.log("🧹 Cleaning up notification subscriptions");
      unsubscribeMatches();
      unsubscribeWatchlist();
    };
  }, [matchingService, user?.id]);

  const clearNotification = (matchedPetId: string) => {
    console.log("🗑️ Clearing notification:", matchedPetId);
    setNotifications((prev) =>
      prev.filter((n) => n.MatchedPetId !== matchedPetId)
    );
  };

  return { notifications, clearNotification };
};
