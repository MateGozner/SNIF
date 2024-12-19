"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import EmptyState from "../matches/EmptyState";

interface CardStackProps {
  cards: React.ReactNode[];
  onSwipe: (direction: "left" | "right", index: number) => void;
}

export function CardStack({ cards, onSwipe }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "right" : "left";
      setExitDirection(direction);
      onSwipe(direction, currentIndex);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
      }, 200);
    }
  };

  return (
    <div className="relative h-[600px]">
      <AnimatePresence mode="popLayout">
        {currentIndex < cards.length ? (
          <motion.div
            key={currentIndex}
            className="absolute w-full"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleDragEnd(info)}
            animate={{
              scale: 1,
              rotate: 0,
              opacity: 1,
            }}
            exit={{
              x: exitDirection === "left" ? -300 : 300,
              opacity: 0,
              rotate: exitDirection === "left" ? -20 : 20,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {cards[currentIndex]}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </AnimatePresence>
    </div>
  );
}
