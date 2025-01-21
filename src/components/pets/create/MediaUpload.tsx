"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreatePetDto } from "@/lib/types/pet";
import { FileWithPreview, MediaUploadCore } from "../shared/MediaUploadCore";
import { cn } from "@/lib/utils";

// Media Upload Component
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
    <div className="space-y-6">
      {/* Media Upload Area */}
      <Card
        className={cn(
          "overflow-hidden backdrop-blur-xl",
          "bg-white/5 border-white/10",
          "shadow-lg"
        )}
      >
        <div className="p-6">
          <MediaUploadCore
            photos={photos}
            videos={videos}
            onPhotosChange={setPhotos}
            onVideosChange={setVideos}
            className="text-white"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className={cn(
            "border-white/10 text-white/60",
            "hover:text-white hover:bg-white/5",
            "min-w-[100px]"
          )}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={photos.length === 0 && videos.length === 0}
          className={cn(
            "bg-blue-500 hover:bg-blue-600 text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "min-w-[100px]",
            "shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          )}
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
