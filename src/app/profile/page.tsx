"use client";

import { ErrorState, LoadingState } from "@/components/profile/LoadingState";
import { ProfileBadges } from "@/components/profile/ProfileBadge";
import { ProfileLocation } from "@/components/profile/ProfileLocation";
import { ProfileNameEdit } from "@/components/profile/ProfileNameEdit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile, useProfilePicture } from "@/hooks/profile/useProfile";
import {
  useUpdateProfile,
  useUpdateProfilePicture,
} from "@/hooks/profile/useUpdateProfile";
import { useState } from "react";
import { motion } from "framer-motion";
import { ProfileAvatarWithStatus } from "@/components/profile/ProfileAvatarWithStatus";
import { useAuth } from "@/contexts/auth/AuthContext";
import { redirect } from "next/navigation";
import { ProfilePictureDto } from "@/lib/types/user";

export default function MyProfile() {
  const { user, isLoading: isUserLoading, isAuthenticated } = useAuth();

  if (isUserLoading) {
    return <LoadingState />;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <AuthenticatedProfile userId={user!.id} />;
}

function AuthenticatedProfile({ userId }: { userId: string }) {
  const { data: profile, isLoading, error } = useProfile(userId);
  const { data: profilePicture } = useProfilePicture(userId) as {
    data: ProfilePictureDto | undefined;
  };
  const updateProfile = useUpdateProfile(userId);
  const updateProfilePicture = useUpdateProfilePicture(userId);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileSelect = async (file: File) => {
    await updateProfilePicture.mutateAsync(file);
  };

  const handleSave = async (newName: string) => {
    await updateProfile.mutateAsync({ name: newName });
    setIsEditing(false);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!profile) return null;

  const isPending = updateProfile.isPending || updateProfilePicture.isPending;

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
                  onFileSelect={handleFileSelect}
                  isOnFileSelect={true}
                  showStatus={false}
                  size="lg"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <ProfileNameEdit
                    name={profile.name}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                    isPending={isPending}
                  />
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
