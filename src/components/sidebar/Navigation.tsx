// src/components/sidebar/Navigation.tsx

import { Home, PawPrint, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavItem } from "@/lib/types/sidebar";

export const navigationItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Pets", href: "/pets", icon: PawPrint },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface NavigationProps {
  pathname: string;
  isAuthenticated: boolean;
}

export function Navigation({ pathname, isAuthenticated }: NavigationProps) {
  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={isAuthenticated ? item.href : "/login"}
          className={cn(
            "flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            pathname === item.href
              ? "bg-[#2997FF]/10 text-[#2997FF]"
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5",
              pathname === item.href
                ? "text-[#2997FF]"
                : "text-muted-foreground"
            )}
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
