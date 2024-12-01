// src/app/login/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth/AuthContext";
import { loginSchema } from "@/lib/types/auth";
import { useGeolocation } from "@/hooks/location/useGeoLocation";

type LoginForm = z.infer<typeof loginSchema>;

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FBFBFD] to-[#F5F5F7]">
        <div className="w-full max-w-md p-4">
          <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Location Permission Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground">
                You need to provide location permission to use this app.
              </p>
              <div className="flex gap-4 mt-4">
                <Button onClick={resetPermissionState}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const location = await getLocation();
      console.log(location);
      await login(data.email, data.password, location);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FBFBFD] to-[#F5F5F7]">
      <div className="w-full max-w-md p-4">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
