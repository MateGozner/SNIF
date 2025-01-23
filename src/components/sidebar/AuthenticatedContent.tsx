// src/components/sidebar/AuthenticatedContent.tsx

import { Navigation } from "./Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/profile/useProfile";
import { UserProps } from "@/lib/types/sidebar";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { ErrorState, LoadingState } from "./Loading";

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
  const { data: profile, isLoading, error, refetch } = useProfile(user.id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState retry={() => refetch()} />;

  if (!profile) return null;

  return (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur-xl">
      <div className="flex-1 space-y-1 p-4">
        <div className="mb-8 space-y-4">
          <Link
            href={`/profile`}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={profile.profilePicturePath} />
              <AvatarFallback className="bg-[#2997FF] text-white">
                {profile.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {profile.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile.email}
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
