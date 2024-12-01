import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export const LoadingState = () => (
  <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl">
    <div className="flex-1 space-y-1 p-4">
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  </div>
);

export const ErrorState = ({ retry }: { retry: () => void }) => (
  <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl p-4">
    <Alert variant="destructive" className="bg-destructive/10 border-none">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>Failed to load profile</AlertDescription>
    </Alert>
    <Button
      variant="ghost"
      onClick={retry}
      className="mt-4 text-[#2997FF] hover:bg-[#2997FF]/10"
    >
      <RefreshCcw className="mr-2 h-4 w-4" />
      Try again
    </Button>
  </div>
);
