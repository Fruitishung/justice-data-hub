
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
      
      toast({
        title: "Generating Photo",
        description: "Please wait while we generate your photo..."
      });
      
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

      console.log("Full response from generate-mugshot:", data);

      if (!data || !data.mugshot_url) {
        console.error("No photo URL returned:", data);
        throw new Error("No photo URL returned from generation");
      }

      const imageUrl = data.mugshot_url;
      console.log("Photo generated successfully:", imageUrl);
      
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
        
        // Set the source to start loading
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

  return {
    photos: getFilteredPhotos(),
    allPhotos: photos,
    isGenerating,
    generatePhoto,
    clearPhotos,
    markPhotoAsErrored
  };
};
