// src/components/ui/time-picker.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TimePickerInput({
  value,
  onChange,
  disabled,
}: TimePickerInputProps) {
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(h);
      setMinutes(m);
    }
  }, [value]);

  const handleTimeChange = (type: "hours" | "minutes", newValue: string) => {
    if (type === "hours") {
      setHours(newValue);
    } else {
      setMinutes(newValue);
    }

    const timeString = `${type === "hours" ? newValue : hours}:${
      type === "minutes" ? newValue : minutes
    }`;
    onChange?.(timeString);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center gap-2 p-4">
          <Select
            value={hours}
            onValueChange={(value) => handleTimeChange("hours", value)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, "0");
                return (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span className="text-lg">:</span>
          <Select
            value={minutes}
            onValueChange={(value) => handleTimeChange("minutes", value)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => {
                const minute = i.toString().padStart(2, "0");
                return (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
