// src/lib/constants/plans.ts

import { PlanDefinition, SubscriptionPlan } from "@/lib/types/subscription";

export const PLANS: PlanDefinition[] = [
  {
    id: SubscriptionPlan.Free,
    name: "Free",
    tagline: "Get started with the basics",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 pet profile",
      "5 daily likes",
      "5 km search radius",
      "Basic matching",
      "Ad-supported",
    ],
    limits: {
      maxPets: 1,
      dailyLikes: 5,
      dailySuperSniffs: 1,
      searchRadiusKm: 5,
      videoCallEnabled: false,
      hasAds: true,
      unlimitedLikes: false,
    },
  },
  {
    id: SubscriptionPlan.GoodBoy,
    name: "GoodBoy",
    tagline: "For the social pup",
    monthlyPrice: 4.99,
    yearlyPrice: 49.99,
    popular: true,
    features: [
      "2 pet profiles",
      "25 daily likes",
      "50 km search radius",
      "Priority matching",
      "No ads",
    ],
    limits: {
      maxPets: 2,
      dailyLikes: 25,
      dailySuperSniffs: 5,
      searchRadiusKm: 50,
      videoCallEnabled: false,
      hasAds: false,
      unlimitedLikes: false,
    },
  },
  {
    id: SubscriptionPlan.AlphaPack,
    name: "AlphaPack",
    tagline: "The ultimate pack leader",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      "5 pet profiles",
      "Unlimited daily likes",
      "500 km search radius",
      "Video calls",
      "No ads",
      "Priority support",
    ],
    limits: {
      maxPets: 5,
      dailyLikes: Number.MAX_SAFE_INTEGER,
      dailySuperSniffs: Number.MAX_SAFE_INTEGER,
      searchRadiusKm: 500,
      videoCallEnabled: true,
      hasAds: false,
      unlimitedLikes: true,
    },
  },
  {
    id: SubscriptionPlan.TreatBag,
    name: "TreatBag",
    tagline: "Pay as you go credits",
    monthlyPrice: 0,
    yearlyPrice: 0,
    isCredits: true,
    features: [
      "1 pet profile",
      "10 daily likes",
      "25 km search radius",
      "Buy credits on demand",
      "Ad-supported",
    ],
    limits: {
      maxPets: 1,
      dailyLikes: 10,
      dailySuperSniffs: 10,
      searchRadiusKm: 25,
      videoCallEnabled: false,
      hasAds: true,
      unlimitedLikes: false,
    },
  },
];

export function getPlanById(id: SubscriptionPlan): PlanDefinition {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
