'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUsage, useCreditBalance } from '@/hooks/subscription/useSubscription';
import { Heart, Coins, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function LikeCounter() {
  const { data: usage } = useUsage();
  const { data: credits } = useCreditBalance();

  const dailyUsed = usage?.usageCounts?.Like ?? 0;
  const dailyLimit = usage?.currentLimits?.dailyLikes ?? 5;
  const dailyRemaining = Math.max(0, dailyLimit - dailyUsed);
  const bonusCredits = credits?.credits ?? 0;
  const totalRemaining = dailyRemaining + bonusCredits;
  const isLow = totalRemaining <= 3;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
        <Heart className="h-4 w-4 text-pink-400" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={totalRemaining}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm font-medium text-white tabular-nums"
          >
            {dailyRemaining}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-white/40">daily</span>
      </div>

      {bonusCredits > 0 && (
        <div className="flex items-center gap-1.5 bg-[#f59e0b]/10 rounded-full px-3 py-1.5 border border-[#f59e0b]/20">
          <Coins className="h-4 w-4 text-[#f59e0b]" />
          <span className="text-sm font-medium text-[#f59e0b] tabular-nums">
            +{bonusCredits}
          </span>
        </div>
      )}

      {isLow && (
        <Link
          href="/pricing"
          className="flex items-center gap-1 text-xs text-[#f59e0b] hover:text-[#d97706] transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Buy More
        </Link>
      )}
    </div>
  );
}
