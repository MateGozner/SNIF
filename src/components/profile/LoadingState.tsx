import { AlertCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

export function LoadingState() {
  return (
    <div className="container mx-auto p-6 animate-in fade-in-50">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="container mx-auto p-6">
      <Card className="overflow-hidden border-none bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to load profile</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {error.message || "Something went wrong"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#2997FF] hover:bg-[#147CE5] text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
