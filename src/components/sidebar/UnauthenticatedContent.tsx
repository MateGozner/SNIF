// src/components/sidebar/UnauthenticatedContent.tsx
import { Navigation } from "./Navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UnauthenticatedContent() {
  return (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl">
      <div className="flex-1 p-4">
        <div className="mb-12 space-y-4">
          <Link href="/" className="block">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2997FF] to-[#147CE5] bg-clip-text text-transparent">
              SNIF
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with pet lovers around you
            </p>
          </Link>
          <div className="h-px bg-gradient-to-r from-border via-border/80 to-transparent" />
        </div>
        <Navigation pathname="" isAuthenticated={false} />
        <div className="space-y-3 px-1 mt-8">
          <Link href="/login" className="block">
            <Button
              className="w-full bg-[#2997FF] hover:bg-[#147CE5] text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              size="lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button
              variant="outline"
              className="w-full border-[#2997FF] text-[#2997FF] hover:bg-[#2997FF]/5 font-medium transition-all duration-200"
              size="lg"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Find the perfect match for your pet
        </p>
      </div>
    </div>
  );
}
