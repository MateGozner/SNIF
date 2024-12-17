// src/components/pets/detail/PetMedical.tsx
import { MedicalHistoryDto } from "@/lib/types/pet";
import {
  Phone,
  Syringe,
  Calendar,
  AlertCircle,
  Shield,
  Check,
  Info,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PetMedicalProps {
  medicalHistory?: MedicalHistoryDto;
  className?: string;
}

export function PetMedical({ medicalHistory, className }: PetMedicalProps) {
  if (!medicalHistory) return null;

  const medicalInfo = [
    {
      icon: Syringe,
      label: "Vaccination Status",
      value: medicalHistory.isVaccinated ? "Up to date" : "Needs attention",
      color: medicalHistory.isVaccinated ? "text-green-500" : "text-amber-500",
      bgColor: medicalHistory.isVaccinated
        ? "bg-green-500/10"
        : "bg-amber-500/10",
      iconBg: medicalHistory.isVaccinated
        ? "bg-green-500/20"
        : "bg-amber-500/20",
      delay: 0.1,
      description: medicalHistory.isVaccinated
        ? "All vaccinations are current"
        : "Some vaccinations may need updating",
    },
    {
      icon: Calendar,
      label: "Last Check-up",
      value: medicalHistory.lastCheckup
        ? format(new Date(medicalHistory.lastCheckup), "PPP")
        : "No record",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      iconBg: "bg-blue-500/20",
      delay: 0.2,
      description: "Regular check-ups help maintain your pet's health",
    },
    {
      icon: Phone,
      label: "Veterinary Contact",
      value: medicalHistory.vetContact || "Not provided",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      iconBg: "bg-violet-500/20",
      delay: 0.3,
      description: "Primary veterinary care contact information",
    },
  ];

  return (
    <Card
      className={cn(
        "w-full", // Full width
        "h-full", // Full height
        "flex flex-col", // Flex column layout
        "bg-gradient-to-b from-black/40 to-black/20",
        "border border-white/10",
        "backdrop-blur-xl",
        "overflow-hidden",
        "rounded-3xl", // Match other components' border radius
        className
      )}
    >
      <CardHeader className="border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white">
            Health & Medical
          </h2>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-full pr-4">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {medicalInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: info.delay,
                  duration: 0.3,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-auto p-4",
                        "flex items-start gap-4",
                        info.bgColor,
                        "hover:bg-white/5",
                        "border border-white/10",
                        "rounded-xl",
                        "cursor-default"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0",
                          "w-10 h-10 rounded-full",
                          info.iconBg,
                          "flex items-center justify-center"
                        )}
                      >
                        <info.icon className={cn("h-5 w-5", info.color)} />
                      </div>
                      <div className="flex flex-col items-start gap-1 flex-1">
                        <span className="text-sm text-white/60">
                          {info.label}
                        </span>
                        <span
                          className={cn("text-base font-medium", info.color)}
                        >
                          {info.value}
                        </span>
                      </div>
                      <Info className="h-4 w-4 text-white/40 hover:text-white/60" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-black/90 border border-white/10 text-white">
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{info.label}</h4>
                        <p className="text-sm text-white/70">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ))}
          </div>

          {/* Health Issues Section */}
          {medicalHistory.healthIssues.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="text-xl font-medium text-white">
                    Health Concerns
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medicalHistory.healthIssues.map((issue, index) => (
                    <motion.div
                      key={issue}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="bg-red-500/20 text-red-400 border-red-500/30"
                            >
                              Active
                            </Badge>
                            <span className="text-white/90">{issue}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/40" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Additional Health Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Separator className="bg-white/10 mb-6" />

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-white/60">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-sm">
                    Medical records last updated: {format(new Date(), "PPP")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
