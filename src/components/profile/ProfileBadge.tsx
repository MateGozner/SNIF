import { Badge } from "../ui/badge";

interface ProfileBadgesProps {
  isVerifiedBreeder: boolean;
  createdAt: string;
}

export function ProfileBadges({
  isVerifiedBreeder,
  createdAt,
}: ProfileBadgesProps) {
  return (
    <div className="flex gap-2">
      {isVerifiedBreeder && <Badge variant="secondary">Verified Breeder</Badge>}
      <Badge variant="outline">
        Joined {new Date(createdAt).toLocaleDateString()}
      </Badge>
    </div>
  );
}
