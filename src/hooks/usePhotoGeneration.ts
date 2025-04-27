
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
      // Log the bioMarkers to help with debugging
      console.log("Generating photo with bioMarkers:", bioMarkers);
      
      const { data, error } = await supabase.functions.invoke(
        'generate-mugshot',
        {
          body: {
            arrest_tag_id: arrestTagId,
            photo_type: photoType,
            bio_markers: bioMarkers || {}  // Ensure we always send at least an empty object
          }
        }
      );

      if (error) throw error;

      const imageUrl = data?.mugshot_url;
      if (!imageUrl) throw new Error("No photo URL returned");

      // Pre-load the image to check if it's valid
      return new Promise<string>((resolve, reject) => {
        const imgTest = new Image();
        
        imgTest.onload = () => {
          console.log("Image loaded successfully:", imageUrl);
          setPhotos(prev => [...prev, imageUrl]);
          resolve(imageUrl);
        };
        
        imgTest.onerror = () => {
          console.error("Generated image URL failed to load:", imageUrl);
          markPhotoAsErrored(imageUrl);
          reject(new Error("Failed to load generated image"));
        };
        
        imgTest.src = imageUrl;
      });
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
    console.log("Marking photo as errored:", url);
    setLoadingErrors(prev => ({...prev, [url]: true}));
  }, []);

  const getFilteredPhotos = useCallback(() => {
    return photos.filter(url => !loadingErrors[url]);
  }, [photos, loadingErrors]);
  
  // Delete a specific photo by URL
  const deletePhoto = useCallback((url: string) => {
    console.log("Deleting photo:", url);
    setPhotos(prev => prev.filter(photoUrl => photoUrl !== url));
    // Also clean up the error state if it exists
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
