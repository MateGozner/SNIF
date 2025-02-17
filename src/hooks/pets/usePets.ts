// src/hooks/pets/usePets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import {
  PetDto,
  CreatePetDto,
  UpdatePetDto,
  PetPurpose,
} from "@/lib/types/pet";
import { toast } from "sonner";

export function useUserPets(userId: string) {
  return useQuery({
    queryKey: ["pets", { userId }],
    queryFn: () =>
      api.get<PetDto[]>("api/pets", {
        params: { userId },
      }),
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ["pet", id],
    queryFn: () => api.get<PetDto>(`api/pets/${id}`),
  });
}

export function usePets(options?: {
  userId?: string;
  purpose?: PetPurpose;
  species?: string;
}) {
  return useQuery({
    queryKey: ["pets", options],
    queryFn: () =>
      api.get<PetDto[]>("api/pets", {
        params: options,
      }),
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePetDto) => {
      const petData = {
        ...data,
        medicalHistory: data.medicalHistory && {
          ...data.medicalHistory,
          lastCheckup: data.medicalHistory.lastCheckup?.toString(),
        },
      };
      return api.post<PetDto>("api/pets", petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet created successfully");
    },
  });
}

export function useUpdatePet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePetDto) => {
      // Ensure we're returning a PetDto not CreatePetDto
      const response = await api.put<PetDto>(`api/pets/${id}`, data);
      return response;
    },
    onSuccess: (updatedPet) => {
      // Update both queries with the new data
      queryClient.setQueryData(["pet", id], updatedPet);
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pet");
      console.error("Update error:", error);
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`api/pets/${id}`),
    onSuccess: (_, id) => {
      // Remove the pet from the cache
      queryClient.removeQueries({ queryKey: ["pet", id] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pet");
      console.error("Delete error:", error);
    },
  });
}
