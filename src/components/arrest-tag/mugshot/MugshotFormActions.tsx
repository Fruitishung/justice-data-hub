
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { useFormContext } from "react-hook-form";
import { BioMarkers } from "./BioMarkerTypes";
import { toast } from "@/hooks/use-toast";

interface MugshotFormActionsProps {
  onError: (error: string | null) => void;
}

const MugshotFormActions = ({ onError }: MugshotFormActionsProps) => {
  const { generatePhoto, isGenerating, clearPhotos } = usePhotoGeneration();
  const { watch } = useFormContext<BioMarkers>();
  const bioMarkers = watch();

  const handleGeneratePhoto = async () => {
    onError(null);
    try {
      console.log("Starting photo generation with bioMarkers:", bioMarkers);
      
      toast({
        title: "Generating Mugshot",
        description: "Please wait while your mugshot is being generated..."
      });

      const testId = `test-${Date.now()}`;
      console.log("Generated test ID:", testId);
      
      const result = await generatePhoto(testId, "ai", bioMarkers);
      console.log("Photo generation completed with result:", result);
      
      toast({
        title: "Success", 
        description: "Mugshot generated successfully!",
      });
    } catch (err) {
      console.error("Error in mugshot generation:", err);
      onError("Failed to generate mugshot. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to generate mugshot. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        onClick={handleGeneratePhoto}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        {isGenerating ? "Generating..." : "Generate Mugshot"}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => clearPhotos()}
      >
        Clear All
      </Button>
    </div>
  );
};

export default MugshotFormActions;
