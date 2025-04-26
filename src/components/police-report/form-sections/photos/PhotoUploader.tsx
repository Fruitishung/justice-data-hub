
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { PhotoErrorBoundary } from "./PhotoErrorBoundary";

interface PhotoUploaderProps {
  form: UseFormReturn<ReportFormData>;
  onPhotoUploaded: (url: string) => void;
  disabled?: boolean;
}

export const PhotoUploader = ({ form, onPhotoUploaded, disabled }: PhotoUploaderProps) => {
  const { uploadPhoto, isUploading, uploadProgress, uploadError } = usePhotoUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onPhotoUploaded(objectUrl);

    const uploadedPhoto = await uploadPhoto(file);
    
    if (uploadedPhoto) {
      const currentPhotos = form.getValues('evidencePhotos') || [];
      form.setValue('evidencePhotos', [...currentPhotos, uploadedPhoto]);
    }
  };

  return (
    <PhotoErrorBoundary>
      <div className="space-y-4">
        {isUploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading photo...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
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
        
        {uploadError && (
          <p className="text-sm text-destructive">
            Error uploading photo: {uploadError}
          </p>
        )}
      </div>
    </PhotoErrorBoundary>
  );
};
