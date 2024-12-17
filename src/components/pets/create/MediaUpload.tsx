// src/components/pets/create/MediaUpload.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePetDto } from "@/lib/types/pet";
import { FileWithPreview, MediaUploadCore } from "../shared/MediaUploadCore";

interface MediaUploadProps {
  initialData: Partial<CreatePetDto>;
  onNext: (data: Partial<CreatePetDto>) => void;
  onBack: () => void;
}

export function MediaUpload({ initialData, onNext, onBack }: MediaUploadProps) {
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [videos, setVideos] = useState<FileWithPreview[]>([]);

  const handleSubmit = () => {
    const updatedData: Partial<CreatePetDto> = {
      ...initialData,
      photos: photos.map((p) => p.file),
      videos: videos.map((v) => v.file),
    };
    onNext(updatedData);
  };

  return (
    <div className="space-y-6 relative min-h-[400px]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black opacity-80" />

      <div className="relative z-10 rounded-2xl backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] shadow-2xl p-8">
        <MediaUploadCore
          photos={photos}
          videos={videos}
          onPhotosChange={setPhotos}
          onVideosChange={setVideos}
          className="text-white"
        />
      </div>

      <div className="relative z-10 flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 
            text-white hover:bg-white/10 transition-colors"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={photos.length === 0 && videos.length === 0}
          className="px-8 rounded-full bg-[#2997FF] hover:bg-[#147CE5] text-white 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            shadow-[0_0_20px_rgba(41,151,255,0.2)]"
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
