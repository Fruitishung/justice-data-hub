
import { useState } from "react";
import { Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PhotosSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const PhotosSection = ({ form }: PhotosSectionProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, objectUrl]);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${crypto.randomUUID()}`;
      const filePath = `${fileName}.${fileExt}`;
      
      // Ensure the 'evidence_photos' bucket exists before uploading
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('evidence_photos');

      if (bucketError && bucketError.message.includes('does not exist')) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket('evidence_photos', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
      }
      
      const { data, error: uploadError } = await supabase.storage
        .from('evidence_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('evidence_photos')
        .getPublicUrl(filePath);

      // Get the current photos array from the form
      const currentPhotos = form.getValues('evidencePhotos') || [];
      
      // Update the form with the new photo
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
    <ReportSection icon={Camera} title="Evidence Photos">
      <div className="space-y-4">
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
            disabled={isUploading}
          />
        )}
        
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Photo Preview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={url} className={`w-full aspect-square border rounded-lg overflow-hidden ${index === 0 ? 'col-span-full sm:col-span-1' : ''}`}>
                  <img 
                    src={url} 
                    alt={`Evidence photo ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ReportSection>
  );
};

export default PhotosSection;
