// src/lib/constants/pet-health.ts
export const COMMON_HEALTH_ISSUES = [
  "Allergies",
  "Arthritis",
  "Dental Disease",
  "Diabetes",
  "Eye Problems",
  "Heart Disease",
  "Hip Dysplasia",
  "Obesity",
  "Skin Infections",
  "Respiratory Issues",
] as const;

export const COMMON_VACCINATIONS = {
  Dog: [
    "Rabies",
    "DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)",
    "Bordetella",
    "Lyme Disease",
    "Leptospirosis",
  ],
  Cat: [
    "Rabies",
    "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
    "FeLV (Feline Leukemia)",
    "FIV (Feline Immunodeficiency Virus)",
  ],
} as const;
