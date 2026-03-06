"use client";

import { ErrorState, LoadingState } from "@/components/profile/LoadingState";
import { ProfileBadges } from "@/components/profile/ProfileBadge";
import { ProfileLocation } from "@/components/profile/ProfileLocation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile, useProfilePicture } from "@/hooks/profile/useProfile";
import { use, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileAvatarWithStatus } from "@/components/profile/ProfileAvatarWithStatus";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { ProfilePictureDto } from "@/lib/types/user";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile(id);
  const { data: profilePicture } = useProfilePicture(id) as {
    data: ProfilePictureDto | undefined;
  };

  useEffect(() => {
    if (user?.id === id) {
      router.replace("/profile");
    }
  }, [user, id, router]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!profile) return null;

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container relative mx-auto p-8 pt-16 max-w-4xl"
      >
        <Card className="overflow-hidden bg-white/[0.03] border-white/[0.08] backdrop-blur-2xl rounded-3xl shadow-2xl">
          <CardHeader className="border-b border-white/[0.08] p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-8"
            >
              <div className="relative">
                <ProfileAvatarWithStatus
                  profilePicture={profilePicture?.url}
                  name={profile.name}
                  showStatus={false}
                  isOnFileSelect={false}
                  size="lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    {profile.name}
                  </h2>
                  <p className="text-white/60 text-sm">
                    @{profile.name.toLowerCase().replace(/\s+/g, "")}
                  </p>
                </div>
                <ProfileBadges
                  isVerifiedBreeder={!!profile.breederVerification?.isVerified}
                  createdAt={profile.createdAt}
                />
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-8"
            >
              {profile.location && (
                <div className="bg-white/[0.04] p-6 rounded-2xl backdrop-blur-md border border-white/[0.05] transition-all duration-200 hover:bg-white/[0.06]">
                  <h3 className="text-[#2997FF] font-medium mb-3 text-sm">
                    Location
                  </h3>
                  <ProfileLocation location={profile.location} />
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
