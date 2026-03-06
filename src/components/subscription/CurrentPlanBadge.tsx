"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SubscriptionPlan, SubscriptionStatus } from "@/lib/types/subscription";
import { getPlanById } from "@/lib/constants/plans";

interface CurrentPlanBadgeProps {
  plan: SubscriptionPlan;
  status?: SubscriptionStatus;
  className?: string;
}

const planColors: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.Free]: "bg-white/10 text-white/70 border-white/10",
  [SubscriptionPlan.GoodBoy]: "bg-[#2997FF]/10 text-[#2997FF] border-[#2997FF]/20",
  [SubscriptionPlan.AlphaPack]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  [SubscriptionPlan.TreatBag]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function CurrentPlanBadge({ plan, status, className }: CurrentPlanBadgeProps) {
  const planDef = getPlanById(plan);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        className={cn(
          "rounded-full px-3 py-1 text-xs font-medium border",
          planColors[plan]
        )}
      >
        {planDef.name}
      </Badge>
      {status === SubscriptionStatus.PastDue && (
        <Badge className="rounded-full px-2 py-0.5 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
          Past Due
        </Badge>
      )}
      {status === SubscriptionStatus.Trialing && (
        <Badge className="rounded-full px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Trial
        </Badge>
      )}
    </div>
  );
}
