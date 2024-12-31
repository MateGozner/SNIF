// components/profile/OnlineStatus.tsx
import { formatDistanceToNow } from "date-fns";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnlineStatusProps {
  isOnline?: boolean;
  lastOnline?: string;
  className?: string;
  showDot?: boolean;
}

export function OnlineStatus({
  isOnline,
  lastOnline,
  className,
  showDot = true,
}: OnlineStatusProps) {
  if (isOnline === undefined) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {showDot && (
        <Circle
          className={cn("h-2 w-2 fill-current", {
            "text-green-500": isOnline,
            "text-gray-400": !isOnline,
          })}
        />
      )}
      <span
        className={cn("text-sm", {
          "text-green-500": isOnline,
          "text-gray-400": !isOnline,
        })}
      >
        {isOnline
          ? "Online"
          : lastOnline
          ? `Last seen ${formatDistanceToNow(new Date(lastOnline), {
              addSuffix: true,
            })}`
          : "Offline"}
      </span>
    </div>
  );
}
