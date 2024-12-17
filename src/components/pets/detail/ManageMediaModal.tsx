// src/components/pets/detail/ManageMediaModal.tsx
import { useState } from "react";
import Image from "next/image";
import { useDeletePetMedia } from "@/hooks/pets/usePetMedia";
import { Trash2, Image as Img, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getImageUrl } from "@/lib/utils/urlTransformer";

interface ManageMediaModalProps {
  petId: string;
  photos: string[];
  videos: string[];
}

export function ManageMediaModal({
  petId,
  photos,
  videos,
}: ManageMediaModalProps) {
  const [mediaType, setMediaType] = useState<"photos" | "videos">("photos");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const { deletePhoto, deleteVideo } = useDeletePetMedia(petId);

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      if (mediaType === "photos") {
        await deletePhoto.mutateAsync(selectedMedia);
      } else {
        await deleteVideo.mutateAsync(selectedMedia);
      }
    } finally {
      setSelectedMedia(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={mediaType}
        onValueChange={(v) => setMediaType(v as "photos" | "videos")}
      >
        <TabsList className="bg-white/[0.02] border border-white/10">
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-white/10"
          >
            <Img className="h-4 w-4 mr-2" />
            Photos ({photos.length})
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-white/10"
          >
            <Film className="h-4 w-4 mr-2" />
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-3 gap-4">
        {(mediaType === "photos" ? photos : videos).map((media) => (
          <div
            key={media}
            className="relative group aspect-square rounded-xl overflow-hidden"
          >
            {mediaType === "photos" ? (
              <Image
                width={300}
                height={300}
                src={getImageUrl(media) as string}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={getImageUrl(media)}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                onClick={() => setSelectedMedia(media)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete {mediaType === "photos" ? "Photo" : "Video"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white/60">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
