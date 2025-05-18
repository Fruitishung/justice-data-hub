
import React, { useState } from "react";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";

export type BioMarkers = {
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
  name?: string;
  charges?: string;
}

const MugshotForm = () => {
  const { generatePhoto, isGenerating, clearPhotos } = usePhotoGeneration();
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

      // Generate a unique ID each time to avoid caching issues
      const testId = crypto.randomUUID();
      console.log("Generating with unique ID:", testId);
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
    <div>
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
          
          <Button
            variant="outline"
            onClick={() => clearPhotos()}
          >
            Clear All
          </Button>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default MugshotForm;
