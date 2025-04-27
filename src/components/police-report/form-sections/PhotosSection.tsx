
import { useState } from "react";
import { Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { PhotoUploader } from "./photos/PhotoUploader";
import { PhotoPreview } from "./photos/PhotoPreview";
import { GeneratePhotoButton } from "./photos/GeneratePhotoButton";
import { PhotoErrorBoundary } from "./photos/PhotoErrorBoundary";

interface PhotosSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const PhotosSection = ({ form }: PhotosSectionProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePhotoAdded = (url: string) => {
    setPreviewUrls(prev => [...prev, url]);
  };

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  return (
    <PhotoErrorBoundary>
      <ReportSection icon={Camera} title="Evidence Photos">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Supported formats: JPEG, PNG, GIF, WebP, TIFF, BMP, HEIC/HEIF
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 100MB
              </p>
            </div>
            <GeneratePhotoButton 
              form={form}
              onPhotoGenerated={handlePhotoAdded}
              onGeneratingStateChange={handleGeneratingChange}
              disabled={isUploading}
            />
          </div>

          <PhotoUploader
            form={form}
            onPhotoUploaded={handlePhotoAdded}
            disabled={isGenerating}
          />

          <PhotoPreview 
            urls={previewUrls} 
            isLoading={isGenerating} 
          />
        </div>
      </ReportSection>
    </PhotoErrorBoundary>
  );
};

export default PhotosSection;
