// src/components/pets/detail/PetGallery.tsx
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Film,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils/urlTransformer";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MediaUploadModal } from "./MediaUploadModal";

interface PetGalleryProps {
  photos: string[];
  videos?: string[];
  name: string;
  petId: string;
}

type MediaType = "photos" | "videos";

export function PetGallery({ photos, videos, name, petId }: PetGalleryProps) {
  const [mediaType, setMediaType] = useState<MediaType>("photos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  if (!photos?.length && !videos?.length) {
    return (
      <BackgroundGradient className="rounded-3xl overflow-hidden">
        <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-black/40 backdrop-blur-xl">
          <div className="absolute top-4 right-4 z-20">
            <MediaUploadModal petId={petId} />
          </div>
          <Alert className="w-[80%] bg-white/[0.03] border-white/[0.05]">
            <AlertCircle className="h-5 w-5 text-white/60" />
            <AlertDescription className="text-white/80">
              No media available for {name}
            </AlertDescription>
          </Alert>
        </div>
      </BackgroundGradient>
    );
  }

  const hasVideos = videos && videos.length > 0;
  const currentMedia = mediaType === "photos" ? photos : videos;

  const handleSwipe = (newDirection: "left" | "right") => {
    if (!currentMedia?.length) return;
    setDirection(newDirection);
    const newIndex =
      newDirection === "right"
        ? (currentIndex + 1) % currentMedia.length
        : (currentIndex - 1 + currentMedia.length) % currentMedia.length;

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setDirection(null);
    }, 300);
  };

  const handleMediaTypeChange = (newType: MediaType) => {
    setMediaType(newType);
    setCurrentIndex(0);
  };

  return (
    <BackgroundGradient className="rounded-3xl overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        {/* Media Type Selector */}
        {hasVideos && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
            <Tabs
              value={mediaType}
              onValueChange={(v) => handleMediaTypeChange(v as MediaType)}
              className="bg-black/20 backdrop-blur-lg rounded-full p-1 z-20"
            >
              <TabsList className="bg-transparent border-none">
                <TabsTrigger
                  value="photos"
                  className="data-[state=active]:bg-white/20 text-white"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Photos ({photos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:bg-white/20 text-white"
                >
                  <Film className="w-4 h-4 mr-2" />
                  Videos ({videos.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        <div className="absolute top-4 right-4 z-20">
          <MediaUploadModal petId={petId} actualPhotos={photos} actualVideos={videos} />
        </div>
        {/* Media Viewer */}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${mediaType}-${currentIndex}`}
            initial={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute inset-0"
          >
            {mediaType === "photos" ? (
              <Image
                src={getImageUrl(photos[currentIndex])}
                alt={`${name}'s photo ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            ) : (
              <video
                src={getImageUrl(videos?.[currentIndex] ?? "")}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
                controlsList="nodownload" // Prevent download
                style={{ zIndex: 20 }} // Ensure controls are clickable
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/30 transition-all"
            onClick={() => handleSwipe("left")}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl hover:bg-white/30 border border-white/30 transition-all"
            onClick={() => handleSwipe("right")}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Media Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {currentMedia.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </BackgroundGradient>
  );
}
