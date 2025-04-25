
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Shield } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useJurisdiction } from "@/hooks/useJurisdiction"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface LocationSectionProps {
  form: UseFormReturn<ReportFormData>
}

const LocationSection = ({ form }: LocationSectionProps) => {
  const { state, county, city, isLoading } = useJurisdiction();

  // When jurisdiction loads, update the form if fields are empty
  useEffect(() => {
    if (!isLoading && state) {
      // Only auto-fill jurisdiction if the field is empty
      const currentJurisdiction = form.getValues("locationJurisdiction");
      if (!currentJurisdiction) {
        form.setValue("locationJurisdiction", `${city ? `${city}, ` : ''}${county ? `${county}, ` : ''}${state}`);
      }
    }
  }, [isLoading, state, county, city, form]);

  const applyJurisdiction = () => {
    if (state) {
      form.setValue("locationJurisdiction", `${city ? `${city}, ` : ''}${county ? `${county}, ` : ''}${state}`);
    }
  };

  return (
    <ReportSection icon={MapPin} title="Location Data">
      <div className="space-y-4">
        <Input
          placeholder="Address"
          {...form.register("locationAddress")}
        />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Jurisdiction</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={applyJurisdiction}
              disabled={isLoading || !state}
              className="h-7 px-2 text-xs"
            >
              <Shield className="h-3 w-3 mr-1" />
              {isLoading ? "Detecting..." : "Apply Current"}
            </Button>
          </div>
          <Input
            placeholder="Jurisdiction (State, County, City)"
            {...form.register("locationJurisdiction")}
          />
        </div>
        
        <Textarea
          placeholder="Location Details"
          {...form.register("locationDetails")}
        />
      </div>
    </ReportSection>
  )
}

export default LocationSection
