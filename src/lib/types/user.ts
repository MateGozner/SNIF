import { LocationDto } from "./location";

export interface PetDto {
  id: string;
  name: string;
  species: string;
  breed: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  location?: LocationDto;
  pets: PetDto[];
  breederVerification?: {
    isVerified: boolean;
  };
  preferences?: {
    searchRadius: number;
  };
  createdAt: string;
  updatedAt?: string;
}
