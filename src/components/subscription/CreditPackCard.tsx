'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePurchaseCredits } from '@/hooks/subscription/useSubscription';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditPack {
  amount: number;
  price: number;
  popular?: boolean;
  label: string;
}

const CREDIT_PACKS: CreditPack[] = [
  { amount: 10, price: 1.99, label: 'Starter' },
  { amount: 50, price: 7.99, popular: true, label: 'Best Value' },
  { amount: 100, price: 12.99, label: 'Mega Pack' },
];

interface CreditPackCardProps {
  pack: CreditPack;
  index: number;
}

export function CreditPackCard({ pack, index }: CreditPackCardProps) {
  const purchaseCredits = usePurchaseCredits();

  const handlePurchase = () => {
    purchaseCredits.mutate({
      amount: pack.amount,
      successUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={cn(
        'relative flex flex-col items-center rounded-2xl border p-6 backdrop-blur-2xl transition-all',
        pack.popular
          ? 'border-[#f59e0b]/40 bg-[#f59e0b]/[0.06] shadow-[0_0_30px_rgba(245,158,11,0.1)]'
          : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]'
      )}
    >
      {pack.popular && (
        <Badge className="absolute -top-3 bg-[#f59e0b] text-white border-0 px-3 py-1 text-xs">
          {pack.label}
        </Badge>
      )}

      <Coins className="h-10 w-10 text-[#f59e0b] mb-3" />
      <p className="text-3xl font-bold text-white">{pack.amount}</p>
      <p className="text-sm text-white/50 mb-1">credits</p>
      <p className="text-xl font-semibold text-white mb-4">${pack.price}</p>
      <p className="text-xs text-white/40 mb-4">
        ${(pack.price / pack.amount).toFixed(2)} per credit
      </p>

      <Button
        onClick={handlePurchase}
        disabled={purchaseCredits.isPending}
        className={cn(
          'w-full',
          pack.popular
            ? 'bg-[#f59e0b] hover:bg-[#d97706] text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        )}
      >
        Buy Now
      </Button>
    </motion.div>
  );
}

export function CreditPackSection() {
  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          Need extra likes? Grab a Treat Bag 🦴
        </h2>
        <p className="mt-2 text-white/50">
          Buy credit packs for bonus likes on top of your daily limit.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
        {CREDIT_PACKS.map((pack, i) => (
          <CreditPackCard key={pack.amount} pack={pack} index={i} />
        ))}
      </div>
    </div>
  );
}
