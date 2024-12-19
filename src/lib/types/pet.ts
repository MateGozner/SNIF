// src/lib/types/pet.ts
import { LocationDto } from "./location";

export enum Gender {
  Male = 0,
  Female = 1,
}

export enum PetPurpose {
  Breeding = 0,
  Friendship = 1,
  Playdate = 2,
}

export interface MedicalHistoryDto {
  isVaccinated: boolean;
  healthIssues: string[];
  vaccinationRecords: string[];
  lastCheckup?: string;
  vetContact?: string;
}

export interface PetDto {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: Gender;
  purpose: PetPurpose[];
  personality: string[];
  medicalHistory?: MedicalHistoryDto;
  photos: string[];
  videos: string[];
  location?: LocationDto;
  ownerId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePetDto {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: Gender;
  purpose: PetPurpose[];
  personality: string[];
  medicalHistory?: MedicalHistoryDto;
  location?: LocationDto;
  photos?: File[];
  videos?: File[];
}

export interface UpdatePetDto {
  name?: string;
  species?: string;
  breed?: string;
  age?: number;
  gender?: Gender;
  purpose?: PetPurpose[];
  personality?: string[];
  medicalHistory?: MedicalHistoryDto;
  location?: LocationDto;
}
