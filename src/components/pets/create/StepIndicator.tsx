import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  steps: { title: string; description: string }[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="border-b border-white/10">
      <div className="p-6">
        {/* Progress Bars */}
        <div className="flex gap-2 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex-1 h-1 rounded-full overflow-hidden bg-white/5"
            >
              {index <= currentStep && (
                <motion.div
                  className="absolute inset-0 bg-blue-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Step Information */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-white font-medium">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-white/60">
              {steps[currentStep].description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentStep
                    ? "bg-blue-500"
                    : index < currentStep
                    ? "bg-blue-500/40"
                    : "bg-white/20"
                )}
                animate={{
                  scale: index === currentStep ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
