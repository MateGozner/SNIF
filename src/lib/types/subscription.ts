// src/lib/types/subscription.ts

export enum SubscriptionPlan {
  Free = "Free",
  GoodBoy = "GoodBoy",
  AlphaPack = "AlphaPack",
  TreatBag = "TreatBag",
}

export enum SubscriptionStatus {
  Active = "Active",
  PastDue = "PastDue",
  Canceled = "Canceled",
  Trialing = "Trialing",
}

export enum UsageType {
  Like = "Like",
  SuperSniff = "SuperSniff",
  PetCreation = "PetCreation",
  VideoCall = "VideoCall",
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  planId: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
}

export interface PlanLimits {
  maxPets: number;
  dailyLikes: number;
  dailySuperSniffs: number;
  searchRadiusKm: number;
  videoCallEnabled: boolean;
  hasAds: boolean;
  unlimitedLikes: boolean;
}

export interface UsageResponseDto {
  userId: string;
  date: string;
  usageCounts: Record<string, number>;
  currentLimits: PlanLimits;
  currentPlan: SubscriptionPlan;
}

export interface CreditBalanceDto {
  credits: number;
  lastPurchasedAt?: string;
}

export interface CreateCheckoutSessionDto {
  plan: SubscriptionPlan;
  billingInterval: 'Monthly' | 'Yearly';
  successUrl: string;
  cancelUrl: string;
}

export interface PurchaseCreditsDto {
  amount: number;
  successUrl: string;
  cancelUrl: string;
}

export interface PlanDefinition {
  id: SubscriptionPlan;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: PlanLimits;
  popular?: boolean;
  isCredits?: boolean;
}
