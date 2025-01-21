import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, Phone, Shield, Activity } from "lucide-react";
import { format } from "date-fns";
import { healthInfoSchema, HealthInfoForm } from "@/lib/validation/pet-health";
import { COMMON_HEALTH_ISSUES } from "@/lib/constants/pet-health";
import { CreatePetDto } from "@/lib/types/pet";
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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface HealthInfoProps {
  initialData: Partial<CreatePetDto>;
  onNext: (data: Partial<CreatePetDto>) => void;
  onBack: () => void;
  className?: string;
}

export function HealthInfo({
  initialData,
  onNext,
  onBack,
  className,
}: HealthInfoProps) {
  const [newCustomIssue, setNewCustomIssue] = useState("");

  const form = useForm<HealthInfoForm>({
    resolver: zodResolver(healthInfoSchema),
    defaultValues: {
      medicalHistory: initialData.medicalHistory || {
        isVaccinated: false,
        healthIssues: [],
        vaccinationRecords: [],
      },
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onNext(data))}
        className={cn("space-y-8", className)}
      >
        {/* Vaccination Status */}
        <FormField
          control={form.control}
          name="medicalHistory.isVaccinated"
          render={({ field }) => (
            <FormItem>
              <Card
                className={cn(
                  "p-4 backdrop-blur-sm border-white/10",
                  "bg-white/5 hover:bg-white/[0.07] transition-colors",
                  field.value && "bg-emerald-500/10 hover:bg-emerald-500/[0.15]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        field.value ? "bg-emerald-500/20" : "bg-white/10"
                      )}
                    >
                      <Shield
                        className={cn(
                          "h-5 w-5",
                          field.value ? "text-emerald-400" : "text-white/60"
                        )}
                      />
                    </div>
                    <div>
                      <FormLabel className="text-base text-white">
                        Vaccination Status
                      </FormLabel>
                      <p
                        className={cn(
                          "text-sm",
                          field.value ? "text-emerald-400" : "text-white/60"
                        )}
                      >
                        {field.value ? "Vaccinated" : "Not vaccinated"}
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </FormControl>
                </div>
              </Card>
            </FormItem>
          )}
        />

        {/* Health Issues */}
        <FormField
          control={form.control}
          name="medicalHistory.healthIssues"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/20">
                  <Activity className="h-5 w-5 text-red-400" />
                </div>
                <FormLabel className="text-base text-white">
                  Health Issues
                </FormLabel>
              </div>

              <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="space-y-4">
                  <Select
                    onValueChange={(value) => {
                      const currentIssues = field.value || [];
                      if (!currentIssues.includes(value)) {
                        field.onChange([...currentIssues, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select health issue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMMON_HEALTH_ISSUES.map((issue) => (
                        <SelectItem key={issue} value={issue}>
                          {issue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <AnimatePresence>
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((issue, index) => (
                        <motion.div
                          key={issue}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1"
                          >
                            {issue}
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value?.filter((_, i) => i !== index)
                                );
                              }}
                              className="ml-2 hover:text-red-200 transition-colors"
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
                      value={newCustomIssue}
                      onChange={(e) => setNewCustomIssue(e.target.value)}
                      placeholder="Add custom health issue"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCustomIssue.trim()) {
                            field.onChange([
                              ...(field.value || []),
                              newCustomIssue.trim(),
                            ]);
                            setNewCustomIssue("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (newCustomIssue.trim()) {
                          field.onChange([
                            ...(field.value || []),
                            newCustomIssue.trim(),
                          ]);
                          setNewCustomIssue("");
                        }
                      }}
                      className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="bg-white/10" />

        {/* Last Checkup */}
        <FormField
          control={form.control}
          name="medicalHistory.lastCheckup"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <FormLabel className="text-base text-white">
                  Last Checkup
                </FormLabel>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        "bg-white/5 border-white/10 text-white",
                        "hover:bg-white/10 hover:border-white/20",
                        !field.value && "text-white/40"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vet Contact */}
        <FormField
          control={form.control}
          name="medicalHistory.vetContact"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <FormLabel className="text-base text-white">
                  Veterinarian Contact
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter veterinarian contact info"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6 flex justify-between">
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
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
