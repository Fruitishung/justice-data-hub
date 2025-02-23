
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";
import { Camera, FileImage } from "lucide-react";

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
          <p className="text-sm text-muted-foreground">No mugshot available</p>
        </div>
      )}
    </div>
  );
};
