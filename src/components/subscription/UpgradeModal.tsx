"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

export function UpgradeModal({
  open,
  onOpenChange,
  featureName = "this feature",
}: UpgradeModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-white/[0.08] backdrop-blur-2xl rounded-2xl max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2997FF]/10">
            <Zap className="h-7 w-7 text-[#2997FF]" />
          </div>
          <DialogTitle className="text-xl text-white">
            Upgrade Your Plan
          </DialogTitle>
          <DialogDescription className="text-white/50">
            You&apos;ve reached the limit for {featureName} on your current
            plan. Upgrade to unlock more.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push("/pricing");
            }}
            className="w-full rounded-xl bg-[#2997FF] text-white hover:bg-[#2997FF]/90 py-5"
          >
            View Plans
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] py-5"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
