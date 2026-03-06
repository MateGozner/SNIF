"use client";

import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  message,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground max-w-md">
          {message ||
            "An unexpected error occurred. Please try again or contact support if the problem persists."}
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <pre className="mt-4 max-w-lg overflow-auto rounded-md bg-muted p-4 text-left text-sm text-muted-foreground">
            {error.message}
          </pre>
        )}
      </div>
      <Button onClick={reset} variant="default">
        Try again
      </Button>
    </div>
  );
}
