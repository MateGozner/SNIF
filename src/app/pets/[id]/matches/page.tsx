// src/app/pets/[id]/matches/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { usePet } from "@/hooks/pets/usePets";
import {
  usePetMatches,
  usePendingMatches,
  usePotentialMatches,
  useCreateMatch,
} from "@/hooks/matches/useMatches";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { PetPurpose } from "@/lib/types/pet";
import { PotentialMatchCard } from "@/components/matches/PotentialMatchCard";
import { ExistingMatchCard } from "@/components/matches/ExistingMatchCard";
import { CardStack } from "@/components/ui/card-stack";
import EmptyState from "@/components/matches/EmptyState";

export default function PetMatchesPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"potential" | "pending" | "all">(
    "potential"
  );
  const [selectedPurpose, setSelectedPurpose] = useState<PetPurpose>(
    PetPurpose.Breeding
  );

  const { data: pet, isLoading: isPetLoading } = usePet(params.id as string);
  const { data: potentialMatches, isLoading: isPotentialLoading } =
    usePotentialMatches(params.id as string, selectedPurpose);
  const { data: pendingMatches, isLoading: isPendingLoading } =
    usePendingMatches(params.id as string);
  const { data: allMatches, isLoading: isAllMatchesLoading } = usePetMatches(
    params.id as string
  );
  const createMatch = useCreateMatch();

  if (isPetLoading || !pet) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
      </div>
    );
  }

  const handleSwipe = (direction: "left" | "right", petIndex: number) => {
    if (direction === "right" && potentialMatches?.[petIndex]) {
      createMatch.mutate({
        initiatorPetId: pet.id,
        targetPetId: potentialMatches[petIndex].id,
        matchPurpose: selectedPurpose,
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black/[0.96] antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {" "}
          {/* Reduced max-width */}
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
          {/* Title Section */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 text-center">
            <h1 className="text-4xl font-medium text-white mb-2">
              Find Matches for {pet.name}
            </h1>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="w-full bg-white/[0.02] border border-white/10 rounded-full p-1">
              {["potential", "pending", "all"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-white/10 rounded-full"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-8">
              <TabsContent value="potential" className="mt-0">
                {activeTab === "potential" && (
                  <>
                    <div className="mb-6 flex justify-center">
                      <Select
                        value={selectedPurpose.toString()}
                        onValueChange={(v) => setSelectedPurpose(Number(v))}
                      >
                        <SelectTrigger className="w-[200px] bg-white/[0.02] border-white/10">
                          <SelectValue placeholder="Match Purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PetPurpose)
                            .filter(([key]) => isNaN(Number(key)))
                            .map(([key, value]) => (
                              <SelectItem key={value} value={value.toString()}>
                                {key}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {isPotentialLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
                      </div>
                    ) : potentialMatches?.length ? (
                      <CardStack
                        cards={potentialMatches.map((pet) => (
                          <PotentialMatchCard
                            key={pet.id}
                            pet={pet}
                            currentPetId={params.id as string}
                            purpose={selectedPurpose}
                          />
                        ))}
                        onSwipe={handleSwipe}
                      />
                    ) : (
                      <EmptyState />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="pending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isPendingLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
                  ) : (
                    pendingMatches?.map((match) => (
                      <ExistingMatchCard
                        key={match.id}
                        match={match}
                        currentPetId={pet.id}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isAllMatchesLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
                  ) : (
                    allMatches?.map((match) => (
                      <ExistingMatchCard
                        key={match.id}
                        match={match}
                        currentPetId={pet.id}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
