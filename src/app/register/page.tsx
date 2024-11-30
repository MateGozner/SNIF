"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerSchema } from "@/lib/types/auth";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRegister } from "@/hooks/auth/useRegister";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await register.mutateAsync(data);
      if (response.token) {
        login(response.token);
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FBFBFD] to-[#F5F5F7]">
      <div className="w-full max-w-md p-4">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-semibold text-[#1d1d1f] text-center tracking-tight">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-50 border border-red-100"
              >
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-[#1d1d1f]"
                >
                  Name
                </Label>
                <Input
                  {...registerField("name")}
                  id="name"
                  type="text"
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0066CC] transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1d1d1f]"
                >
                  Email
                </Label>
                <Input
                  {...registerField("email")}
                  id="email"
                  type="email"
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0066CC] transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[#1d1d1f]"
                >
                  Password
                </Label>
                <Input
                  {...registerField("password")}
                  id="password"
                  type="password"
                  disabled={isLoading}
                  className="h-12 rounded-xl bg-[#F5F5F7] border-0 focus:ring-2 focus:ring-[#0066CC] transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#0066CC] hover:bg-[#0055AC] text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[0.98] active:scale-[0.97] mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-[#0066CC] hover:underline font-medium transition-colors"
              >
                Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
