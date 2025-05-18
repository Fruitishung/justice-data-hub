
import React from "react";
import { useFormContext } from "react-hook-form";
import { BioMarkers } from "./BioMarkerTypes";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PhysicalAttributesSection = () => {
  const { watch, setValue } = useFormContext<BioMarkers>();
  const bioMarkers = watch();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium block mb-1">Gender</Label>
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
          <Label className="text-sm font-medium block mb-1">Height</Label>
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
          <Label className="text-sm font-medium block mb-1">Hair Color</Label>
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
          <Label className="text-sm font-medium block mb-1">Eye Color</Label>
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
        <Label className="text-sm font-medium block mb-1">Build</Label>
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
    </>
  );
};

export default PhysicalAttributesSection;
