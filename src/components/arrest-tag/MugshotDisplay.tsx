
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { BioMarkers } from "./MugshotForm";

const MugshotDisplay = () => {
  const { photos } = usePhotoGeneration();
  const { watch } = useForm<BioMarkers>({
    defaultValues: {
      gender: "male",
      height: "5'10\"",
      weight: "average",
      hair: "dark",
      eyes: "brown",
      name: "John Doe",
      charges: "PC 459 - Burglary"
    }
  });

  const bioMarkers = watch();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Generated Arrest Tags</h2>
      
      <div className="grid grid-cols-1 gap-8">
        {photos.map((photo, index) => (
          <div key={index} className="border rounded-md overflow-hidden">
            <div className="relative">
              <AspectRatio ratio={3/4} className="bg-muted">
                <img 
                  src={photo} 
                  alt={`Mugshot ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-3">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-bold">{bioMarkers.name}</p>
                    <p>{bioMarkers.gender}, {bioMarkers.height}, {bioMarkers.hair} hair, {bioMarkers.eyes} eyes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{bioMarkers.charges}</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-muted/20 text-muted-foreground">
            <Camera className="h-12 w-12 mb-4 opacity-50" />
            <p>No mugshots generated yet</p>
            <p className="text-sm">Fill in the subject information and click "Generate Mugshot"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MugshotDisplay;
