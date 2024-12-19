import { api } from "@/lib/auth/api";
import { CreateMatchDto, MatchDto, UpdateMatchDto } from "@/lib/types/match";
import { PetDto, PetPurpose } from "@/lib/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    queryFn: () => api.get<MatchDto>(`api/match/${matchId}`),
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
