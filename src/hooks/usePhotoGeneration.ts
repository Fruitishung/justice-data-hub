
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

      // Don't add cache-busting to already working URLs
      const finalUrl = imageUrl.includes('unsplash.com') ? imageUrl : `${imageUrl}?cachebust=${timestamp}`;
      console.log("Using final URL:", finalUrl);

      // For Unsplash URLs (fallback images), add them directly without validation
      if (imageUrl.includes('unsplash.com')) {
        console.log("Adding fallback image directly:", finalUrl);
        setPhotos(prev => [...prev, finalUrl]);
        return finalUrl;
      }

      // For AI-generated URLs, validate they load properly
      return new Promise<string>((resolve, reject) => {
        const imgTest = new Image();
        
        imgTest.onload = () => {
          console.log("Image loaded successfully:", finalUrl);
          setPhotos(prev => [...prev, finalUrl]);
          resolve(finalUrl);
        };
        
        imgTest.onerror = () => {
          console.error("Generated image URL failed to load:", finalUrl);
          reject(new Error("Failed to load generated image"));
        };
        
        imgTest.src = finalUrl;
      });
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
    return photos.filter(url => !loadingErrors[url]);
  }, [photos, loadingErrors]);
  
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
