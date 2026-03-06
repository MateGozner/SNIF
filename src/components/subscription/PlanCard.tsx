"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PlanDefinition, SubscriptionPlan } from "@/lib/types/subscription";
import { useCreateCheckoutSession } from "@/hooks/subscription/useSubscription";

interface PlanCardProps {
  plan: PlanDefinition;
  isYearly: boolean;
  currentPlan?: SubscriptionPlan;
  index: number;
}

export function PlanCard({
  plan,
  isYearly,
  currentPlan,
  index,
}: PlanCardProps) {
  const createCheckout = useCreateCheckoutSession();
  const isCurrentPlan = currentPlan === plan.id;
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const isFree = plan.monthlyPrice === 0 && !plan.isCredits;

  const handleSubscribe = () => {
    if (isCurrentPlan || isFree) return;

    createCheckout.mutate({
      plan: plan.id,
      billingInterval: isYearly ? 'Yearly' : 'Monthly',
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "relative flex flex-col rounded-3xl border p-6 backdrop-blur-2xl transition-all duration-300",
        plan.popular
          ? "border-[#2997FF]/40 bg-[#2997FF]/[0.06] shadow-[0_0_40px_rgba(41,151,255,0.1)]"
          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
      )}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2997FF] text-white border-0 px-3 py-1 text-xs">
          Most Popular
        </Badge>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
        <p className="mt-1 text-sm text-white/50">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        {plan.isCredits ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">Pay-as-you-go</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">
              €{price.toFixed(2)}
            </span>
            {!isFree && (
              <span className="text-sm text-white/40">
                /{isYearly ? "year" : "month"}
              </span>
            )}
          </div>
        )}
        {isYearly && !isFree && !plan.isCredits && (
          <p className="mt-1 text-xs text-emerald-400">
            Save €{((plan.monthlyPrice * 12 - plan.yearlyPrice)).toFixed(2)}/year
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2997FF]" />
            <span className="text-sm text-white/70">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={isCurrentPlan || createCheckout.isPending}
        className={cn(
          "w-full rounded-xl py-5 text-sm font-medium transition-all",
          plan.popular
            ? "bg-[#2997FF] text-white hover:bg-[#2997FF]/90"
            : "bg-white/[0.08] text-white hover:bg-white/[0.12]",
          isCurrentPlan && "opacity-60 cursor-default"
        )}
      >
        {isCurrentPlan
          ? "Current Plan"
          : isFree
            ? "Get Started"
            : createCheckout.isPending
              ? "Redirecting…"
              : plan.isCredits
                ? "Buy Credits"
                : "Subscribe"}
      </Button>
    </motion.div>
  );
}
