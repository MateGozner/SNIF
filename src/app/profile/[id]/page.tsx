"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/profile/useProfile";
import { LocationMap } from "@/components/map/LocationMap";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { data: profile, isLoading, error } = useProfile(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-12 w-[250px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">
              Failed to load profile {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-[#2997FF] text-white text-xl">
                {profile.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl mb-2">{profile.name}</CardTitle>
              <div className="flex gap-2">
                {profile.breederVerification?.isVerified && (
                  <Badge variant="secondary">Verified Breeder</Badge>
                )}
                <Badge variant="outline">
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {profile.location && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>
                      {profile.location.city && profile.location.country
                        ? `${profile.location.city}, ${profile.location.country}`
                        : profile.location.address || "Location available"}
                    </span>
                  </div>
                  <LocationMap location={profile.location} />
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.pets.map((pet) => (
                  <Card key={pet.id}>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{pet.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} {pet.species}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {profile.preferences && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Preferences</h3>
                <p>Search radius: {profile.preferences.searchRadius}km</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
