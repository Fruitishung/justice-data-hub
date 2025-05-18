
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BioMarkers } from "./BioMarkerTypes";
import SubjectInfoSection from "./SubjectInfoSection";
import PhysicalAttributesSection from "./PhysicalAttributesSection";
import MugshotFormActions from "./MugshotFormActions";

const MugshotForm = () => {
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<BioMarkers>({
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

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Subject Information</h2>
      
      <FormProvider {...methods}>
        <div className="space-y-4">
          <SubjectInfoSection />
          <PhysicalAttributesSection />
          <MugshotFormActions onError={handleError} />
          
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mt-4">
              {error}
            </div>
          )}
        </div>
      </FormProvider>
    </div>
  );
};

export default MugshotForm;
