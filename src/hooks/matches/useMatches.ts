import { api } from "@/lib/auth/api";
import { CreateMatchDto, MatchDto, UpdateMatchDto } from "@/lib/types/match";
import { PetDto, PetPurpose } from "@/lib/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePetMatches(petId: string) {
  return useQuery({
    queryKey: ["matches", petId],
    queryFn: () => api.get<MatchDto[]>(`api/match/pet/${petId}`),
  });
}

export function usePendingMatches(petId: string) {
  return useQuery({
    queryKey: ["matches", petId, "pending"],
    queryFn: () => api.get<MatchDto[]>(`api/match/pet/${petId}/pending`),
  });
}

export function useAllPetsPendingMatches(pets?: PetDto[]) {
  return useQuery({
    queryKey: ['all-pets-pending-matches'],
    queryFn: async () => {
      if (!pets?.length) return [];
      const promises = pets.map(pet => 
        api.get<MatchDto[]>(`api/match/pet/${pet.id}/pending`)
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!pets?.length,
  });
}

export function useAllPetsMatches(pets?: PetDto[]) {
  return useQuery({
    queryKey: ['all-pets-matches'],
    queryFn: async () => {
      if (!pets?.length) return [];
      const promises = pets.map(pet => 
        api.get<MatchDto[]>(`api/match/pet/${pet.id}`)
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!pets?.length,
  });
}

export function usePotentialMatches(petId: string, purpose?: PetPurpose) {
  const queryKey = purpose
    ? ["matches", petId, "potential", purpose]
    : ["matches", petId, "potential"];

  const url = purpose
    ? `api/match/pet/${petId}/potential?purpose=${purpose}`
    : `api/match/pet/${petId}/potential`;

  return useQuery({
    queryKey,
    queryFn: () => api.get<PetDto[]>(url),
    enabled: !!petId,
  });
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: async () => {
      console.log(`[useMatch] Fetching match with ID: ${matchId}`);

      try {
        const response = await api.get<MatchDto>(`api/match/${matchId}`);
        toast.success("Match loaded");
        return response;
      } catch (error) {
        toast.error("Failed to load match," + error);
        throw error;
      }
    },
    retry: (failureCount) => {
      toast.error(`Failed to load match, retrying...`);
      return failureCount < 3;
    },
  });
}

export function useCreateMatch(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchDto) =>
      api.post<MatchDto>(`api/match/pet/${petId}/match`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches", petId] });
      queryClient.invalidateQueries({
        queryKey: ["matches", petId, "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["matches", petId, "potential"],
      });
    },
  });
}

export function useUpdateMatchStatus(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMatchDto) =>
      api.put<MatchDto>(`api/match/${matchId}/status`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({
        queryKey: ["matches", data.initiatorPet.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["matches", data.targetPet.id],
      });
    },
  });
}

export function useDeleteMatch(matchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`api/match/${matchId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
