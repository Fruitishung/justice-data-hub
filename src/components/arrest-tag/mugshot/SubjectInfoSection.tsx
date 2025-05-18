
import React from "react";
import { useFormContext } from "react-hook-form";
import { BioMarkers } from "./BioMarkerTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SubjectInfoSection = () => {
  const { register } = useFormContext<BioMarkers>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium block mb-1">Name</Label>
        <Input 
          id="name"
          className="w-full border rounded-md p-2" 
          {...register("name")}
        />
      </div>
      
      <div>
        <Label htmlFor="charges" className="text-sm font-medium block mb-1">Charges</Label>
        <Input 
          id="charges"
          className="w-full border rounded-md p-2" 
          {...register("charges")}
        />
      </div>
    </div>
  );
};

export default SubjectInfoSection;
