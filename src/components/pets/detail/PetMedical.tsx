import { MedicalHistoryDto } from "@/lib/types/pet";
import { format } from "date-fns";
import {
  Shield,
  Activity,
  Calendar,
  Phone,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PetMedicalProps {
  medicalHistory?: MedicalHistoryDto;
  className?: string;
}

export function PetMedical({ medicalHistory, className }: PetMedicalProps) {
  if (!medicalHistory) return null;

  const statusItems = [
    {
      icon: Shield,
      label: "Vaccination Status",
      value: medicalHistory.isVaccinated ? "Up to date" : "Needs attention",
      status: medicalHistory.isVaccinated ? "success" : "warning",
    },
    {
      icon: Calendar,
      label: "Last Check-up",
      value: medicalHistory.lastCheckup
        ? format(new Date(medicalHistory.lastCheckup), "MMM d, yyyy")
        : "No record",
      status: "default",
    },
    {
      icon: Phone,
      label: "Veterinary Contact",
      value: medicalHistory.vetContact || "Not provided",
      status: "default",
    },
  ];

  return (
    <Card
      className={cn(
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0",
        "shadow-lg",
        className
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Health & Medical</CardTitle>
      </CardHeader>

      <ScrollArea className="h-[calc(100vh-20rem)]">
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="space-y-4">
            {statusItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      item.status === "success" &&
                        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                      item.status === "warning" &&
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                      item.status === "default" &&
                        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {medicalHistory.healthIssues.length > 0 && (
            <>
              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Active Health Concerns
                </h3>
                <div className="space-y-2">
                  {medicalHistory.healthIssues.map((issue, i) => (
                    <motion.div
                      key={issue}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {issue}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          Active
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Last Updated */}
          <div className="flex items-center gap-2 py-2">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Records updated {format(new Date(), "MMMM d, yyyy")}
            </p>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
