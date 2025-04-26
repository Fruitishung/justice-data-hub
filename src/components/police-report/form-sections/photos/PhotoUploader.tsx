
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploaderProps {
  form: UseFormReturn<ReportFormData>;
  onPhotoUploaded: (url: string) => void;
  disabled?: boolean;
}

export const PhotoUploader = ({ form, onPhotoUploaded, disabled }: PhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 104857600) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      onPhotoUploaded(objectUrl);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${crypto.randomUUID()}`;
      const filePath = `${fileName}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('evidence_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('evidence_photos')
        .getPublicUrl(filePath);

      const currentPhotos = form.getValues('evidencePhotos') || [];
      form.setValue('evidencePhotos', [...currentPhotos, {
        path: filePath,
        uploaded_at: new Date().toISOString()
      }]);

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {isUploading ? (
        <div className="flex items-center space-x-4">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Uploading photo...</span>
        </div>
      ) : (
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="cursor-pointer"
          disabled={disabled || isUploading}
        />
      )}
    </>
  );
};
