// components/user/ProfileAvatarWithStatus.tsx
import { ProfileAvatar } from "./ProfileAvatar";
import { OnlineStatus } from "./OnlineStatus";

interface ProfileAvatarWithStatusProps {
  profilePicture?: string;
  name: string;
  isOnline?: boolean;
  lastOnline?: string;
  onFileSelect?: (file: File) => void;
  isOnFileSelect?: boolean;
  showStatus?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProfileAvatarWithStatus({
  profilePicture,
  name,
  isOnline,
  lastOnline,
  onFileSelect,
  isOnFileSelect = true,
  showStatus = true,
  size = "md",
}: ProfileAvatarWithStatusProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileAvatar
        profilePicture={profilePicture}
        name={name}
        onFileSelect={onFileSelect || (() => {})}
        isOnFileSelect={isOnFileSelect}
        size={size}
      />
      {showStatus && (
        <OnlineStatus
          isOnline={isOnline}
          lastOnline={lastOnline}
          className="text-xs"
        />
      )}
    </div>
  );
}
