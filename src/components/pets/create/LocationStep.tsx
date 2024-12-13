// src/components/pets/create/LocationStep.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGeolocation } from "@/hooks/location/useGeoLocation";
import { CreatePetDto } from "@/lib/types/pet";
import { useState, useEffect } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { locationSchema, LocationForm } from "@/lib/validation/location";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/DynamicMap"), {
  ssr: false,
});

interface LocationStepProps {
  initialData: Partial<CreatePetDto>;
  onSubmit: (data: Partial<CreatePetDto>) => Promise<void>;
  onBack: () => void;
}

export function LocationStep({
  initialData,
  onSubmit,
  onBack,
}: LocationStepProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { getLocation, permissionDenied, resetPermissionState } =
    useGeolocation();

  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: initialData.location || {
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const fetchLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await getLocation();
      if (location) {
        form.setValue("location", location);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (!initialData.location) {
      fetchLocation();
    }
  }, []);

  if (permissionDenied) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Access Required</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            Please enable location access in your browser settings to continue.
          </p>
          <Button
            onClick={resetPermissionState}
            variant="outline"
            className="w-full bg-white/50 backdrop-blur-sm"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="h-[300px] relative rounded-lg overflow-hidden border">
                    {field.value && <Map location={field.value} />}
                    {isLoadingLocation && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#2997FF]" />
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={fetchLocation}
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Update Location
                      </>
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            className="bg-[#2997FF] hover:bg-[#147CE5]"
            disabled={isLoadingLocation}
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
