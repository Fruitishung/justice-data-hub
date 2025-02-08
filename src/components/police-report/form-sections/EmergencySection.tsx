
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface EmergencySectionProps {
  form: UseFormReturn<ReportFormData>
}

const EmergencySection = ({ form }: EmergencySectionProps) => {
  return (
    <ReportSection icon={AlertCircle} title="Emergency Response">
      <Textarea
        placeholder="Response Details"
        {...form.register("emergencyResponse")}
      />
      <Input
        placeholder="Units Involved"
        {...form.register("emergencyUnits")}
      />
    </ReportSection>
  )
}

export default EmergencySection
