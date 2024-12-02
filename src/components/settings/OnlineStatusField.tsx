import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PreferencesForm } from "@/lib/validation/settings";
import { Control } from "react-hook-form";

interface OnlineStatusFieldProps {
  control: Control<PreferencesForm>;
}

export function OnlineStatusField({ control }: OnlineStatusFieldProps) {
  return (
    <FormField
      control={control}
      name="showOnlineStatus"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <FormLabel>Show Online Status</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}