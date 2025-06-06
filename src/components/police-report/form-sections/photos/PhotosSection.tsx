
import { useState } from "react";
import { Camera } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import ReportSection from "../../ReportSection";
import { PhotoUploader } from "./PhotoUploader";
import { PhotoPreview } from "./PhotoPreview";
import { GeneratePhotoButton } from "./GeneratePhotoButton";
import { CrimeScenePhotoGenerator } from "./CrimeScenePhotoGenerator";
import { PhotoErrorBoundary } from "./PhotoErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

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

  const handleUploadingChange = (uploading: boolean) => {
    setIsUploading(uploading);
  };

  // Get incident report ID if available (for crime scene photos)
  const incidentReportId = form.getValues('caseNumber');

  return (
    <PhotoErrorBoundary>
      <ReportSection icon={Camera} title="Evidence & Crime Scene Photos">
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Upload evidence photos or generate AI crime scene photos for training purposes. 
              Supported formats: JPEG, PNG, GIF, WebP, TIFF, BMP, HEIC/HEIF (Max: 100MB per file)
            </AlertDescription>
          </Alert>

          {/* Crime Scene Photo Generation */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium mb-3">Crime Scene Documentation</h4>
            <CrimeScenePhotoGenerator
              incidentReportId={incidentReportId}
              onPhotoGenerated={handlePhotoAdded}
              disabled={isUploading}
            />
          </div>

          {/* Evidence Photo Actions */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-2">Evidence Photos</h4>
              <PhotoUploader
                form={form}
                onPhotoUploaded={handlePhotoAdded}
                disabled={isGenerating}
              />
            </div>
            
            <div className="flex-shrink-0">
              <GeneratePhotoButton 
                form={form}
                onPhotoGenerated={handlePhotoAdded}
                onGeneratingStateChange={handleGeneratingChange}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Photo Preview */}
          <PhotoPreview 
            urls={previewUrls} 
            isLoading={isGenerating || isUploading}
          />
        </div>
      </ReportSection>
    </PhotoErrorBoundary>
  );
};

export default PhotosSection;
