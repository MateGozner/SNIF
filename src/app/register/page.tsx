"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/types/auth";
import { useRegister } from "@/hooks/auth/useRegister";
import { useGeolocation } from "@/hooks/location/useGeoLocation";
import { ArrowRight, Loader2 } from "lucide-react";

type RegisterForm = z.infer<typeof registerSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

function AnimatedInput({
  register,
  name,
  label,
  error,
  type,
  placeholder,
  disabled,
  className,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  return (
    <motion.div variants={fadeInUp} className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-white/80 pl-1">
        {label}
      </Label>
      <div className="relative">
        <Input
          {...register(name)}
          id={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={`h-12 px-4 bg-white/10 backdrop-blur-xl text-white border-white/20 
            focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl 
            transition-all duration-200 placeholder:text-white/40 ${className}`}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute -bottom-6 left-1 text-red-400 text-sm"
            >
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader2 className="h-5 w-5" />
      </motion.div>
      <span>Creating Account...</span>
    </motion.div>
  );
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const register = useRegister();
  const { getLocation } = useGeolocation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("");
      setIsLoading(true);
      const location = await getLocation();
      await register.mutateAsync({
        ...data,
        location,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <CardHeader className="relative">
            <motion.div variants={fadeInUp}>
              <CardTitle className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Create Account
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="relative">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 backdrop-blur-sm text-red-300 p-4 rounded-xl mb-8"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatedInput
                register={registerField}
                name="name"
                label="Name"
                type="text"
                placeholder="Enter your name"
                error={errors.name}
                disabled={isLoading}
              />

              <AnimatedInput
                register={registerField}
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email}
                disabled={isLoading}
              />

              <AnimatedInput
                register={registerField}
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                error={errors.password}
                disabled={isLoading}
              />

              <AnimatedInput
                register={registerField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                disabled={isLoading}
              />

              <motion.div variants={fadeInUp}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                      hover:from-blue-600 hover:to-blue-700 text-white border-0 
                      h-12 rounded-xl flex items-center justify-center gap-2"
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <LoadingSpinner key="loading" />
                      ) : (
                        <motion.div
                          key="button-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p
              variants={fadeInUp}
              className="text-center mt-6 text-white/60"
            >
              Already have an account?{" "}
              <motion.button
                onClick={() => router.push("/login")}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.button>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
