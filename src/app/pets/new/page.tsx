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
import { Loader2 } from "lucide-react";

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
    const updatedData = { ...formData, ...data };
    await createPet.mutateAsync(updatedData);
    router.push("/pets");
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (createPet.isPending) {
    return (
      <div className="container max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
          <p className="text-muted-foreground">Creating your pet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Add a New Pet</h1>
        <p className="text-muted-foreground">
          {steps[currentStep].title} - {steps[currentStep].description}
        </p>
      </div>

      <Card className="overflow-hidden">
        <StepIndicator steps={steps} currentStep={currentStep} />
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
    </div>
  );
}
