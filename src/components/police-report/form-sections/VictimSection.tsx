
import { Users } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import VictimPersonalInfo from "./victim/VictimPersonalInfo"
import VictimPhysicalDescription from "./victim/VictimPhysicalDescription"
import VictimDescription from "./victim/VictimDescription"

interface VictimSectionProps {
  form: UseFormReturn<ReportFormData>
}

const VictimSection = ({ form }: VictimSectionProps) => {
  return (
    <ReportSection icon={Users} title="Victim Information">
      <div className="space-y-6">
        <VictimPersonalInfo form={form} />
        <VictimPhysicalDescription form={form} />
        <VictimDescription form={form} />
      </div>
    </ReportSection>
  )
}

export default VictimSection
