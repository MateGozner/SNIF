"use client";

import { cn } from "@/lib/utils";

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  className?: string;
}

export function UsageMeter({ label, used, limit, className }: UsageMeterProps) {
  const isUnlimited = limit >= Number.MAX_SAFE_INTEGER;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span
          className={cn(
            "font-medium",
            isAtLimit
              ? "text-red-400"
              : isNearLimit
                ? "text-amber-400"
                : "text-white/80"
          )}
        >
          {isUnlimited ? (
            "Unlimited"
          ) : (
            <>
              {used}/{limit}
            </>
          )}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isAtLimit
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-amber-500"
                  : "bg-[#2997FF]"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
