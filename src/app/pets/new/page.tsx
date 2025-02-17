"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BasicInfo } from "@/components/pets/create/BasicInfo";
import { HealthInfo } from "@/components/pets/create/HealthInfo";
import { MediaUpload } from "@/components/pets/create/MediaUpload";
import { LocationStep } from "@/components/pets/create/LocationStep";
import { StepIndicator } from "@/components/pets/create/StepIndicator";
import { CreatePetDto } from "@/lib/types/pet";
import { useCreatePet } from "@/hooks/pets/usePets";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { title: "Basic Info", description: "Name, breed, and characteristics" },
  { title: "Health", description: "Medical history and vaccinations" },
  { title: "Location", description: "Where your pet lives" },
  { title: "Photos & Videos", description: "Add media of your pet" },
];

export default function NewPetPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreatePetDto>>({});
  const createPet = useCreatePet();
  const router = useRouter();

  const handleNext = async (data: Partial<CreatePetDto>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleFinish = async (data: Partial<CreatePetDto>) => {
    const updatedData = {
      ...formData,
      ...data,
    };

    await createPet.mutateAsync(updatedData as CreatePetDto);
    router.push("/pets");
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (createPet.isPending) {
    return (
      <div className="relative min-h-screen bg-black/[0.98] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />
        <div className="relative flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-white/60">Creating your pet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black/[0.98]">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,197,253,0.15),rgba(255,255,255,0))]" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/[0.1]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="py-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/pets")}
                className="text-white/70 hover:text-white hover:bg-white/[0.1]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-white/60">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-medium text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-white/60">{steps[currentStep].description}</p>
          </motion.div>

          {/* Step Indicator */}
          <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </Card>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                  {currentStep === 0 && (
                    <BasicInfo initialData={formData} onNext={handleNext} />
                  )}
                  {currentStep === 1 && (
                    <HealthInfo
                      initialData={formData}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 2 && (
                    <LocationStep
                      initialData={formData}
                      onSubmit={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 3 && (
                    <MediaUpload
                      initialData={formData}
                      onNext={handleFinish}
                      onBack={handleBack}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
