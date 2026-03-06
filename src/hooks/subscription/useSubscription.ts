// src/hooks/subscription/useSubscription.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import {
  SubscriptionDto,
  UsageResponseDto,
  CreditBalanceDto,
  CreateCheckoutSessionDto,
  SubscriptionPlan,
} from "@/lib/types/subscription";
import { toast } from "sonner";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => api.get<SubscriptionDto>("api/payments/subscription"),
  });
}

export function useUsage(date?: Date) {
  return useQuery({
    queryKey: ["usage", date?.toISOString()],
    queryFn: () =>
      api.get<UsageResponseDto>("api/payments/usage", {
        params: date ? { date: date.toISOString() } : undefined,
      }),
  });
}

export function useCreditBalance() {
  return useQuery({
    queryKey: ["credits"],
    queryFn: () => api.get<CreditBalanceDto>("api/payments/credits/balance"),
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (dto: CreateCheckoutSessionDto) => {
      const result = await api.post<{ url: string }>(
        "api/payments/create-checkout-session",
        dto
      );
      return result;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Failed to create checkout session. Please try again.");
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<{ message: string }>("api/payments/cancel", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      toast.success(
        "Subscription will be canceled at the end of the billing period."
      );
    },
    onError: () => {
      toast.error("Failed to cancel subscription.");
    },
  });
}

export function usePurchaseCredits() {
  return useMutation({
    mutationFn: async (dto: { amount: number; successUrl: string; cancelUrl: string }) => {
      const result = await api.post<{ url: string }>(
        "api/payments/credits/purchase",
        dto
      );
      return result;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast.error("Failed to purchase credits.");
    },
  });
}

/** Quick helper to check if the user is on a given plan or higher */
export function useCurrentPlan() {
  const { data: subscription, isLoading } = useSubscription();

  const currentPlan: SubscriptionPlan =
    (subscription as SubscriptionDto)?.planId ?? SubscriptionPlan.Free;

  return { currentPlan, isLoading, subscription };
}
