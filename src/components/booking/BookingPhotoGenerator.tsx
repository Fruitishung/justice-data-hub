
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, TrashIcon } from "lucide-react";
import { PhotoGrid } from "./PhotoGrid";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";

export const BookingPhotoGenerator = () => {
  const { photos, isGenerating, generatePhoto, clearPhotos } = usePhotoGeneration();

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
              onClick={generatePhoto} 
              disabled={isGenerating}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate New Photo"}
            </Button>
          </div>
        </div>

        <PhotoGrid photos={photos} />
      </div>
    </Card>
  );
};
