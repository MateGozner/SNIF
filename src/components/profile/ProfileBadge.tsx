import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Player } from "@lottiefiles/react-lottie-player";

interface ProfileBadgesProps {
  isVerifiedBreeder: boolean;
  createdAt: string;
}

export function ProfileBadges({
  isVerifiedBreeder,
  createdAt,
}: ProfileBadgesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-wrap gap-2"
    >
      {isVerifiedBreeder && (
        <Badge
          className="bg-gradient-to-b from-[#2997FF]/20 to-[#2997FF]/10 text-[#2997FF] 
          border border-[#2997FF]/20 backdrop-blur-xl px-4 py-1.5 rounded-full font-medium
          shadow-[0_0_20px_rgba(41,151,255,0.2)]"
        >
          Verified Breeder
        </Badge>
      )}
      <Badge
        className="bg-gradient-to-b from-white/[0.08] to-white/[0.05] text-white/80 
        border border-white/[0.1] backdrop-blur-xl px-4 py-1.5 rounded-full font-medium"
      >
        <Player
          autoplay
          loop
          src="/animations/verified-badge.json"
          style={{ height: 20, width: 20 }}
        />
        Joined {new Date(createdAt).toLocaleDateString()}
      </Badge>
    </motion.div>
  );
}
