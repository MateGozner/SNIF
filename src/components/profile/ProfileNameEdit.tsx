import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Pencil, X } from "lucide-react";

interface ProfileNameEditProps {
  name: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export function ProfileNameEdit({
  name,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isPending,
}: ProfileNameEditProps) {
  const [newName, setNewName] = useState(name);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="h-10 text-xl font-medium bg-white/[0.05] border-white/[0.08] rounded-xl 
            focus:ring-2 focus:ring-[#2997FF] focus:border-transparent transition-all duration-200"
          autoFocus
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 bg-[#2997FF]/10 hover:bg-[#2997FF]/20 text-[#2997FF] rounded-xl 
            transition-all duration-200"
          onClick={() => onSave(newName)}
          disabled={isPending}
        >
          <Check className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 bg-white/[0.05] hover:bg-white/[0.1] text-white/70 rounded-xl 
            transition-all duration-200"
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-3xl font-medium tracking-tight text-white">{name}</h1>
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 text-white/40 hover:text-[#2997FF] transition-colors duration-200"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
