// src/hooks/usePetMatching.tsx
import { useEffect, useRef } from "react";
import { PetMatchingService } from "@/services/stompService";
import { useAuthStore } from "@/lib/store/authStore";

export const usePetMatching = () => {
  const { user } = useAuthStore();
  const serviceRef = useRef<PetMatchingService | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    console.log("🔄 Initializing pet matching service");
    serviceRef.current = new PetMatchingService(user.id);
    serviceRef.current.connect();

    return () => {
      console.log("🧹 Cleaning up pet matching service");
      serviceRef.current?.disconnect();
      serviceRef.current = null;
    };
  }, [user?.id]);

  return serviceRef.current;
};
