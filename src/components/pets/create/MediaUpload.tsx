"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreateMediaDto, CreatePetDto, MediaType } from "@/lib/types/pet";
import { FileWithPreview, MediaUploadCore } from "../shared/MediaUploadCore";
import { cn } from "@/lib/utils";
import { fileToBase64 } from "@/lib/utils/fileHelpers";

interface MediaUploadProps {
  initialData: Partial<CreatePetDto>;
  onNext: (data: Partial<CreatePetDto>) => void;
  onBack: () => void;
}

export function MediaUpload({ initialData, onNext, onBack }: MediaUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const handleSubmit = async () => {
    // Convert files to media objects with base64 data
    const mediaPromises = files.map(
      async ({ file, type }): Promise<CreateMediaDto> => ({
        type,
        fileName: file.name,
        contentType: file.type,
        base64Data: await fileToBase64(file),
        title: file.name,
      })
    );

    const media = await Promise.all(mediaPromises);

    const updatedData: Partial<CreatePetDto> = {
      ...initialData,
      media,
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
            files={files}
            onFilesChange={setFiles}
            className="text-white"
          />
        </div>
      </Card>

      {/* Media Summary */}
      {files.length > 0 && (
        <div className="flex gap-4 text-sm text-white/60">
          <div>
            Photos: {files.filter((f) => f.type === MediaType.Photo).length}
          </div>
          <div>
            Videos: {files.filter((f) => f.type === MediaType.Video).length}
          </div>
        </div>
      )}

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
          disabled={files.length === 0}
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
