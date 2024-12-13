import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";

export function useAddPetPhoto(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      return api.post<{ fileName: string }>(
        `api/Pet/${petId}/photos`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
    },
  });
}

export function useAddPetVideo(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("video", file);
      return api.post<{ fileName: string }>(
        `api/Pet/${petId}/videos`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
    },
  });
}

export function useDeletePetMedia(petId: string) {
  const queryClient = useQueryClient();

  return {
    deletePhoto: useMutation({
      mutationFn: (fileName: string) =>
        api.delete(`api/Pet/${petId}/photos/${fileName}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      },
    }),
    deleteVideo: useMutation({
      mutationFn: (fileName: string) =>
        api.delete(`api/Pet/${petId}/videos/${fileName}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      },
    }),
  };
}
