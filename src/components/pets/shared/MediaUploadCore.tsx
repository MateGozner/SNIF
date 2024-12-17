// src/components/pets/shared/MediaUploadCore.tsx
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileWithPreview = {
  file: File;
  preview: string;
  uploading: boolean;
  error?: string;
};

interface MediaUploadCoreProps {
  photos: FileWithPreview[];
  videos: FileWithPreview[];
  onPhotosChange: (photos: FileWithPreview[]) => void;
  onVideosChange: (videos: FileWithPreview[]) => void;
  className?: string;
}

export function MediaUploadCore({
  photos,
  videos,
  onPhotosChange,
  onVideosChange,
  className,
}: MediaUploadCoreProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
      }));

      const photoFiles = newFiles.filter((f) =>
        f.file.type.startsWith("image/")
      );
      const videoFiles = newFiles.filter((f) =>
        f.file.type.startsWith("video/")
      );

      if (photoFiles.length > 0) {
        onPhotosChange([...photos, ...photoFiles]);
      }

      if (videoFiles.length > 0) {
        onVideosChange([...videos, ...videoFiles]);
      }
    },
    [photos, videos, onPhotosChange, onVideosChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 10485760,
  });

  useEffect(() => {
    return () => {
      [...photos, ...videos].forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [photos, videos]);

  return (
    <div className={cn("space-y-6", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer backdrop-blur-sm",
          isDragActive
            ? "border-[#2997FF] bg-[#2997FF]/5"
            : "border-white/20 hover:border-white/40 bg-white/[0.02]"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-white/60" />
          <p className="text-white/60">
            Drag & drop files here, or click to select
          </p>
          <p className="text-xs text-white/40">
            Supports: PNG, JPG, MP4, MOV up to 10MB
          </p>
        </div>
      </div>

      {/* Media Previews */}
      {(photos.length > 0 || videos.length > 0) && (
        <div className="space-y-4">
          {/* Photos Grid */}
          {photos.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 text-white/80">Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <Card
                    key={index}
                    className="relative aspect-square bg-black/20 border-white/10"
                  >
                    <Image
                      src={photo.preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    {!photo.uploading && (
                      <button
                        onClick={() => {
                          onPhotosChange(photos.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/75"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {videos.length > 0 && (
            <div>
              <h3 className="font-medium mb-3 text-white/80">Videos</h3>
              <div className="grid grid-cols-3 gap-4">
                {videos.map((video, index) => (
                  <Card
                    key={index}
                    className="relative aspect-video bg-black/20 border-white/10"
                  >
                    <video
                      src={video.preview}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {!video.uploading && (
                      <button
                        onClick={() => {
                          onVideosChange(videos.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/75"
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
    </div>
  );
}
