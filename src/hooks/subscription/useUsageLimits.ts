// src/hooks/subscription/useUsageLimits.ts

import { useState, useCallback } from "react";
import { useUsage, useCurrentPlan } from "./useSubscription";
import { UsageType, SubscriptionPlan } from "@/lib/types/subscription";
import { getPlanById } from "@/lib/constants/plans";

interface UsageLimitResult {
  /** Whether the user can perform the action */
  canPerform: boolean;
  /** Current count for this usage type today */
  currentUsage: number;
  /** Max allowed for this usage type */
  limit: number;
  /** Remaining before hitting the limit */
  remaining: number;
  /** Whether limit data is still loading */
  isLoading: boolean;
  /** Show the upgrade modal */
  showUpgradePrompt: () => void;
  /** Hide the upgrade modal */
  hideUpgradePrompt: () => void;
  /** Whether the upgrade prompt is visible */
  upgradePromptOpen: boolean;
  /** The feature name to display in the upgrade modal */
  featureName: string;
}

const USAGE_LIMIT_MAP: Record<UsageType, keyof ReturnType<typeof getPlanById>["limits"]> = {
  [UsageType.Like]: "dailyLikes",
  [UsageType.PetCreation]: "maxPets",
  [UsageType.SuperSniff]: "dailySuperSniffs",
  [UsageType.VideoCall]: "videoCallEnabled",
};

const USAGE_FEATURE_NAMES: Record<UsageType, string> = {
  [UsageType.Like]: "daily likes",
  [UsageType.PetCreation]: "pet profiles",
  [UsageType.SuperSniff]: "super sniffs",
  [UsageType.VideoCall]: "video calls",
};

export function useUsageLimits(usageType: UsageType): UsageLimitResult {
  const { data: usage, isLoading: usageLoading } = useUsage();
  const { currentPlan, isLoading: planLoading } = useCurrentPlan();
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);

  const planDef = getPlanById(currentPlan);
  const isLoading = usageLoading || planLoading;
  const featureName = USAGE_FEATURE_NAMES[usageType];

  const currentUsage = usage?.usageCounts?.[usageType] ?? 0;

  let limit: number;
  if (usageType === UsageType.VideoCall) {
    limit = planDef.limits.videoCallEnabled ? 1 : 0;
  } else if (usageType === UsageType.PetCreation) {
    limit = planDef.limits.maxPets;
  } else if (usageType === UsageType.SuperSniff) {
    limit = planDef.limits.dailySuperSniffs;
  } else {
    limit = planDef.limits.dailyLikes;
  }

  const remaining = Math.max(0, limit - currentUsage);
  const canPerform = remaining > 0;

  const showUpgradePrompt = useCallback(() => setUpgradePromptOpen(true), []);
  const hideUpgradePrompt = useCallback(() => setUpgradePromptOpen(false), []);

  return {
    canPerform,
    currentUsage,
    limit,
    remaining,
    isLoading,
    showUpgradePrompt,
    hideUpgradePrompt,
    upgradePromptOpen,
    featureName,
  };
}

/**
 * Guard wrapper — call `guard()` before performing an action.
 * Returns `true` if the user can proceed, `false` if the limit was hit
 * (and the upgrade modal will be shown automatically).
 */
export function useActionGuard(usageType: UsageType) {
  const limits = useUsageLimits(usageType);

  const guard = useCallback((): boolean => {
    if (limits.isLoading) return true; // allow while loading
    if (!limits.canPerform) {
      limits.showUpgradePrompt();
      return false;
    }
    return true;
  }, [limits]);

  return {
    ...limits,
    guard,
  };
}
