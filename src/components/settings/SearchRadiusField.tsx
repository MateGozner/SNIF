import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { PreferencesForm } from "@/lib/validation/settings";

interface SearchRadiusFieldProps {
  control: Control<PreferencesForm>;
}

export function SearchRadiusField({ control }: SearchRadiusFieldProps) {
  return (
    <FormField
      control={control}
      name="searchRadius"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white/80 font-medium">
            Search Radius
          </FormLabel>
          <FormControl>
            <div className="pt-2">
              <Slider
                min={1}
                max={500}
                step={1}
                value={[field.value]}
                onValueChange={([value]) => field.onChange(value)}
                className="[&_[role=slider]]:bg-[#38bdf8] [&_[role=slider]]:border-none [&_[role=slider]]:shadow-lg"
              />
            </div>
          </FormControl>
          <FormDescription className="text-white/40 text-sm mt-2">
            Current radius: {field.value}km
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
