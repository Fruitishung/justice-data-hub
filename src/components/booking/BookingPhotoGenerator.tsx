
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, TrashIcon } from "lucide-react";
import { PhotoGrid } from "./PhotoGrid";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { useState } from "react";

export const BookingPhotoGenerator = () => {
  const { photos, isGenerating, generatePhoto, clearPhotos } = usePhotoGeneration();
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePhoto = async () => {
    setError(null);
    try {
      await generatePhoto();
    } catch (err) {
      setError("Failed to generate photo. Please try again.");
      console.error("Error in photo generation:", err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Booking Photos Generator</h2>
          <div className="flex gap-2">
            {photos.length > 0 && (
              <Button 
                onClick={clearPhotos} 
                variant="outline" 
                size="icon"
                title="Clear all photos"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={handleGeneratePhoto} 
              disabled={isGenerating}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate New Photo"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <PhotoGrid photos={photos} />
      </div>
    </Card>
  );
};
