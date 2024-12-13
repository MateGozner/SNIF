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
import { X, Plus, Calendar } from "lucide-react";
import { healthInfoSchema, HealthInfoForm } from "@/lib/validation/pet-health";
import { COMMON_HEALTH_ISSUES } from "@/lib/constants/pet-health";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CreatePetDto } from "@/lib/types/pet";

interface HealthInfoProps {
  initialData: Partial<CreatePetDto>;
  onNext: (data: Partial<CreatePetDto>) => void;
  onBack: () => void;
}

export function HealthInfo({ initialData, onNext, onBack }: HealthInfoProps) {
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
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="medicalHistory.isVaccinated"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <FormLabel className="font-medium">Is Vaccinated</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalHistory.healthIssues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Issues</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Select
                    onValueChange={(value) => {
                      const currentIssues = field.value || [];
                      if (!currentIssues.includes(value)) {
                        field.onChange([...currentIssues, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_HEALTH_ISSUES.map((issue) => (
                        <SelectItem key={issue} value={issue}>
                          {issue}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((issue, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-red-50 text-red-500"
                      >
                        {issue}
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(
                              field.value?.filter((_, i) => i !== index)
                            );
                          }}
                          className="ml-2 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newCustomIssue}
                      onChange={(e) => setNewCustomIssue(e.target.value)}
                      placeholder="Add custom health issue"
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
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medicalHistory.lastCheckup"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Checkup</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
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

        <FormField
          control={form.control}
          name="medicalHistory.vetContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Veterinarian Contact</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter veterinarian contact info"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="bg-[#2997FF] hover:bg-[#147CE5]">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
