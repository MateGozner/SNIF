// components/user/ProfileAvatarWithStatus.tsx
import { ProfileAvatar } from "./ProfileAvatar";
import { OnlineStatus } from "./OnlineStatus";

interface ProfileAvatarWithStatusProps {
  profilePicture?: string;
  name: string;
  isOnline?: boolean;
  lastOnline?: string;
  onFileSelect?: (file: File) => void;
  showStatus?: boolean;
}

export function ProfileAvatarWithStatus({
  profilePicture,
  name,
  isOnline,
  lastOnline,
  onFileSelect,
  showStatus = true,
}: ProfileAvatarWithStatusProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProfileAvatar
        profilePicture={profilePicture}
        name={name}
        onFileSelect={onFileSelect || (() => {})}
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
