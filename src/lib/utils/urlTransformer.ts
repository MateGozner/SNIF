import { UserDto } from "../types/user";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export const getImageUrl = (path: string) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path.startsWith('/') ? path.slice(1) : path}`;
};

export const transformProfileData = (data: UserDto): UserDto => ({
  ...data,
  profilePicturePath: data.profilePicturePath
    ? data.profilePicturePath.startsWith('http') 
      ? data.profilePicturePath 
      : `${API_BASE_URL}${data.profilePicturePath}`
    : undefined,
});