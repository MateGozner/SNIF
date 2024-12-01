"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleProfile = () => {
    if (!user) return;
    router.push(`/profile/${user.id}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#fbfbfd]">
      <Card className="w-[380px] shadow-lg border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-[#1d1d1f] w-full text-center">
              Welcome to SNIF
              <Badge
                variant="secondary"
                className="ml-2 bg-[#2997FF] text-white"
              >
                Beta
              </Badge>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              width={72}
              height={16}
              className="dark:invert"
            />
          </div>

          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg bg-[#2997FF] text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-[#1d1d1f]">
                    {user.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white rounded-full h-11"
                  onClick={handleProfile}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 rounded-full h-11"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white rounded-full h-11"
                onClick={handleRegister}
              >
                Register Now
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#2997FF] text-[#2997FF] hover:bg-[#2997FF]/10 rounded-full h-11"
                onClick={handleLogin}
              >
                Log In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
