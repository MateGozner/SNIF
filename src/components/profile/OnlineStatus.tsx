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
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5",
        className
      )}
    >
      {showDot && (
        <Circle
          className={cn("h-1.5 w-1.5 fill-current", {
            "text-green-400": isOnline,
            "text-zinc-400": !isOnline,
          })}
        />
      )}
      <span
        className={cn("text-xs font-medium", {
          "text-green-400": isOnline,
          "text-zinc-400": !isOnline,
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
