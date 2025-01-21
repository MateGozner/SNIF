"use client";

import { useParams, useRouter } from "next/navigation";
import { usePet, useDeletePet } from "@/hooks/pets/usePets";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gender } from "@/lib/types/pet";
import { Pencil, Heart, ArrowLeft, Trash2, Cake, Medal } from "lucide-react";

// Components
import { PetGallery } from "@/components/pets/detail/PetGallery";
import { PetInfo } from "@/components/pets/detail/PetInfo";
import { PetMedical } from "@/components/pets/detail/PetMedical";
import { DeletePetDialog } from "@/components/pets/detail/DeletePetDialog";

// UI Components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: pet, isLoading } = usePet(params.id as string);
  const deletePet = useDeletePet();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading || !pet) return null;

  const handleDelete = async () => {
    await deletePet.mutateAsync(pet.id);
    router.push("/pets");
  };

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/[0.1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/pets")}
                className="text-white/70 hover:text-white hover:bg-white/[0.1]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium text-white">{pet.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => router.push(`/pets/${pet.id}/edit`)}
                className="gap-2 text-white/70 hover:text-white hover:bg-white/[0.1]"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/[0.1]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Pet Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PetGallery
              photos={pet.photos}
              name={pet.name}
              videos={pet.videos}
              petId={pet.id}
            />
          </motion.div>

          {/* Quick Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.1] p-6"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              {/* Pet Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-medium text-white">
                      {pet.name}
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            className="bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                          >
                            {Gender[pet.gender]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Gender</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <Medal className="h-4 w-4" />
                      <span>{pet.breed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Cake className="h-4 w-4" />
                      <span>{pet.age} years old</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  className="flex-1 sm:flex-initial gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => router.push(`/pets/${pet.id}/matches`)}
                >
                  <Heart className="h-4 w-4" />
                  Find Matches
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Pet Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <PetInfo
                personality={pet.personality}
                purpose={pet.purpose}
                location={pet.location}
              />
            </motion.div>

            {/* Right Column - Medical Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="sticky top-24">
                <PetMedical
                  medicalHistory={pet.medicalHistory}
                  className="h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <DeletePetDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        petName={pet.name}
      />
    </div>
  );
}
