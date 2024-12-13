import { z } from "zod";

export const locationSchema = z.object({
  location: z
    .object({
      latitude: z
        .number()
        .min(-90, "Invalid latitude")
        .max(90, "Invalid latitude"),
      longitude: z
        .number()
        .min(-180, "Invalid longitude")
        .max(180, "Invalid longitude"),
      address: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .refine((data) => data.latitude !== 0 || data.longitude !== 0, {
      message: "Location is required",
    }),
});

export type LocationForm = z.infer<typeof locationSchema>;
