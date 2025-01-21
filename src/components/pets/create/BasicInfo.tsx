import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, PetPurpose } from "@/lib/types/pet";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cat,
  Dog,
  X,
  Plus,
  Heart,
  PawPrint,
  Users,
  Bird,
  Rabbit,
  Mouse,
  PawPrintIcon,
} from "lucide-react";
import {
  BasicInfoForm,
  basicInfoSchema,
  getBreedsBySpecies,
} from "@/lib/validation/pets";
import { PET_SPECIES } from "@/lib/constants/pets";
import { cn } from "@/lib/utils";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface BasicInfoProps {
  initialData: Partial<BasicInfoForm>;
  onNext: (data: BasicInfoForm) => void;
  className?: string;
}

const purposeIcons = {
  [PetPurpose.Breeding]: Heart,
  [PetPurpose.Friendship]: Users,
  [PetPurpose.Playdate]: PawPrint,
};

export function BasicInfo({ initialData, onNext, className }: BasicInfoProps) {
  const form = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      ...initialData,
      purpose: initialData.purpose || [],
      personality: initialData.personality || [],
    },
  });

  const selectedSpecies = form.watch("species");
  const breeds = getBreedsBySpecies(selectedSpecies);
  const [newTrait, setNewTrait] = useState("");

  const addPersonalityTrait = () => {
    if (newTrait.trim()) {
      const currentTraits = form.getValues("personality") || [];
      if (!currentTraits.includes(newTrait.trim())) {
        form.setValue("personality", [...currentTraits, newTrait.trim()]);
      }
      setNewTrait("");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className={cn("space-y-8", className)}
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="What's your pet's name?"
                  {...field}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Species Selection */}
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white">Species</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {PET_SPECIES.map((species) => {
                  const isSelected = field.value === species;
                  const getSpeciesIcon = (species: string) => {
                    switch (species) {
                      case "Dog":
                        return Dog;
                      case "Cat":
                        return Cat;
                      case "Bird":
                        return Bird;
                      case "Rabbit":
                        return Rabbit;
                      case "Hamster":
                        return Mouse;
                      default:
                        return PawPrint;
                    }
                  };
                  const Icon = getSpeciesIcon(species);

                  return (
                    <Card
                      key={species}
                      onClick={() => field.onChange(species)}
                      className={cn(
                        "relative overflow-hidden cursor-pointer p-4",
                        "bg-white/5 border-white/10 backdrop-blur-sm",
                        "transition-all duration-300",
                        isSelected && "bg-blue-500/20 border-blue-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            "bg-white/5 backdrop-blur-sm",
                            isSelected && "bg-blue-500/20"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              isSelected ? "text-blue-400" : "text-white/60"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-lg font-medium",
                            isSelected ? "text-blue-400" : "text-white/60"
                          )}
                        >
                          {species}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Breed Selection */}
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white">Breed</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {breeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age & Gender Group */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-white">
                  Age (years)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-white">Gender</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: Gender.Male,
                      label: "Male",
                      icon: PawPrintIcon,
                      color: "blue",
                    },
                    {
                      value: Gender.Female,
                      label: "Female",
                      icon: PawPrintIcon,
                      color: "pink",
                    },
                  ].map(({ value, label, icon: Icon, color }) => {
                    const isSelected = field.value === value;
                    return (
                      <Card
                        key={value}
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "cursor-pointer relative overflow-hidden",
                          "border-white/10 backdrop-blur-sm transition-all duration-300",
                          isSelected &&
                            color === "blue" &&
                            "bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-500/5 border-blue-500/30",
                          isSelected &&
                            color === "pink" &&
                            "bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-pink-500/5 border-pink-500/30",
                          !isSelected && "bg-white/5 hover:bg-white/[0.07]"
                        )}
                      >
                        <div className="p-4 flex items-center justify-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-xl",
                              isSelected &&
                                color === "blue" &&
                                "bg-blue-500/20",
                              isSelected &&
                                color === "pink" &&
                                "bg-pink-500/20",
                              !isSelected && "bg-white/5"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isSelected &&
                                  color === "blue" &&
                                  "text-blue-400",
                                isSelected &&
                                  color === "pink" &&
                                  "text-pink-400",
                                !isSelected && "text-white/60"
                              )}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-base font-medium",
                              isSelected && color === "blue" && "text-blue-400",
                              isSelected && color === "pink" && "text-pink-400",
                              !isSelected && "text-white/60"
                            )}
                          >
                            {label}
                          </span>
                        </div>
                        {isSelected && (
                          <motion.div
                            layoutId="selectedGender"
                            className={cn(
                              "absolute inset-0 border-2 rounded-lg",
                              color === "blue" && "border-blue-500/30",
                              color === "pink" && "border-pink-500/30"
                            )}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                      </Card>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="bg-white/10" />

        {/* Purpose Selection */}
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white">Purpose</FormLabel>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(PetPurpose)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => {
                    const isSelected = field.value?.includes(value);
                    const Icon =
                      purposeIcons[value as keyof typeof purposeIcons];

                    return (
                      <Card
                        key={key}
                        onClick={() => {
                          const newValue = isSelected
                            ? field.value?.filter((p) => p !== value)
                            : [...(field.value || []), value];
                          field.onChange(newValue);
                        }}
                        className={cn(
                          "cursor-pointer p-3",
                          "bg-white/5 border-white/10",
                          "transition-all duration-300",
                          isSelected && "bg-purple-500/20 border-purple-500/30"
                        )}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div
                            className={cn(
                              "p-2 rounded-full",
                              "bg-white/5",
                              isSelected && "bg-purple-500/20"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4",
                                isSelected ? "text-purple-400" : "text-white/60"
                              )}
                            />
                          </div>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isSelected ? "text-purple-400" : "text-white/60"
                            )}
                          >
                            {key}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="bg-white/10" />

        {/* Personality Traits */}
        <FormField
          control={form.control}
          name="personality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base text-white">
                Personality Traits
              </FormLabel>
              <div className="space-y-4">
                <AnimatePresence>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((trait) => (
                      <motion.div
                        key={trait}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1"
                        >
                          {trait}
                          <button
                            type="button"
                            onClick={() => {
                              const newValue = field.value?.filter(
                                (t) => t !== trait
                              );
                              field.onChange(newValue);
                            }}
                            className="ml-2 hover:text-red-400 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
                <div className="flex gap-2">
                  <Input
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    placeholder="Add a personality trait"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPersonalityTrait();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addPersonalityTrait}
                    className="border-white/10 text-black/60 hover:text-white hover:bg-white/5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white min-w-[120px]"
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
