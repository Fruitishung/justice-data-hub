
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, TrashIcon } from "lucide-react";
import { PhotoGrid } from "./PhotoGrid";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type BioMarkers = {
  gender: string;
  height: string;
  weight: string;
  hair: string;
  eyes: string;
};

export const BookingPhotoGenerator = () => {
  const { photos, allPhotos, isGenerating, generatePhoto, clearPhotos, markPhotoAsErrored, deletePhoto } = usePhotoGeneration();
  const [error, setError] = useState<string | null>(null);
  const { register, watch } = useForm<BioMarkers>();

  const bioMarkers = watch();

  const handleGeneratePhoto = async () => {
    setError(null);
    try {
      const testId = crypto.randomUUID();
      await generatePhoto(testId, "ai", bioMarkers);
    } catch (err) {
      setError("Failed to generate photo. Please try again.");
      console.error("Error in photo generation:", err);
    }
  };

  const handleImageError = (url: string) => {
    markPhotoAsErrored(url);
  };

  const handleDeletePhoto = (url: string) => {
    deletePhoto(url);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Booking Photos Generator</h2>
          <div className="flex gap-2">
            {allPhotos.length > 0 && (
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select {...register("gender")}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Height</label>
            <Select {...register("height")}>
              <SelectTrigger>
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4'8'' - 4'11''">4'8'' - 4'11''</SelectItem>
                <SelectItem value="5'0'' - 5'3''">5'0'' - 5'3''</SelectItem>
                <SelectItem value="5'4'' - 5'7''">5'4'' - 5'7''</SelectItem>
                <SelectItem value="5'8'' - 5'11''">5'8'' - 5'11''</SelectItem>
                <SelectItem value="6'0'' - 6'3''">6'0'' - 6'3''</SelectItem>
                <SelectItem value="6'4'' - 6'7''">6'4'' - 6'7''</SelectItem>
                <SelectItem value="6'8'' and above">6'8'' and above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hair Color</label>
            <Select {...register("hair")}>
              <SelectTrigger>
                <SelectValue placeholder="Select hair color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Brown">Brown</SelectItem>
                <SelectItem value="Blonde">Blonde</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Gray">Gray</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Bald">Bald</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Eye Color</label>
            <Select {...register("eyes")}>
              <SelectTrigger>
                <SelectValue placeholder="Select eye color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brown">Brown</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Hazel">Hazel</SelectItem>
                <SelectItem value="Gray">Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight Range</label>
            <Select {...register("weight")}>
              <SelectTrigger>
                <SelectValue placeholder="Select weight range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under 100 lbs">Under 100 lbs</SelectItem>
                <SelectItem value="100-120 lbs">100-120 lbs</SelectItem>
                <SelectItem value="121-140 lbs">121-140 lbs</SelectItem>
                <SelectItem value="141-160 lbs">141-160 lbs</SelectItem>
                <SelectItem value="161-180 lbs">161-180 lbs</SelectItem>
                <SelectItem value="181-200 lbs">181-200 lbs</SelectItem>
                <SelectItem value="Over 200 lbs">Over 200 lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <PhotoGrid 
          photos={photos} 
          onImageError={handleImageError}
          onDeletePhoto={handleDeletePhoto}
        />
      </div>
    </Card>
  );
};
