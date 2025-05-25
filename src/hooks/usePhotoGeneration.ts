
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePhotoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loadingErrors, setLoadingErrors] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const generatePhoto = useCallback(async (arrestTagId: string, photoType: 'ai' | 'training' = 'ai', bioMarkers?: any) => {
    setIsGenerating(true);
    try {
      console.log("Generating photo with bioMarkers:", bioMarkers);
      
      const timestamp = new Date().getTime();
      console.log(`Starting photo generation at ${timestamp}`);
      
      const { data, error } = await supabase.functions.invoke(
        'generate-mugshot',
        {
          body: {
            arrest_tag_id: arrestTagId,
            photo_type: photoType,
            bio_markers: bioMarkers || {},
            timestamp: timestamp
          }
        }
      );

      if (error) {
        console.error("Supabase function invocation error:", error);
        throw new Error(`Function invoke error: ${error.message}`);
      }

      console.log("Supabase function response:", data);
      
      if (!data) {
        throw new Error("No data returned from function");
      }
      
      const imageUrl = data?.mugshot_url;
      if (!imageUrl) {
        console.error("No mugshot URL in response:", data);
        throw new Error("No photo URL returned");
      }

      console.log("Adding image to photos:", imageUrl);
      // Add image directly to photos array - no validation needed for fallback images
      setPhotos(prev => {
        const newPhotos = [...prev, imageUrl];
        console.log("Updated photos array:", newPhotos);
        return newPhotos;
      });

      toast({
        title: "Success",
        description: "Mugshot generated successfully",
      });

      return imageUrl;
    } catch (error) {
      console.error("Error generating photo:", error);
      toast({
        title: "Error",
        description: `Failed to generate booking photo: ${error instanceof Error ? error.message : "Unknown error"}`,
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
    console.log("Marking photo as errored:", url);
    setLoadingErrors(prev => ({...prev, [url]: true}));
  }, []);

  const getFilteredPhotos = useCallback(() => {
    // Don't filter out errored photos for now to ensure they display
    return photos;
  }, [photos]);
  
  const deletePhoto = useCallback((url: string) => {
    console.log("Deleting photo:", url);
    setPhotos(prev => prev.filter(photoUrl => photoUrl !== url));
    if (loadingErrors[url]) {
      const newErrors = {...loadingErrors};
      delete newErrors[url];
      setLoadingErrors(newErrors);
    }
  }, [loadingErrors]);

  return {
    photos: getFilteredPhotos(),
    allPhotos: photos,
    isGenerating,
    generatePhoto,
    clearPhotos,
    markPhotoAsErrored,
    deletePhoto
  };
};
