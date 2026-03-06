"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black/[0.98] flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md mx-auto px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10"
        >
          <XCircle className="h-10 w-10 text-orange-400" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Cancelled
        </h1>
        <p className="text-white/50 mb-8">
          No worries — your account hasn&apos;t been charged. You can always
          come back when you&apos;re ready.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push("/pricing")}
            className="rounded-xl bg-[#2997FF] text-white hover:bg-[#2997FF]/90 px-6 py-5"
          >
            View Plans
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="rounded-xl text-white/60 hover:text-white hover:bg-white/[0.06] px-6 py-5"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
