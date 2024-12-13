import { z } from "zod";
import { Gender, PetPurpose } from "../types/pet";
import {
  CAT_BREEDS,
  DOG_BREEDS,
  PERSONALITY_TRAITS,
  PET_SPECIES,
} from "../constants/pets";

export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),

  species: z.enum(PET_SPECIES, {
    required_error: "Please select a species",
  }),

  breed: z
    .string()
    .min(1, "Breed is required")
    .refine((val) => {
      if (val === "Other") return true;
      return DOG_BREEDS.includes(val) || CAT_BREEDS.includes(val);
    }, "Please select a valid breed"),

  age: z
    .number()
    .min(0, "Age cannot be negative")
    .max(50, "Age must be less than 50 years"),

  gender: z.nativeEnum(Gender, {
    required_error: "Please select a gender",
  }),

  purpose: z
    .array(z.nativeEnum(PetPurpose))
    .min(1, "Select at least one purpose")
    .max(3, "Maximum 3 purposes allowed"),

  personality: z
    .array(z.string())
    .min(1, "Add at least one personality trait")
});

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;

export const getBreedsBySpecies = (species: string) => {
  switch (species) {
    case "Dog":
      return [...DOG_BREEDS, "Other"];
    case "Cat":
      return [...CAT_BREEDS, "Other"];
    default:
      return ["Other"];
  }
};
