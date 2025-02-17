// src/components/pets/detail/ManageMediaModal.tsx
import { useState } from "react";
import Image from "next/image";
import { useDeletePetMedia, usePetMedia } from "@/hooks/pets/usePetMedia";
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
import { MediaType } from "@/lib/types/pet";

interface ManageMediaModalProps {
  petId: string;
}

export function ManageMediaModal({ petId }: ManageMediaModalProps) {
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.Photo);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const { data: media } = usePetMedia(petId, mediaType);
  const deletePetMedia = useDeletePetMedia(petId);

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      await deletePetMedia.mutateAsync(selectedMedia);
    } finally {
      setSelectedMedia(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={mediaType === MediaType.Photo ? "photos" : "videos"}
        onValueChange={(v) => {
          if (v === "photos" || v === "videos") {
            setMediaType(v === "photos" ? MediaType.Photo : MediaType.Video);
          }
        }}
      >
        <TabsList className="bg-white/[0.02] border border-white/10">
          <TabsTrigger
            value="photos"
            className="data-[state=active]:bg-white/10"
          >
            <Img className="h-4 w-4 mr-2" />
            Photos (
            {media?.filter((m) => m.type === MediaType.Photo).length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="data-[state=active]:bg-white/10"
          >
            <Film className="h-4 w-4 mr-2" />
            Videos (
            {media?.filter((m) => m.type === MediaType.Video).length || 0})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-3 gap-4">
        {media?.map((item) => (
          <div
            key={item.id}
            className="relative group aspect-square rounded-xl overflow-hidden"
          >
            {item.type === MediaType.Photo ? (
              <Image
                width={300}
                height={300}
                src={item.url}
                alt={item.title || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <video src={item.url} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                onClick={() => setSelectedMedia(item.id)}
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
              Delete Media?
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
