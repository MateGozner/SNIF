// src/components/pets/PetCard.tsx
import { PetDto } from "@/lib/types/pet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils/urlTransformer";

interface PetCardProps {
  pet: PetDto;
}

export function PetCard({ pet }: PetCardProps) {
  const router = useRouter();
  const coverImage = getImageUrl(pet.photos[0]);

  return (
    <Card
      className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
      onClick={() => router.push(`/pets/${pet.id}`)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        {pet.photos[0] ? (
          <Image
            width={500}
            height={500}
            src={coverImage}
            alt={pet.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive sizes
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-[#2997FF] text-2xl text-white">
                {pet.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">{pet.name}</h3>
            <p className="text-sm text-muted-foreground">
              {pet.breed} • {pet.age} years
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-[#2997FF]/10 text-[#2997FF] hover:bg-[#2997FF]/20"
          >
            {pet.species}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
