
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface VictimSectionProps {
  form: UseFormReturn<ReportFormData>
}

const VictimSection = ({ form }: VictimSectionProps) => {
  return (
    <ReportSection icon={Users} title="Victim Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Full Name"
          {...form.register("victimName")}
        />
        <Input
          placeholder="Age"
          type="number"
          {...form.register("victimAge")}
        />
        <Input
          placeholder="Gender"
          {...form.register("victimGender")}
        />
        <Input
          placeholder="Phone Number"
          type="tel"
          {...form.register("victimPhone")}
        />
      </div>
      <Input
        placeholder="Address"
        {...form.register("victimAddress")}
      />
      <Textarea
        placeholder="Injuries/Condition"
        {...form.register("victimInjuries")}
      />
    </ReportSection>
  )
}

export default VictimSection
