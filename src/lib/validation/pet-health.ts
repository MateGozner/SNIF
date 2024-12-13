// src/lib/validation/pet-health.ts
import { z } from "zod";

export const healthInfoSchema = z.object({
  medicalHistory: z.object({
    isVaccinated: z.boolean(),
    healthIssues: z
      .array(z.string())
      .min(0, "Add at least one health issue if any")
      .max(10, "Maximum 10 health issues allowed"),
    vaccinationRecords: z
      .array(z.string())
      .min(0, "Add at least one vaccination record if vaccinated"),
    lastCheckup: z
      .string()
      .optional()
      .refine((date) => !date || new Date(date) <= new Date(), {
        message: "Last checkup date cannot be in the future",
      }),
    vetContact: z
      .string()
      .optional()
  }),
});

export type HealthInfoForm = z.infer<typeof healthInfoSchema>;
