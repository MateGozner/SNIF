// src/app/pets/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { usePet, useDeletePet } from "@/hooks/pets/usePets";
import { useState } from "react";
import { PetGallery } from "@/components/pets/detail/PetGallery";
import { PetInfo } from "@/components/pets/detail/PetInfo";
import { PetMedical } from "@/components/pets/detail/PetMedical";
import { DeletePetDialog } from "@/components/pets/detail/DeletePetDialog";
import { motion } from "framer-motion";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { PetActionButtons } from "@/components/pets/detail/PetActionButtons";
import { Gender } from "@/lib/types/pet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

  const handleEdit = () => {
    router.push(`/pets/${pet.id}/edit`);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black/95 to-black/98">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 backdrop-blur-3xl" />

      {/* Main Content */}
      <ScrollArea className="relative h-screen">
        <motion.div
          className="relative z-10 min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="relative w-full overflow-hidden">
            <div className="w-full max-w-[2000px] mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                <PetGallery
                  photos={pet.photos}
                  name={pet.name}
                  videos={pet.videos}
                  petId={pet.id}
                />
              </motion.div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="relative z-20 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-8 py-8">
                {/* Pet Name and Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="rounded-3xl overflow-hidden"
                >
                  <TextRevealCard
                    text={pet.name}
                    revealText={`${pet.breed} • ${pet.age} years • ${
                      Gender[pet.gender]
                    }`}
                    className={cn(
                      "w-full backdrop-blur-xl",
                      "bg-white/[0.08] hover:bg-white/[0.12]",
                      "border border-white/10",
                      "transition-colors duration-300"
                    )}
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <PetActionButtons
                    onEdit={handleEdit}
                    onDelete={() => setShowDeleteDialog(true)}
                    onMessage={() => {}}
                    onShare={() => {}}
                  />
                </motion.div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column - Pet Info */}
                  <motion.div
                    className="xl:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <PetInfo
                      personality={pet.personality}
                      purpose={pet.purpose}
                      location={pet.location}
                    />
                  </motion.div>

                  {/* Right Column - Medical Info */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="sticky top-8">
                      <PetMedical
                        medicalHistory={pet.medicalHistory}
                        className="h-full"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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