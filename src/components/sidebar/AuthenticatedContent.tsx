// src/components/sidebar/AuthenticatedContent.tsx

import { Navigation } from "./Navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProps } from "@/lib/types/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface AuthenticatedContentProps {
  user: UserProps;
  pathname: string;
  onLogout: () => void;
}

export function AuthenticatedContent({
  user,
  pathname,
  onLogout,
}: AuthenticatedContentProps) {
  return (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl">
      <div className="flex-1 space-y-1 p-4">
        <div className="mb-8 space-y-4">
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-[#2997FF] text-white">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Link>
          <div className="h-px bg-border" />
        </div>
        <Navigation pathname={pathname} isAuthenticated={true} />
      </div>
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-x-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
