import { LocationDto } from "./location";

export interface PetDto {
  id: string;
  name: string;
  species: string;
  breed: string;
}

export interface PreferencesDto {
  searchRadius: number;
  showOnlineStatus: boolean;
  notificationSettings?: NotificationSettings;
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
  preferences?: PreferencesDto;
  createdAt: string;
  updatedAt?: string;
  profilePicturePath?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface UpdateUserPersonalInfoDto {
  name: string;
  profilePicture?: File;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newMatchNotifications: boolean;
  messageNotifications: boolean;
  breedingRequestNotifications: boolean;
  playdateRequestNotifications: boolean;
  notificationStartTime?: string;
  notificationEndTime?: string;
}

export interface UpdatePreferencesDto {
  searchRadius: number;
  notificationSettings?: NotificationSettings;
  showOnlineStatus: boolean;
}
