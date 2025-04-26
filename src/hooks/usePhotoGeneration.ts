
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePhotoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingErrors, setLoadingErrors] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const generatePhoto = useCallback(async () => {
    setIsGenerating(true);
    try {
      const testId = crypto.randomUUID();
      
      console.log("Calling generate-mugshot with id:", testId);
      const { data, error } = await supabase.functions.invoke(
        'generate-mugshot',
        {
          body: {
            arrest_tag_id: testId,
            photo_type: 'ai'
          }
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error("Failed to generate photo: " + error.message);
      }

      if (!data || !data.mugshot_url) {
        console.error("No photo URL returned:", data);
        throw new Error("No photo URL returned from generation");
      }

      console.log("Photo generated successfully:", data.mugshot_url);
      setPhotos(prev => [...prev, data.mugshot_url]);
      
      // Return the URL for use in components
      return data.mugshot_url;
    } catch (error) {
      console.error("Error generating photo:", error);
      toast({
        title: "Error",
        description: "Failed to generate booking photo. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
    setLoadingErrors({});
  }, []);

  const markPhotoAsErrored = useCallback((url: string) => {
    setLoadingErrors(prev => ({...prev, [url]: true}));
  }, []);

  const getFilteredPhotos = useCallback(() => {
    return photos.filter(url => !loadingErrors[url]);
  }, [photos, loadingErrors]);

  return {
    photos: getFilteredPhotos(),
    allPhotos: photos,
    isGenerating,
    generatePhoto,
    clearPhotos,
    markPhotoAsErrored
  };
};
