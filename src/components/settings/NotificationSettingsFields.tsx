import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TimePickerInput } from "@/components/ui/time-picker";
import { PreferencesForm, NotificationKey } from "@/lib/validation/settings";

interface NotificationSettingsFieldsProps {
  control: Control<PreferencesForm>;
}

export function NotificationSettingsFields({
  control,
}: NotificationSettingsFieldsProps) {
  const notificationSettings: Record<NotificationKey, string> = {
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    newMatchNotifications: "New Match Notifications",
    messageNotifications: "Message Notifications",
    breedingRequestNotifications: "Breeding Request Notifications",
    playdateRequestNotifications: "Playdate Request Notifications",
    notificationStartTime: "Notification Start Time",
    notificationEndTime: "Notification End Time",
  } as const;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Settings</h3>
      {(Object.entries(notificationSettings) as [NotificationKey, string][])
        .filter(([key]) => !key.includes("Time"))
        .map(([key, label]) => (
          <FormField
            key={key}
            control={control}
            name={`notificationSettings.${key}` as const}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="notificationSettings.notificationStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiet Hours Start</FormLabel>
              <FormControl>
                <TimePickerInput {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="notificationSettings.notificationEndTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiet Hours End</FormLabel>
              <FormControl>
                <TimePickerInput {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
