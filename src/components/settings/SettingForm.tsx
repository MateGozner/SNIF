// components/settings/SettingsForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PreferencesForm, preferencesSchema } from "@/lib/validation/settings";
import { UserDto } from "@/lib/types/user";
import { NotificationSettingsFields } from "./NotificationSettingsFields";
import { OnlineStatusField } from "./OnlineStatusField";
import { SearchRadiusField } from "./SearchRadiusField";

interface SettingsFormProps {
  profile: UserDto;
  onSubmit: (data: PreferencesForm) => Promise<void>;
  isSubmitting: boolean;
}

export function SettingsForm({
  profile,
  onSubmit,
  isSubmitting,
}: SettingsFormProps) {
  const form = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      searchRadius: profile?.preferences?.searchRadius ?? 50,
      showOnlineStatus: profile?.preferences?.showOnlineStatus ?? true,
      notificationSettings: {
        emailNotifications:
          profile?.preferences?.notificationSettings?.emailNotifications ??
          true,
        pushNotifications:
          profile?.preferences?.notificationSettings?.pushNotifications ?? true,
        newMatchNotifications:
          profile?.preferences?.notificationSettings?.newMatchNotifications ??
          true,
        messageNotifications:
          profile?.preferences?.notificationSettings?.messageNotifications ??
          true,
        breedingRequestNotifications:
          profile?.preferences?.notificationSettings
            ?.breedingRequestNotifications ?? true,
        playdateRequestNotifications:
          profile?.preferences?.notificationSettings
            ?.playdateRequestNotifications ?? true,
        notificationStartTime:
          profile?.preferences?.notificationSettings?.notificationStartTime,
        notificationEndTime:
          profile?.preferences?.notificationSettings?.notificationEndTime,
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <SearchRadiusField control={form.control} />
        <OnlineStatusField control={form.control} />
        <NotificationSettingsFields control={form.control} />

        <Button
          type="submit"
          className="w-full bg-[#2997FF] hover:bg-[#147CE5]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
