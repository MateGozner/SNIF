// src/hooks/pets/usePets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { PetDto, CreatePetDto, UpdatePetDto } from "@/lib/types/pet";

export function useUserPets(userId: string) {
  return useQuery({
    queryKey: ["pets", userId],
    queryFn: () => api.get<PetDto[]>(`api/Pet/user/${userId}`),
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ["pet", id],
    queryFn: () => api.get<PetDto>(`api/Pet/${id}`),
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePetDto) => {
      const formData = new FormData();

      // Basic info
      if (data.name) formData.append("Name", data.name);
      if (data.species) formData.append("Species", data.species);
      if (data.breed) formData.append("Breed", data.breed);
      if (data.age !== undefined) formData.append("Age", data.age.toString());
      if (data.gender !== undefined)
        formData.append("Gender", data.gender.toString());

      // Arrays and objects
      if (data.purpose?.length) {
        data.purpose.forEach((purpose, index) => {
          formData.append(`Purpose[${index}]`, purpose.toString());
        });
      }
      if (data.personality?.length) {
        formData.append("Personality", JSON.stringify(data.personality));
      }

      // Nested objects
      if (data.medicalHistory) {
        formData.append("MedicalHistory", JSON.stringify(data.medicalHistory));
      }
      if (data.location) {
        formData.append("Location", JSON.stringify(data.location));
      }

      // Files
      if (data.photos) {
        data.photos.forEach((photo) => {
          formData.append("Photos", photo);
        });
      }
      if (data.videos) {
        data.videos.forEach((video) => {
          formData.append("Videos", video);
        });
      }

      const response = await api.post<PetDto>("api/Pet", formData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}

export function useUpdatePet(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePetDto) =>
      api.put<CreatePetDto>(`api/Pet/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet", id] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`api/Pet/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}
