
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface PhotosSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const PhotosSection = ({ form }: PhotosSectionProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [canUploadPhotos, setCanUploadPhotos] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkPermissions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: permissions, error } = await supabase.rpc(
          'check_user_tier_permissions',
          { user_id: user.id }
        );

        if (error) {
          console.error('Error checking permissions:', error);
          return;
        }

        if (permissions && permissions.length > 0) {
          setCanUploadPhotos(permissions[0].can_upload_photos);
        }
      }
    };

    checkPermissions();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!canUploadPhotos) {
      toast({
        title: "Subscription Required",
        description: "Photo uploads are available in Basic tier and above. Please upgrade your subscription to use this feature.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, objectUrl]);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evidence_photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

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
    }
  };

  return (
    <ReportSection icon={Camera} title="Evidence Photos">
      <div className="space-y-4">
        {!canUploadPhotos && (
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <p className="text-yellow-800 text-sm">
              Photo uploads are available in Basic tier and above. Please upgrade your subscription to use this feature.
            </p>
          </div>
        )}
        
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="cursor-pointer"
          disabled={!canUploadPhotos}
        />
        
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
