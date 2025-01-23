// src/components/Sidebar.tsx
"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

import { User } from "lucide-react";
import { AuthenticatedContent } from "./AuthenticatedContent";
import { UnauthenticatedContent } from "./UnauthenticatedContent";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { navigationItems } from "./Navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, removeAuth: logout, isAuthenticated } = useAuthStore();

  const content =
    isAuthenticated && user ? (
      <AuthenticatedContent user={user} pathname={pathname} onLogout={logout} />
    ) : (
      <UnauthenticatedContent />
    );

  const mobileNavItems = isAuthenticated
    ? [{ name: "Profile", href: "/profile", icon: User }, ...navigationItems]
    : navigationItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {content}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <nav className="flex justify-around p-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              href={isAuthenticated ? item.href : "/login"}
              className={cn(
                "flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                pathname === item.href
                  ? "text-[#2997FF]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  pathname === item.href
                    ? "text-[#2997FF]"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Profile Sheet for Mobile */}
      <Sheet>
        <SheetContent side="left" className="w-64 p-0">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
}
