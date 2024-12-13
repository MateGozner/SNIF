// src/components/pets/create/MediaUpload.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Loader2, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatePetDto } from "@/lib/types/pet";

interface MediaUploadProps {
  initialData: Partial<CreatePetDto>;
  onNext: (data: Partial<CreatePetDto>) => void;
  onBack: () => void;
}

type FileWithPreview = {
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
};

export function MediaUpload({ initialData, onNext, onBack }: MediaUploadProps) {
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [videos, setVideos] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
    }));

    const photoFiles = newFiles.filter((f) => f.file.type.startsWith("image/"));
    const videoFiles = newFiles.filter((f) => f.file.type.startsWith("video/"));

    setPhotos((prev) => [...prev, ...photoFiles]);
    setVideos((prev) => [...prev, ...videoFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 10485760, // 10MB
  });

  const uploadAll = async () => {
    const updatedData: Partial<CreatePetDto> = {
      ...initialData,
      photos: photos.map((p) => p.file),
      videos: videos.map((v) => v.file),
    };
    onNext(updatedData);
  };

  useEffect(() => {
    return () => {
      [...photos, ...videos].forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [photos, videos]);

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer",
          isDragActive && "border-[#2997FF] bg-[#2997FF]/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            Drag & drop files here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: PNG, JPG, MP4, MOV up to 10MB
          </p>
        </div>
      </div>

      {(photos.length > 0 || videos.length > 0) && (
        <div className="space-y-4">
          {photos.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <Card key={index} className="relative aspect-square">
                    <Image
                      src={photo.preview}
                      width={1}
                      height={1}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {photo.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {!photo.uploading && (
                      <button
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Videos</h3>
              <div className="grid grid-cols-3 gap-4">
                {videos.map((video, index) => (
                  <Card key={index} className="relative aspect-video">
                    <video
                      src={video.preview}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {video.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {!video.uploading && (
                      <button
                        onClick={() =>
                          setVideos((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={uploadAll}
          disabled={photos.length === 0 && videos.length === 0}
          className="bg-[#2997FF] hover:bg-[#147CE5]"
        >
          Finish
        </Button>
      </div>
    </div>
  );
}
