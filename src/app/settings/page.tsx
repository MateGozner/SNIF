"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdatePreferences } from "@/hooks/profile/useUpdatePreferences";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogOut } from "lucide-react";
import { SettingsForm } from "@/components/settings/SettingForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { data: profile, isLoading, error } = useProfile(user?.id ?? "");
  const updatePreferences = useUpdatePreferences(user?.id ?? "");

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-black/[0.98] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="relative min-h-screen bg-black/[0.98] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <Alert
          variant="destructive"
          className="bg-red-500/10 border-red-500/20"
        >
          <AlertDescription className="text-red-400">
            {error ? "Failed to load settings" : "Profile not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container relative mx-auto p-8 pt-16 max-w-2xl"
      >
        <Card className="overflow-hidden bg-white/[0.03] border-white/[0.08] backdrop-blur-2xl rounded-3xl shadow-2xl">
          <div className="p-8 border-b border-white/[0.08]">
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
          </div>
          <CardContent className="p-8">
            {updatePreferences.error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-500/10 border-red-500/20"
              >
                <AlertDescription className="text-red-400">
                  Failed to save settings. Please try again.
                </AlertDescription>
              </Alert>
            )}
            <SettingsForm
              profile={profile}
              onSubmit={async (data) => {
                await updatePreferences.mutateAsync(data);
              }}
              isSubmitting={updatePreferences.isPending}
            />
            <div className="mt-8 pt-8 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                className="w-full justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
