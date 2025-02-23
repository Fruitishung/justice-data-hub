
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface EvidenceSectionProps {
  form: UseFormReturn<ReportFormData>
}

const EvidenceSection = ({ form }: EvidenceSectionProps) => {
  return (
    <ReportSection icon={FileText} title="Evidence Log">
      <div className="space-y-4">
        <Textarea
          placeholder="Evidence Description"
          {...form.register("evidenceDescription")}
        />
        <Input
          placeholder="Evidence Location"
          {...form.register("evidenceLocation")}
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="evidenceBooked"
            {...form.register("evidenceBookedAtHQ")}
          />
          <Label htmlFor="evidenceBooked">
            Evidence has been booked at HQ evidence locker
          </Label>
        </div>
        
        <div className="border p-4 rounded-lg space-y-4">
          <h4 className="font-semibold">Property Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input
                placeholder="Serial Number"
                {...form.register("evidenceSerialNumber")}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Input
                placeholder="Property Type"
                {...form.register("evidencePropertyType")}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Make</Label>
              <Input
                placeholder="Make"
                {...form.register("evidenceMake")}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Model</Label>
              <Input
                placeholder="Model"
                {...form.register("evidenceModel")}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                placeholder="Color"
                {...form.register("evidenceColor")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Details</Label>
            <Textarea
              placeholder="Additional property details..."
              {...form.register("evidenceAdditionalDetails")}
            />
          </div>
        </div>
      </div>
    </ReportSection>
  )
}

export default EvidenceSection
