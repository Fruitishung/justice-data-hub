
import { useState } from "react";
import { Camera, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface PhotosSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const PhotosSection = ({ form }: PhotosSectionProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAIPhoto, setIsGeneratingAIPhoto] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (100MB limit)
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
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, objectUrl]);

      // Upload to Supabase Storage
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

  const generateAIPhoto = async () => {
    setIsGeneratingAIPhoto(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mugshot', {
        body: {
          arrest_tag_id: crypto.randomUUID(),
          photo_type: 'ai'
        }
      });

      if (error) throw error;

      if (data?.mugshot_url) {
        // Create a preview URL for the AI generated photo
        setPreviewUrls(prev => [...prev, data.mugshot_url]);

        // Update form with the AI generated photo
        const currentPhotos = form.getValues('evidencePhotos') || [];
        form.setValue('evidencePhotos', [...currentPhotos, {
          path: data.mugshot_url,
          uploaded_at: new Date().toISOString()
        }]);

        toast({
          title: "AI Photo Generated",
          description: "An AI-generated photo has been added to your evidence photos."
        });
      }
    } catch (error) {
      console.error('Error generating AI photo:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAIPhoto(false);
    }
  };

  return (
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                disabled={isUploading || isGeneratingAIPhoto}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Generate Photo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => generateAIPhoto()}>
                <Wand2 className="mr-2 h-4 w-4" /> AI-Generated Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
