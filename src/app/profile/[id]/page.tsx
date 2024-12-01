"use client";

import { ErrorState, LoadingState } from "@/components/profile/LoadingState";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileBadges } from "@/components/profile/ProfileBadge";
import { ProfileLocation } from "@/components/profile/ProfileLocation";
import { ProfileNameEdit } from "@/components/profile/ProfileNameEdit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { use, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: profile, isLoading, error } = useProfile(id);
  const updateProfile = useUpdateProfile(id);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileSelect = async (file: File) => {
    await updateProfile.mutateAsync({
      name: profile?.name || "",
      profilePicture: file,
    });
  };

  const handleSave = async (newName: string) => {
    await updateProfile.mutateAsync({ name: newName });
    setIsEditing(false);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} />;
  if (!profile) return null;

  return (
    <div className="container mx-auto p-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-4">
            <ProfileAvatar
              profilePicture={profile.profilePicturePath}
              name={profile.name}
              onFileSelect={handleFileSelect}
            />
            <div className="flex-1">
              <div className="mb-2">
                <ProfileNameEdit
                  name={profile.name}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                  isPending={updateProfile.isPending}
                />
              </div>
              <ProfileBadges
                isVerifiedBreeder={!!profile.breederVerification?.isVerified}
                createdAt={profile.createdAt}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {profile.location && (
              <ProfileLocation location={profile.location} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
