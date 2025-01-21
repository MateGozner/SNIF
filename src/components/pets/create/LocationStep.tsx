"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Navigation, AlertCircle } from "lucide-react";
import { CreatePetDto } from "@/lib/types/pet";
import { useGeolocation } from "@/hooks/location/useGeoLocation";
import { locationSchema, LocationForm } from "@/lib/validation/location";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Alert
        variant="destructive"
        className="bg-red-500/10 border-red-500/20 text-red-400"
      >
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Location Access Required</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>
            Please enable location access in your browser settings to continue.
          </p>
          <Button
            onClick={resetPermissionState}
            variant="outline"
            className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Navigation className="h-5 w-5 text-blue-400" />
                  </div>
                  <FormLabel className="text-base text-white">
                    Location
                  </FormLabel>
                </div>
                {field.value && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  >
                    Location Set
                  </Badge>
                )}
              </div>

              <FormControl>
                <div className="space-y-4">
                  <Card className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="relative">
                      <div className="h-[300px] w-full overflow-hidden rounded-lg">
                        {field.value && <Map location={field.value} />}
                      </div>

                      {/* Loading Overlay */}
                      {isLoadingLocation && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                            <span className="text-sm text-white/80">
                              Locating...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full gap-2",
                        "bg-white/5 border-white/10 text-white",
                        "hover:bg-white/10 hover:border-white/20",
                        isLoadingLocation && "pointer-events-none"
                      )}
                      onClick={fetchLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Getting location...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          Update Location
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white min-w-[100px]"
            disabled={isLoadingLocation}
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
