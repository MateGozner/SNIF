// src/components/pets/MediaUploadModal.tsx
import { useState } from "react";
import { FileWithPreview, MediaUploadCore } from "../shared/MediaUploadCore";
import { useAddPetMedia } from "@/hooks/pets/usePetMedia";
import { Loader2, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageMediaModal } from "./ManageMediaModal";
import { cn } from "@/lib/utils";

interface MediaUploadModalProps {
  petId: string;
  children?: React.ReactNode;
}

export function MediaUploadModal({ petId, children }: MediaUploadModalProps) {
  const [mode, setMode] = useState<"upload" | "manage">("upload");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const addMedia = useAddPetMedia(petId);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const uploadPromises = files.map(({ file, type }) =>
        addMedia.mutateAsync({
          file,
          type,
          title: file.name,
        })
      );

      await Promise.all(uploadPromises);
      setFiles([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFiles([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Media
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-900 p-0">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-medium">
              {mode === "upload" ? "Add Media" : "Manage Media"}
            </DialogTitle>
            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "upload" | "manage")}
              className="w-auto"
            >
              <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-9">
                <TabsTrigger
                  value="upload"
                  className={cn(
                    "px-3 text-sm",
                    "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
                    "data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100",
                    "data-[state=active]:shadow-sm"
                  )}
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="manage"
                  className={cn(
                    "px-3 text-sm",
                    "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
                    "data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100",
                    "data-[state=active]:shadow-sm"
                  )}
                >
                  Manage
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="px-6 pb-6">
          {mode === "upload" ? (
            <div className="space-y-6">
              <MediaUploadCore files={files} onFilesChange={setFiles} />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  className={cn(
                    "px-6 min-w-[100px]",
                    "bg-blue-500 hover:bg-blue-600 text-white",
                    "dark:bg-blue-600 dark:hover:bg-blue-700"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <ManageMediaModal petId={petId} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
