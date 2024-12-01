// src/components/Sidebar.tsx
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Menu } from "lucide-react";
import { AuthenticatedContent } from "./AuthenticatedContent";
import { UnauthenticatedContent } from "./UnauthenticatedContent";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const content =
    isAuthenticated && user ? (
      <AuthenticatedContent user={user} pathname={pathname} onLogout={logout} />
    ) : (
      <UnauthenticatedContent />
    );

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          {content}
        </SheetContent>
      </Sheet>

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {content}
        </div>
      </div>
    </>
  );
}
