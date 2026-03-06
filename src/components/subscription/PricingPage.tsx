"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { PlanCard } from "./PlanCard";
import { CreditPackSection } from "./CreditPackCard";
import { PLANS } from "@/lib/constants/plans";
import { useCurrentPlan } from "@/hooks/subscription/useSubscription";

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { currentPlan, isLoading } = useCurrentPlan();

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      <div className="container relative mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Find the perfect plan
          </h1>
          <p className="mt-4 text-lg text-white/50 max-w-xl mx-auto">
            Whether your pup is just starting out or is the leader of the pack,
            we have a plan that fits.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-sm text-white/60">Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-[#2997FF]"
            />
            <span className="text-sm text-white/60">
              Yearly{" "}
              <span className="text-emerald-400 font-medium">Save 17%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              currentPlan={isLoading ? undefined : currentPlan}
              index={i}
            />
          ))}
        </div>

        <CreditPackSection />
      </div>
    </div>
  );
}
