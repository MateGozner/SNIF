"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

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

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="text-white/80">
          Invalid reset link. Please request a new password reset.
        </p>
        <Link
          href="/forgot-password"
          className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Request New Reset
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
        <p className="text-white/80">
          Your password has been reset successfully. Redirecting to login...
        </p>
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 backdrop-blur-sm text-red-300 p-4 rounded-xl mb-6"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div variants={fadeInUp} className="space-y-2">
          <Input
            {...register("newPassword")}
            type="password"
            placeholder="New Password"
            className="h-12 px-4 bg-white/70 backdrop-blur-xl border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-200"
          />
          {errors.newPassword && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm pl-1"
            >
              {errors.newPassword.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-2">
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className="h-12 px-4 bg-white/70 backdrop-blur-xl border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-200"
          />
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm pl-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={fadeInUp}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </>
  );
}

export default function ResetPasswordContent() {
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
                Reset Password
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
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
