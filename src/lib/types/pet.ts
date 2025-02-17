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

export enum MediaType {
  Photo,
  Video,
}

export interface CreateMediaDto {
  type: MediaType;
  fileName: string;
  contentType: string;
  base64Data: string;
  title?: string;
  description?: string;
}

export interface MediaResponseDto {
  id: string;
  url: string;
  type: MediaType;
  fileName: string;
  contentType: string;
  size: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
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
  media?: MediaResponseDto[];
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
  media?: CreateMediaDto[];
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
