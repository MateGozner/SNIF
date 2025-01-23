"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth/AuthContext";
import { loginSchema } from "@/lib/types/auth";
import { useGeolocation } from "@/hooks/location/useGeoLocation";
import { ArrowRight } from "lucide-react";

type LoginForm = z.infer<typeof loginSchema>;

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
  error,
  type,
  placeholder,
  className,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  return (
    <motion.div variants={fadeInUp} className="space-y-2">
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`h-12 px-4 bg-white/70 backdrop-blur-xl border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl transition-all duration-200 ${className}`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-400 text-sm pl-1"
        >
          {error.message}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const { getLocation, permissionDenied, resetPermissionState } =
    useGeolocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (permissionDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/[0.96]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md p-4 relative"
        >
          <Card className="w-full border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                Location Permission Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-white/60 mb-6">
                You need to provide location permission to use this app.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={resetPermissionState}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 h-12 rounded-xl"
                >
                  Try Again
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const location = await getLocation();
      await login(data.email, data.password, location);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
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
                Welcome Back
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="relative">
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
              <AnimatedInput
                register={register}
                name="email"
                type="email"
                placeholder="Email"
                error={errors.email}
              />

              <AnimatedInput
                register={register}
                name="password"
                type="password"
                placeholder="Password"
                error={errors.password}
              />

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
                    {isLoading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p
              variants={fadeInUp}
              className="text-center mt-6 text-white/60"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Register
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
