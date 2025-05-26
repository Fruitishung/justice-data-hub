
import { useState, useCallback } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploaderProps {
  form: UseFormReturn<ReportFormData>;
  onPhotoUploaded: (url: string) => void;
  disabled?: boolean;
}

export const PhotoUploader = ({ form, onPhotoUploaded, disabled }: PhotoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/bmp', 'image/heic', 'image/heif'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} is not a supported image format`);
        }

        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is 100MB`);
        }

        // Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `evidence-photos/${fileName}`;

        console.log(`Uploading file ${index + 1}/${files.length}: ${file.name}`);

        // Upload to Supabase Storage (create bucket if it doesn't exist)
        const { error: uploadError } = await supabase.storage
          .from('evidence-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          // If bucket doesn't exist, create it
          if (uploadError.message.includes('not found')) {
            console.log('Creating evidence-photos bucket...');
            const { error: bucketError } = await supabase.storage.createBucket('evidence-photos', {
              public: true,
              allowedMimeTypes: allowedTypes,
              fileSizeLimit: maxSize
            });

            if (bucketError) {
              console.error('Error creating bucket:', bucketError);
              throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
            }

            // Retry upload
            const { error: retryError } = await supabase.storage
              .from('evidence-photos')
              .upload(filePath, file);

            if (retryError) {
              throw new Error(`Upload failed after bucket creation: ${retryError.message}`);
            }
          } else {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('evidence-photos')
          .getPublicUrl(filePath);

        console.log(`Successfully uploaded: ${publicUrl}`);
        
        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);

        return {
          path: publicUrl,
          uploaded_at: new Date().toISOString(),
          filename: file.name,
          size: file.size,
          type: file.type
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);

      // Add to form data
      const currentPhotos = form.getValues('evidencePhotos') || [];
      form.setValue('evidencePhotos', [...currentPhotos, ...uploadedPhotos]);

      // Notify parent component
      uploadedPhotos.forEach(photo => {
        onPhotoUploaded(photo.path);
      });

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${uploadedPhotos.length} photo(s)`,
      });

    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload photos",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = '';
    }
  }, [form, onPhotoUploaded, toast]);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <FileImage className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {isUploading ? "Uploading..." : "Upload evidence photos"}
              </span>
              <span className="mt-1 block text-sm text-gray-500">
                Drag and drop or click to select files
              </span>
            </label>
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </div>
          
          {!disabled && !isUploading && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </Button>
          )}
        </div>
      </div>

      {isUploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
          <p className="text-center text-sm text-gray-600 mt-2">
            Uploading... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
    </div>
  );
};
