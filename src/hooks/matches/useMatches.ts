import { api } from "@/lib/auth/api";
import { CreateMatchDto, MatchDto, MatchStatus } from "@/lib/types/match";
import { PetDto, PetPurpose } from "@/lib/types/pet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePetMatches(petId: string, status?: MatchStatus) {
  const queryKey = ["matches", petId, status].filter(Boolean);

  return useQuery({
    queryKey,
    queryFn: () =>
      api.get<MatchDto[]>(`api/matches`, {
        params: { petId, status },
      }),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function usePendingMatches(petId: string) {
  return useQuery({
    queryKey: ["matches", petId, "pending"],
    queryFn: () =>
      api.get<MatchDto[]>(`api/matches`, {
        params: {
          petId,
          status: "pending",
        },
      }),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useAllPetsPendingMatches(pets?: PetDto[]) {
  const petIds = pets?.map((pet) => pet.id).join(",");

  return useQuery({
    queryKey: ["matches", "bulk", "pending", petIds],
    queryFn: async () => {
      if (!petIds) return [];

      const response = await api.get<Record<string, MatchDto[]>>(
        `api/matches/bulk`,
        {
          params: {
            petIds,
            status: "pending",
          },
        }
      );

      // Flatten the results
      return Object.values(response).flat();
    },
    enabled: !!pets?.length,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useAllPetsMatches(pets?: PetDto[]) {
  const petIds = pets?.map((pet) => pet.id).join(",");

  return useQuery({
    queryKey: ["matches", "bulk", petIds],
    queryFn: async () => {
      if (!petIds) return [];

      const response = await api.get<Record<string, MatchDto[]>>(
        `api/matches/bulk`,
        {
          params: { petIds },
        }
      );

      // Flatten the results
      return Object.values(response).flat();
    },
    enabled: !!pets?.length,
    staleTime: 1000 * 60,
  });
}

export function usePotentialMatches(petId: string, purpose?: PetPurpose) {
  return useQuery({
    queryKey: ["matches", "potential", petId, purpose].filter(Boolean),
    queryFn: () =>
      api.get<PetDto[]>(`api/matches/potential`, {
        params: { petId, purpose },
      }),
    staleTime: 1000 * 300, // 5 minutes
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => api.get<MatchDto>(`api/matches/${id}`),
    staleTime: 1000 * 60,
    retry: 3,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchDto) =>
      api.post<MatchDto>("api/matches", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

export function useUpdateMatchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MatchStatus }) =>
      api.patch<MatchDto>(`api/matches/${id}`, { status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["match", data.id] });
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`api/matches/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}
