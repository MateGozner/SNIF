"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

function ConfirmEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "no-params"
  >(token && email ? "loading" : "no-params");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const confirmEmail = useCallback(async () => {
    if (!token || !email) return;

    try {
      const response = await fetch(`${BASE_URL}api/users/confirm-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm email");
      }

      setStatus("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to confirm email";
      setError(message);
      setStatus("error");
    }
  }, [token, email]);

  useEffect(() => {
    if (token && email) {
      confirmEmail();
    }
  }, [token, email, confirmEmail]);

  const handleResend = async () => {
    if (!email) return;

    try {
      setResendLoading(true);
      const response = await fetch(
        `${BASE_URL}api/users/resend-confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend confirmation");
      }

      setResendSent(true);
    } catch {
      setError("Failed to resend confirmation email");
    } finally {
      setResendLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto" />
        <p className="text-white/80">Confirming your email...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
        <p className="text-white/80">
          Your email has been confirmed successfully!
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Go to Login
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  if (status === "no-params") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <Mail className="w-12 h-12 text-blue-400 mx-auto" />
        <p className="text-white/80">
          Check your email to confirm your account. Click the confirmation link
          we sent you.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Go to Login
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-4"
    >
      <XCircle className="w-12 h-12 text-red-400 mx-auto" />
      <p className="text-white/80">{error}</p>

      {email && !resendSent && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleResend}
            disabled={resendLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 rounded-xl"
          >
            {resendLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Resend Confirmation Email"
            )}
          </Button>
        </motion.div>
      )}

      {resendSent && (
        <p className="text-green-400">
          A new confirmation email has been sent.
        </p>
      )}

      <Link
        href="/login"
        className="block text-blue-400 hover:text-blue-300 transition-colors"
      >
        Back to Login
      </Link>
    </motion.div>
  );
}

export default function ConfirmEmailContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black/[0.96]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-md p-4 relative"
      >
        <Card className="w-full border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="relative">
            <motion.div variants={fadeInUp}>
              <CardTitle className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Email Confirmation
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="relative">
            <Suspense
              fallback={
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
                </div>
              }
            >
              <ConfirmEmailForm />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
