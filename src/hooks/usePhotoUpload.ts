
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface UploadedPhoto {
  path: string;
  uploaded_at: string;
}

export const usePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadPhoto = useCallback(async (file: File, retryCount = 0): Promise<UploadedPhoto | null> => {
    if (!file) return null;

    if (file.size > 104857600) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const objectUrl = URL.createObjectURL(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${crypto.randomUUID()}`;
      const filePath = `${fileName}.${fileExt}`;
      
      // Using the correct approach for Supabase upload without onUploadProgress
      const { data, error: uploadError } = await supabase.storage
        .from('evidence_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      // Simulate upload progress since we can't use onUploadProgress directly
      setUploadProgress(100);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('evidence_photos')
        .getPublicUrl(filePath);

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      return {
        path: filePath,
        uploaded_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError(error.message);
      
      // Implement retry mechanism
      if (retryCount < 3) {
        toast({
          title: "Upload failed",
          description: `Retrying upload (attempt ${retryCount + 1}/3)...`,
        });
        return uploadPhoto(file, retryCount + 1);
      }

      toast({
        title: "Error",
        description: "Failed to upload photo after multiple attempts. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [toast]);

  return {
    uploadPhoto,
    isUploading,
    uploadProgress,
    uploadError,
  };
};
