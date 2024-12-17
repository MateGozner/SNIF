// src/components/pets/create/BasicInfo.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Gender, PetPurpose } from "@/lib/types/pet";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import {
  BasicInfoForm,
  basicInfoSchema,
  getBreedsBySpecies,
} from "@/lib/validation/pets";
import { PET_SPECIES } from "@/lib/constants/pets";
import { cn } from "@/lib/utils";

interface BasicInfoProps {
  initialData: Partial<BasicInfoForm>;
  onNext: (data: BasicInfoForm) => void;
  className?: string;
}

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
    if (newTrait) {
      form.setValue("personality", [
        ...form.getValues("personality"),
        newTrait,
      ]);
      setNewTrait("");
    }
  };

  const removePersonalityTrait = (trait: string) => {
    const currentTraits = form.getValues("personality");
    form.setValue(
      "personality",
      currentTraits.filter((t) => t !== trait)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className={cn("space-y-6", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet&apos;s Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your pet's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Species</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PET_SPECIES.map((species) => (
                    <SelectItem key={species} value={species}>
                      {species}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
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
              <FormLabel>Gender</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Gender.Male.toString()}>Male</SelectItem>
                  <SelectItem value={Gender.Female.toString()}>
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <div className="space-y-2">
                {Object.entries(PetPurpose)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(value)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...(field.value || []), value]
                            : field.value?.filter((p) => p !== value);
                          field.onChange(newValue);
                        }}
                        className="form-checkbox h-4 w-4 text-[#2997FF]"
                      />
                      <span>{key}</span>
                    </label>
                  ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personality Traits</FormLabel>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((trait) => (
                    <Badge
                      key={trait}
                      variant="secondary"
                      className="bg-[#2997FF]/10 text-[#2997FF]"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => removePersonalityTrait(trait)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    placeholder="Add personality trait"
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
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#2997FF] hover:bg-[#147CE5]">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
