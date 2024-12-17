import { useState } from "react";
import { FileWithPreview, MediaUploadCore } from "../shared/MediaUploadCore";
import { useAddPetPhoto, useAddPetVideo } from "@/hooks/pets/usePetMedia";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageMediaModal } from "./ManageMediaModal";

interface MediaUploadModalProps {
  petId: string;
  actualPhotos?: string[];
  actualVideos?: string[];
}

export function MediaUploadModal({
  petId,
  actualPhotos,
  actualVideos,
}: MediaUploadModalProps) {
  const [mode, setMode] = useState<"upload" | "manage">("upload");
  const [photos, setPhotos] = useState<FileWithPreview[]>([]);
  const [videos, setVideos] = useState<FileWithPreview[]>([]);
  const addPhoto = useAddPetPhoto(petId);
  const addVideo = useAddPetVideo(petId);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const uploadPromises = [
        ...photos.map(({ file }) => addPhoto.mutateAsync(file)),
        ...videos.map(({ file }) => addVideo.mutateAsync(file)),
      ];

      await Promise.all(uploadPromises);
      setPhotos([]);
      setVideos([]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTitle className="bg-black/90 border-b border-white/10 p-6 text-white text-2xl font-medium" />
      <DialogTrigger asChild>
        <Button
          className="absolute right-4 top-4 rounded-full w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20"
          size="icon"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-black/90 border border-white/10 backdrop-blur-xl p-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-white">
              {mode === "upload" ? "Add Media" : "Manage Media"}
            </h2>
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "upload" | "manage")}
            >
              <TabsList className="bg-white/[0.02] border border-white/10">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode === "upload" ? (
            <>
              <h2 className="text-2xl font-medium text-white">Add Media</h2>

              <MediaUploadCore
                photos={photos}
                videos={videos}
                onPhotosChange={setPhotos}
                onVideosChange={setVideos}
              />

              <div className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/[0.02]"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleUpload}
                  disabled={
                    (photos.length === 0 && videos.length === 0) || isUploading
                  }
                  className="bg-[#2997FF] hover:bg-[#147CE5] text-white min-w-[100px]"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <ManageMediaModal
              petId={petId}
              photos={actualPhotos ?? []}
              videos={actualVideos ?? []}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
