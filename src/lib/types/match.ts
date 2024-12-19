import { PetDto, PetPurpose } from "./pet";

export enum MatchStatus {
  Pending,
  Accepted,
  Rejected,
  Expired,
}

export interface MatchDto {
  id: string;
  initiatorPet: PetDto;
  targetPet: PetDto;
  matchPurpose: PetPurpose;
  status: MatchStatus;
  expiresAt?: string;
}

export interface CreateMatchDto {
  targetPetId: string;
  matchPurpose: PetPurpose;
}

export interface UpdateMatchDto {
  status: MatchStatus;
}
