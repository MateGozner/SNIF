export interface PetMatchNotification {
  OwnerId: string;
  MatchedPetId: string;
  PetName: string;
  Species: string;
  Breed: string;
  Distance: number;
  NotifiedAt: string;
}
