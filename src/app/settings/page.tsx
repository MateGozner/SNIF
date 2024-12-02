// app/settings/page.tsx
"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdatePreferences } from "@/hooks/profile/useUpdatePreferences";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreferencesForm } from "@/lib/validation/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { SettingsForm } from "@/components/settings/SettingForm";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile(user!.id);
  const updatePreferences = useUpdatePreferences(user!.id);

  const onSubmit = async (data: PreferencesForm) => {
    try {
      await updatePreferences.mutateAsync(data);
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load settings. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Profile not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {updatePreferences.error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to save settings. Please try again.
              </AlertDescription>
            </Alert>
          )}
          <SettingsForm
            profile={profile}
            onSubmit={onSubmit}
            isSubmitting={updatePreferences.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
