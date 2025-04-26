
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePhotoGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const { toast } = useToast();

  const generatePhoto = useCallback(async () => {
    setIsGenerating(true);
    try {
      const testId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke(
        'generate-mugshot',
        {
          body: {
            arrest_tag_id: testId,
            photo_type: 'ai'
          }
        }
      );

      if (error) throw error;

      if (data?.mugshot_url) {
        setPhotos(prev => [...prev, data.mugshot_url]);
        toast({
          title: "Success",
          description: "Booking photo generated successfully",
        });
      }
    } catch (error) {
      console.error("Error generating photo:", error);
      toast({
        title: "Error",
        description: "Failed to generate booking photo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const clearPhotos = useCallback(() => {
    setPhotos([]);
  }, []);

  return {
    photos,
    isGenerating,
    generatePhoto,
    clearPhotos
  };
};
