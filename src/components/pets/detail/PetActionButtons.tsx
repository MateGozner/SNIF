// src/components/pets/detail/PetActionButtons.tsx
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Edit2, Heart, MessageCircle, Trash2 } from "lucide-react";

interface PetActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onMessage: () => void;
  onMatch: () => void;
}

export function PetActionButtons({
  onEdit,
  onDelete,
  onMessage,
  onMatch,
}: PetActionButtonsProps) {
  const buttons = [
    {
      label: "Message",
      icon: MessageCircle,
      onClick: onMessage,
      className: "bg-white/10 hover:bg-white/20 text-white",
      delay: 0,
    },
    {
      label: "Find Match",
      icon: Heart,
      onClick: onMatch,
      className: "bg-[#2997FF]/20 hover:bg-[#2997FF]/30 text-[#2997FF]",
      delay: 0.1,
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: onEdit,
      className: "bg-white/10 hover:bg-white/20 text-white/80",
      delay: 0.2,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      className: "bg-red-500/10 hover:bg-red-500/20 text-red-500",
      delay: 0.3,
    },
  ];

  return (
    <BackgroundGradient className="p-4 rounded-3xl">
      <div className="flex flex-wrap justify-center gap-4">
        {buttons.map((button) => (
          <motion.div
            key={button.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: button.delay,
              type: "spring",
              stiffness: 100,
            }}
          >
            <Button
              variant="ghost"
              onClick={button.onClick}
              className={`
                ${button.className}
                backdrop-blur-xl
                px-8 
                py-7 
                h-auto 
                rounded-2xl 
                flex 
                items-center 
                gap-3 
                text-sm 
                font-medium 
                shadow-lg
                shadow-black/5
                border
                border-white/10
                transition-all 
                duration-300
                hover:scale-105
              `}
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
