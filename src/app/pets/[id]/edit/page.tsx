// src/app/pets/[id]/edit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { usePet, useUpdatePet } from "@/hooks/pets/usePets";
import { motion } from "framer-motion";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { UpdatePetDto } from "@/lib/types/pet";
import { BasicInfo } from "@/components/pets/create/BasicInfo";
import { HealthInfo } from "@/components/pets/create/HealthInfo";
import { LocationStep } from "@/components/pets/create/LocationStep";
import { set } from "date-fns";

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "health", label: "Health" },
  { id: "location", label: "Location" },
  { id: "media", label: "Photos & Videos" },
];

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const { data: pet, isLoading } = usePet(params.id as string);
  const updatePet = useUpdatePet(params.id as string);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<UpdatePetDto>({});

  if (isLoading || !pet) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
          <p className="text-muted-foreground">Loading pet...</p>
        </div>
      </div>
    );
  }

  const handleTabChange = (data: Partial<UpdatePetDto>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleSubmit = async () => {
    try {
      setFormData((prev) => ({
        ...prev,
        ...formData,
      }));
      await updatePet.mutateAsync(formData);
      router.push(`/pets/${params.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
              <h1 className="text-4xl font-medium text-white mb-2">
                Edit {pet.name}
              </h1>
              <p className="text-white/60">
                Update your pet&apos;s information and preferences
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-2 mb-8">
                <TabsList className="w-full bg-transparent grid grid-cols-3 gap-2">
                  {tabs.slice(0, 3).map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8">
                <TabsContent value="basic">
                  <BasicInfo
                    initialData={pet}
                    onNext={(data) => {
                      handleTabChange(data);
                      setActiveTab("health");
                    }}
                    className="space-y-6 text-white"
                  />
                </TabsContent>

                <TabsContent value="health">
                  <HealthInfo
                    initialData={{
                      ...pet,
                      ...formData,
                    }}
                    onNext={(data) => {
                      handleTabChange(data);
                      setActiveTab("location");
                    }}
                    onBack={() => setActiveTab("basic")}
                    classname="space-y-6 text-white"
                  />
                </TabsContent>

                <TabsContent value="location">
                  <LocationStep
                    initialData={{
                      ...pet,
                      ...formData,
                    }}
                    onSubmit={async (data) => {
                      handleTabChange(data);
                      await handleSubmit();
                    }}
                    onBack={() => setActiveTab("health")}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
