import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
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
        <FormItem className="flex items-center justify-between space-x-4">
          <div>
            <FormLabel className="text-white/80 font-medium">
              Show Online Status
            </FormLabel>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-[#38bdf8]"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
