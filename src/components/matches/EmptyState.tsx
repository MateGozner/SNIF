import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center text-center p-8"
    >
      <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center">
        <Heart className="w-12 h-12 text-[#2997FF]" />
      </div>
      <h3 className="text-2xl font-medium text-white mb-2">No More Matches</h3>
      <p className="text-white/60 max-w-sm">
        We&apos;ve run out of potential matches for now. Check back later for
        more!
      </p>
    </motion.div>
  );
}
