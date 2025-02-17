import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/auth/api";
import { toast } from "sonner";
import { MediaResponseDto, MediaType } from "@/lib/types/pet";
import { fileToBase64 } from "@/lib/utils/fileHelpers";

export function usePetMedia(petId: string, type?: MediaType) {
  return useQuery({
    queryKey: ["pets", petId, "media"],
    queryFn: () =>
      api.get<MediaResponseDto[]>(`api/pets/${petId}/media`, {
        params: { type },
      }),
  });
}

export function useAddPetMedia(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      file: File;
      type: MediaType;
      title?: string;
    }) => {
      // Convert file to base64
      const base64 = await fileToBase64(data.file);

      return api.post<MediaResponseDto>(`api/pets/${petId}/media`, {
        type: data.type,
        title: data.title,
        fileName: data.file.name,
        contentType: data.file.type,
        base64Data: base64,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "media"] });
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      toast.success("Media uploaded successfully");
    },
  });
}

export function useDeletePetMedia(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) =>
      api.delete(`api/pets/${petId}/media/${mediaId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets", petId, "media"] });
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
      toast.success("Media deleted successfully");
    },
  });
}
