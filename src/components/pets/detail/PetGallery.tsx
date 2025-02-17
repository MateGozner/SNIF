import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ImagePlus,
  Film,
  ImageIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaUploadModal } from "./MediaUploadModal";
import { cn } from "@/lib/utils";
import { MediaResponseDto, MediaType } from "@/lib/types/pet";

interface PetGalleryProps {
  media: MediaResponseDto[];
  name: string;
  petId: string;
  showAddMedia?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
  variant?: "default" | "minimal";
}

export function PetGallery({
  media = [],
  name,
  petId,
  showAddMedia = true,
  className,
  aspectRatio = "video",
  variant = "default",
}: PetGalleryProps) {
  const [activeType, setActiveType] = useState<MediaType>(MediaType.Photo);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mediaItems = media.filter((item) => item.type === activeType);
  const hasPhotos = media.some((item) => item.type === MediaType.Photo);
  const hasVideos = media.some((item) => item.type === MediaType.Video);

  const aspectRatioClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[2/1]",
  };

  // Empty state
  if (!hasPhotos && !hasVideos) {
    return (
      <Card
        className={cn(
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0",
          className
        )}
      >
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <Alert className="max-w-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No media available for {name}</AlertDescription>
          </Alert>
          {showAddMedia && (
            <MediaUploadModal petId={petId}>
              <Button variant="secondary" size="sm" className="ml-4">
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </MediaUploadModal>
          )}
        </CardContent>
      </Card>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  return (
    <Card
      className={cn(
        "bg-transparent border-0",
        variant === "minimal" && "shadow-none",
        className
      )}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-lg",
            aspectRatioClasses[aspectRatio]
          )}
        >
          {/* Media Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeType}-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {mediaItems[currentIndex]?.type === MediaType.Photo ? (
                <Image
                  src={mediaItems[currentIndex].url}
                  alt={`${name}'s ${mediaItems[currentIndex].type} ${
                    currentIndex + 1
                  }`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              ) : (
                <video
                  key={mediaItems[currentIndex]?.url}
                  src={mediaItems[currentIndex]?.url}
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  autoPlay
                  loop
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls Overlay */}
          <div className="absolute inset-0 flex opacity-0 hover:opacity-100 transition-all duration-300">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 pointer-events-auto">
              {/* Navigation Controls */}
              {mediaItems.length > 1 && (
                <>
                  <div className="absolute inset-y-0 left-4 flex items-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handlePrev}
                      className="h-10 w-10 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleNext}
                      className="h-10 w-10 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}

              {/* Media Type Toggle */}
              {hasPhotos && hasVideos && variant === "default" && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-full p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveType(MediaType.Photo);
                        setCurrentIndex(0);
                      }}
                      className={cn(
                        "rounded-full px-3",
                        activeType === MediaType.Photo &&
                          "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      )}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Photos
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveType(MediaType.Video);
                        setCurrentIndex(0);
                      }}
                      className={cn(
                        "rounded-full px-3",
                        activeType === MediaType.Video &&
                          "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      )}
                    >
                      <Film className="h-4 w-4 mr-2" />
                      Videos
                    </Button>
                  </div>
                </div>
              )}

              {/* Add Media Button */}
              {showAddMedia && variant === "default" && (
                <div className="absolute top-4 right-4">
                  <MediaUploadModal petId={petId}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                    >
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                  </MediaUploadModal>
                </div>
              )}

              {/* Progress Indicators */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {mediaItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === currentIndex
                          ? "w-6 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/75"
                      )}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnails (only shown in default variant) */}
        {variant === "default" && mediaItems.length > 0 && (
          <div className="grid grid-cols-6 gap-2 p-4">
            {mediaItems.slice(0, 6).map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden",
                  "ring-offset-2 transition-all duration-200",
                  currentIndex === index
                    ? "ring-2 ring-blue-500 dark:ring-blue-400"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                {item.type === MediaType.Photo ? (
                  <Image
                    src={item.url}
                    alt={item.title || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 16vw, 8vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <Film className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
