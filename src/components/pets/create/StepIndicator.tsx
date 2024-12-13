interface StepIndicatorProps {
  steps: { title: string; description: string }[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="border-b">
      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-[#2997FF]" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{steps[currentStep].title}</span>
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
