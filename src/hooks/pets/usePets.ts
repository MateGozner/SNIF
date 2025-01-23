// src/hooks/pets/usePets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { PetDto, CreatePetDto, UpdatePetDto } from "@/lib/types/pet";
import { toast } from "sonner";

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

      console.log("Creating pet:", data);

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
        data.personality.forEach((personality, index) => {
          formData.append(`Personality[${index}]`, personality.toString());
        });
      }

      // Nested objects
      if (data.medicalHistory) {
        if (data.medicalHistory.lastCheckup) {
          formData.append(
            "MedicalHistory.LastCheckup",
            data.medicalHistory.lastCheckup.toString()
          );
        }
        if (data.medicalHistory.vetContact) {
          formData.append(
            "MedicalHistory.VetContact",
            data.medicalHistory.vetContact
          );
        }
        if (data.medicalHistory.isVaccinated !== undefined)
          formData.append(
            "MedicalHistory.IsVaccinated",
            data.medicalHistory.isVaccinated.toString()
          );
        formData.append(
          "MedicalHistory.IsVaccinated",
          data.medicalHistory.isVaccinated.toString()
        );
        if (data.medicalHistory.vaccinationRecords?.length) {
          data.medicalHistory.vaccinationRecords.forEach((vaccine, index) => {
            formData.append(
              `MedicalHistory.VaccinationRecords[${index}]`,
              vaccine
            );
          });
        }
        if (data.medicalHistory.healthIssues?.length) {
          data.medicalHistory.healthIssues?.forEach((issue, index) => {
            formData.append(`MedicalHistory.HealthIssues[${index}]`, issue);
          });
        }
      }
      if (data.location) {
        formData.append("Location.Latitude", data.location.latitude.toString());
        formData.append(
          "Location.Longitude",
          data.location.longitude.toString()
        );
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

      console.log("Form data:", formData);

      const response = await api.post<PetDto>("api/Pet", formData);
      return response;
    },
    onSuccess: () => {
      toast.success("Pet created successfully");
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
      toast.success("Pet updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pet", id] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`api/Pet/${id}`);
        // No need to check status code since api.delete handles it
        return response;
      } catch (error) {
        console.error("Delete pet error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Pet deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: (error) => {
      toast.error("Failed to delete pet");
      console.error("Delete mutation error:", error);
    },
  });
}
