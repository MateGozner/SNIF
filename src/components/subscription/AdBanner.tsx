'use client';

import Link from 'next/link';
import { useCurrentPlan } from '@/hooks/subscription/useSubscription';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function AdBanner() {
  const { currentPlan, isLoading } = useCurrentPlan();
  const [dismissed, setDismissed] = useState(false);

  // Only show for free-tier users
  if (isLoading || dismissed || currentPlan !== SubscriptionPlan.Free) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-[#2997FF]/10 to-[#8b5cf6]/10 border border-[#2997FF]/20 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Sparkles className="h-5 w-5 text-[#2997FF] shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">
            Upgrade to GoodBoy for unlimited fun!
          </p>
          <p className="text-xs text-white/50 truncate">
            More likes, bigger radius, no ads. Starting at $4.99/mo.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/pricing">
          <Button size="sm" className="bg-[#2997FF] hover:bg-[#2997FF]/80 text-white">
            Upgrade
          </Button>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/30 hover:text-white/60 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
