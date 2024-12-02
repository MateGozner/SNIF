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
          <FormLabel>Search Radius (km)</FormLabel>
          <FormControl>
            <Slider
              min={1}
              max={500}
              step={1}
              value={[field.value]}
              onValueChange={([value]) => field.onChange(value)}
            />
          </FormControl>
          <FormDescription>Current radius: {field.value}km</FormDescription>
        </FormItem>
      )}
    />
  );
}
