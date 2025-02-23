
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

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
      {arrestTag?.mugshot_url ? (
        <img 
          src={arrestTag.mugshot_url} 
          alt="Suspect Mugshot" 
          className="w-full rounded-lg shadow-md"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            variant="secondary"
          >
            {isGenerating ? "Generating..." : "Generate Mugshot"}
          </Button>
        </div>
      )}
    </div>
  );
};
