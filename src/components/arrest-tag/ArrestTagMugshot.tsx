
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";
import { Camera, FileImage, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ArrestTag = Database['public']['Tables']['arrest_tags']['Row'];

interface ArrestTagMugshotProps {
  arrestTag: ArrestTag;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const ArrestTagMugshot = ({ 
  arrestTag, 
  isGenerating, 
  onGenerate 
}: ArrestTagMugshotProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('mugshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mugshots')
        .getPublicUrl(filePath);

      // Update the arrest tag with the new mugshot URL
      const { error: updateError } = await supabase
        .from('arrest_tags')
        .update({ mugshot_url: publicUrl })
        .eq('id', arrestTag.id);

      if (updateError) throw updateError;

      toast.success("Mugshot uploaded successfully");
      window.location.reload(); // Refresh to show new image
    } catch (error) {
      console.error('Error uploading mugshot:', error);
      toast.error("Failed to upload mugshot");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-64 space-y-4">
      <div className="flex flex-col gap-2">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          variant="secondary"
          className="w-full"
        >
          <Camera className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating Mugshot..." : "Generate Mugshot"}
        </Button>

        <div className="relative">
          <input
            type="file"
            id="mugshot-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById('mugshot-upload')?.click()}
            disabled={isUploading}
            variant="outline"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Mugshot"}
          </Button>
        </div>
      </div>

      {arrestTag?.mugshot_url ? (
        <div className="relative">
          <img 
            src={arrestTag.mugshot_url} 
            alt="Suspect Mugshot" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No mugshot available</p>
        </div>
      )}
    </div>
  );
};
