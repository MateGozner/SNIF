"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useUserPets } from "@/hooks/pets/usePets";
import { PlusCircle, Loader2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PetCard } from "@/components/pets/PetCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PetsPage() {
  const { user } = useAuth();
  const { data: pets, isLoading, error } = useUserPets(user!.id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-black/[0.98] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-black/[0.98] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <Alert
          variant="destructive"
          className="max-w-md bg-red-500/10 border-red-500/20 text-red-400"
        >
          <AlertTitle>Error Loading Pets</AlertTitle>
          <AlertDescription>
            We couldn&apos;t load your pets. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/[0.1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
              <h1 className="text-2xl font-medium text-white">My Pets</h1>
              <Button
                onClick={() => router.push("/pets/new")}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Pet
              </Button>
            </div>
          </div>
        </header>

        {/* Grid Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Add Pet Card */}
            <motion.div variants={item}>
              <Card
                onClick={() => router.push("/pets/new")}
                className="group relative aspect-[4/3] overflow-hidden bg-white/5 hover:bg-white/10 
                          backdrop-blur-xl border-white/10 cursor-pointer transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div
                  className="relative h-full flex flex-col items-center justify-center gap-4 text-white/60 
                               group-hover:text-white transition-colors"
                >
                  <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                    <PlusCircle className="h-8 w-8" />
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <span>Add New Pet</span>
                    <ChevronRight
                      className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 
                                           group-hover:translate-x-0 transition-all"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Pet Cards */}
            {pets?.map((pet) => (
              <motion.div key={pet.id} variants={item}>
                <PetCard pet={pet} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
