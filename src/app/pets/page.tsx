"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useUserPets } from "@/hooks/pets/usePets";
import { PlusCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PetCard } from "@/components/pets/PetCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PetsPage() {
  const { user } = useAuth();
  const { data: pets, isLoading, error } = useUserPets(user!.id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load pets. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8">My Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          className="aspect-square cursor-pointer group hover:shadow-lg transition-all duration-300 border-2 border-dashed border-muted flex items-center justify-center"
          onClick={() => router.push("/pets/new")}
        >
          <div className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-[#2997FF] transition-colors">
            <PlusCircle className="h-12 w-12" />
            <span className="text-lg font-medium">Add Pet</span>
          </div>
        </Card>
        {pets?.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
