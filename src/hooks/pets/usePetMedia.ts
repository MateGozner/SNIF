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

const extractFileName = (url: string): string => {
  const matches = url.match(/([^/]+\.[^.]+)$/);
  return matches ? matches[1] : "";
};

export function useDeletePetMedia(petId: string) {
  const queryClient = useQueryClient();

  return {
    deletePhoto: useMutation({
      mutationFn: async (photoUrl: string) => {
        const fileName = extractFileName(photoUrl);
        if (!fileName) {
          throw new Error("Invalid photo URL");
        }
        return api.delete(`api/Pet/${petId}/photos/${fileName}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      },
      onError: (error) => {
        console.error("Failed to delete photo:", error);
      },
    }),
    deleteVideo: useMutation({
      mutationFn: async (videoUrl: string) => {
        const fileName = extractFileName(videoUrl);
        if (!fileName) {
          throw new Error("Invalid video URL");
        }
        return api.delete(`api/Pet/${petId}/videos/${fileName}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      },
      onError: (error) => {
        console.error("Failed to delete video:", error);
      },
    }),
  };
}
