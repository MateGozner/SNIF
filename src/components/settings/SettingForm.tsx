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
import { motion } from "framer-motion";

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-[#38bdf8] font-medium text-sm tracking-wide">
              Location Settings
            </h3>
            <div className="bg-white/[0.06] p-6 rounded-2xl backdrop-blur-md border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08]">
              <SearchRadiusField control={form.control} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#38bdf8] font-medium text-sm tracking-wide">
              Privacy
            </h3>
            <div className="bg-white/[0.06] p-6 rounded-2xl backdrop-blur-md border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08]">
              <OnlineStatusField control={form.control} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#38bdf8] font-medium text-sm tracking-wide">
              Notifications
            </h3>
            <div className="bg-white/[0.06] p-6 rounded-2xl backdrop-blur-md border border-white/[0.08] transition-all duration-200 hover:bg-white/[0.08]">
              <NotificationSettingsFields control={form.control} />
            </div>
          </div>
        </motion.div>

        <div className="pt-6 space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
