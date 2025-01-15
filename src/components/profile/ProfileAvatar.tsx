import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  profilePicture?: string;
  name: string;
  onFileSelect: (file: File) => void;
  isOnFileSelect?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProfileAvatar({
  profilePicture,
  name,
  onFileSelect,
  isOnFileSelect,
  size = "md",
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-12 w-12 text-sm",
    md: "h-20 w-20 text-xl",
    lg: "h-32 w-32 text-2xl",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="relative group">
      <Avatar
        className={cn(
          sizeClasses[size],
          "ring-2 ring-white/10 shadow-lg transition-transform duration-200 group-hover:scale-105"
        )}
      >
        <AvatarImage src={profilePicture} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-br from-[#2997FF] to-[#147CE5] text-white font-medium">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isOnFileSelect && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
          >
            <Camera className="h-6 w-6 text-white/90" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
