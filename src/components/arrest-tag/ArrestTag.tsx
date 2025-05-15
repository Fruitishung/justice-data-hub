
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";

type BioMarkers = {
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
  name?: string;
  charges?: string;
}

const ArrestTag = () => {
  const { generatePhoto, photos, isGenerating, clearPhotos } = usePhotoGeneration();
  const { register, watch, setValue } = useForm<BioMarkers>({
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
  const [error, setError] = useState<string | null>(null);

  const bioMarkers = watch();

  const handleGeneratePhoto = async () => {
    setError(null);
    try {
      toast({
        title: "Generating Mugshot",
        description: "Please wait while your mugshot is being generated..."
      });

      const testId = crypto.randomUUID();
      await generatePhoto(testId, "ai", bioMarkers);
    } catch (err) {
      setError("Failed to generate mugshot. Please try again.");
      console.error("Error in mugshot generation:", err);
      
      toast({
        title: "Error",
        description: "Failed to generate mugshot. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Arrest Tag Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Subject Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Name</label>
                <input 
                  type="text"
                  className="w-full border rounded-md p-2" 
                  {...register("name")}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Charges</label>
                <input 
                  type="text"
                  className="w-full border rounded-md p-2" 
                  {...register("charges")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Gender</label>
                <Select
                  defaultValue={bioMarkers.gender}
                  onValueChange={(value) => setValue("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Height</label>
                <Select
                  defaultValue={bioMarkers.height}
                  onValueChange={(value) => setValue("height", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5'0\"">5'0"</SelectItem>
                    <SelectItem value="5'2\"">5'2"</SelectItem>
                    <SelectItem value="5'4\"">5'4"</SelectItem>
                    <SelectItem value="5'6\"">5'6"</SelectItem>
                    <SelectItem value="5'8\"">5'8"</SelectItem>
                    <SelectItem value="5'10\"">5'10"</SelectItem>
                    <SelectItem value="6'0\"">6'0"</SelectItem>
                    <SelectItem value="6'2\"">6'2"</SelectItem>
                    <SelectItem value="6'4\"">6'4"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Hair Color</label>
                <Select
                  defaultValue={bioMarkers.hair}
                  onValueChange={(value) => setValue("hair", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hair color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blonde">Blonde</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Eye Color</label>
                <Select
                  defaultValue={bioMarkers.eyes}
                  onValueChange={(value) => setValue("eyes", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="hazel">Hazel</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium block mb-1">Build</label>
              <Select
                defaultValue={bioMarkers.weight}
                onValueChange={(value) => setValue("weight", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select build" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thin">Thin</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleGeneratePhoto}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {isGenerating ? "Generating..." : "Generate Mugshot"}
              </Button>
              
              {photos.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => clearPhotos()}
                >
                  Clear All
                </Button>
              )}
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mt-4">
                {error}
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 col-span-1 lg:col-span-2">
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
        </Card>
      </div>
    </div>
  );
};

export default ArrestTag;
