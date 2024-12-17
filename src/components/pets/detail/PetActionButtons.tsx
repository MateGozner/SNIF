// src/components/pets/detail/PetActionButtons.tsx
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Edit2, MessageCircle, Share2, Trash2 } from "lucide-react";

interface PetActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onMessage: () => void;
  onShare: () => void;
}

export function PetActionButtons({
  onEdit,
  onDelete,
  onMessage,
  onShare,
}: PetActionButtonsProps) {
  const buttons = [
    {
      label: "Message",
      icon: MessageCircle,
      onClick: onMessage,
      className: "bg-blue-500 hover:bg-blue-600 text-white",
      delay: 0,
    },
    {
      label: "Share",
      icon: Share2,
      onClick: onShare,
      className:
        "bg-white/10 hover:bg-white/20 text-white border border-white/20",
      delay: 0.1,
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: onEdit,
      className:
        "bg-white/10 hover:bg-white/20 text-white border border-white/20",
      delay: 0.2,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "bg-red-500/80 hover:bg-red-600/80 text-white",
      delay: 0.3,
    },
  ];

  return (
    <BackgroundGradient className="p-2 rounded-2xl">
      <div className="flex flex-wrap justify-center gap-3">
        {buttons.map((button) => (
          <motion.div
            key={button.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: button.delay }}
          >
            <Button
              variant="ghost"
              onClick={button.onClick}
              className={`${button.className} backdrop-blur-lg px-6 py-6 h-auto rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300`}
            >
              <button.icon className="w-5 h-5" />
              {button.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </BackgroundGradient>
  );
}
