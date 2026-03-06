import { PetDto, PetPurpose } from "./pet";
import { MeetupLocation } from "./park";

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
  meetupLocation?: MeetupLocation;
}

export interface CreateMatchDto {
  initiatorPetId: string;
  targetPetId: string;
  matchPurpose: PetPurpose;
}

export interface UpdateMatchDto {
  status: MatchStatus;
}
