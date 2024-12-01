import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Pencil, X } from "lucide-react";
import { CardTitle } from "../ui/card";


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
          className="h-9 text-lg font-semibold"
          autoFocus
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 text-[#2997FF]"
          onClick={() => onSave(newName)}
          disabled={isPending}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 text-muted-foreground"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <CardTitle className="text-2xl">{name}</CardTitle>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-muted-foreground hover:text-[#2997FF]"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
