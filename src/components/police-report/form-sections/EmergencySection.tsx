
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Siren } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface EmergencySectionProps {
  form: UseFormReturn<ReportFormData>
}

const EmergencySection = ({ form }: EmergencySectionProps) => {
  return (
    <ReportSection icon={Siren} title="Emergency Response">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Response Details</label>
          <Textarea
            placeholder="Enter emergency response details"
            className="min-h-[120px]"
            {...form.register("emergencyResponse")}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Units Involved</label>
          <Input
            placeholder="Enter responding units (separated by commas)"
            {...form.register("emergencyUnits")}
          />
        </div>
      </div>
    </ReportSection>
  )
}

export default EmergencySection
