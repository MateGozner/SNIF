import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MessageStatusProps {
  isRead: boolean;
}

export function MessageStatus({ isRead }: MessageStatusProps) {
  return (
    <motion.div
      className="relative h-4 w-7 ml-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isRead ? (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Check className="absolute left-0 h-4 w-4 text-emerald-400 drop-shadow-[0_0_3px_rgba(52,199,89,0.5)]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Check className="absolute left-[6px] h-4 w-4 text-emerald-400 drop-shadow-[0_0_3px_rgba(52,199,89,0.5)]" />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="absolute left-0 h-4 w-4 text-white/70" />
        </motion.div>
      )}
    </motion.div>
  );
}
