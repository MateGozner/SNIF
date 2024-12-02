import { z } from "zod";

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  newMatchNotifications: z.boolean(),
  messageNotifications: z.boolean(),
  breedingRequestNotifications: z.boolean(),
  playdateRequestNotifications: z.boolean(),
  notificationStartTime: z.string().optional(),
  notificationEndTime: z.string().optional(),
});

export const preferencesSchema = z.object({
  searchRadius: z
    .number()
    .min(1, "Search radius must be at least 1km")
    .max(500, "Search radius cannot exceed 500km"),
  showOnlineStatus: z.boolean(),
  notificationSettings: notificationSettingsSchema,
});

export type PreferencesForm = z.infer<typeof preferencesSchema>;
export type NotificationKey = keyof z.infer<typeof notificationSettingsSchema>;
