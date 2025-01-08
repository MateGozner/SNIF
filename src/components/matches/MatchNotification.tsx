// src/components/MatchNotification.tsx
"use client";

import { useNotifications } from "@/hooks/notifications/useNotifications";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ThumbsUp, X } from "lucide-react";

const PetAvatar = ({ color = "blue", className = "" }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill={`rgb(var(--${color}-500))`} />
      <circle cx="35" cy="40" r="5" fill="white" />
      <circle cx="65" cy="40" r="5" fill="white" />
      <path
        d="M 35 65 Q 50 75 65 65"
        stroke="white"
        strokeWidth="3"
        fill="none"
      />
      <motion.path
        d="M 20 30 Q 25 20 30 30"
        stroke="white"
        strokeWidth="3"
        fill="none"
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5
        }}
      />
      <motion.path
        d="M 70 30 Q 75 20 80 30"
        stroke="white"
        strokeWidth="3"
        fill="none"
        initial={{ rotate: 5 }}
        animate={{ rotate: -5 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5
        }}
      />
    </svg>
  </div>
);

export function MatchNotification() {
  const { notifications, clearNotification } = useNotifications();

  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <motion.div
          key={notification.MatchedPetId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-500/30 to-blue-600/30 backdrop-blur-xl" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative z-10 w-full max-w-lg p-6 text-center"
          >
            <button
              onClick={() => clearNotification(notification.MatchedPetId)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center items-center gap-4 mb-8"
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 p-1"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <PetAvatar color="blue" className="w-full h-full" />
              </motion.div>
              
              <Heart className="mx-4 h-12 w-12 text-blue-400 self-center animate-pulse" />
              
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-1 opacity-80"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <PetAvatar color="purple" className="w-full h-full" />
              </motion.div>
            </motion.div>

            {/* Rest of the component remains the same */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Potential Match!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 mb-6"
            >
              {notification.PetName} is now a potential match for your pet!
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2 text-white"
            >
              <p className="text-lg text-white/90">
                {notification.Species} • {notification.Breed}
              </p>
              <p className="text-base text-white/80">
                {notification.Distance.toFixed(1)} km away
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex justify-center gap-4"
            >
              <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
                <ThumbsUp size={20} />
                Like Back
              </button>
              <button 
                onClick={() => clearNotification(notification.MatchedPetId)}
                className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
              >
                Maybe Later
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}