import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera } from "lucide-react";


interface ProfileAvatarProps {
  profilePicture?: string;
  name: string;
  onFileSelect: (file: File) => void;
}

export function ProfileAvatar({
  profilePicture,
  name,
  onFileSelect,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="relative group">
      <Avatar className="h-20 w-20 ring-2 ring-background">
        <AvatarImage src={profilePicture} />
        <AvatarFallback className="bg-[#2997FF] text-white text-xl">
          {name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
      >
        <Camera className="h-6 w-6 text-white" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
