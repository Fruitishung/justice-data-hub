
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
          placeholder="First Name"
          {...form.register("victimFirstName")}
        />
        <Input
          placeholder="Last Name"
          {...form.register("victimLastName")}
        />
        <Input
          type="date"
          placeholder="Date of Birth"
          {...form.register("victimDOB")}
        />
        <Input
          placeholder="Address"
          {...form.register("victimAddress")}
        />
        <Input
          placeholder="Cell Phone"
          type="tel"
          {...form.register("victimCellPhone")}
        />
        <Input
          placeholder="Home Phone"
          type="tel"
          {...form.register("victimHomePhone")}
        />
        <Input
          placeholder="Work Phone"
          type="tel"
          {...form.register("victimWorkPhone")}
        />
        <Input
          placeholder="Gender"
          {...form.register("victimGender")}
        />
        <Input
          placeholder="Height"
          {...form.register("victimHeight")}
        />
        <Input
          placeholder="Weight"
          {...form.register("victimWeight")}
        />
        <Input
          placeholder="Hair Color"
          {...form.register("victimHair")}
        />
        <Input
          placeholder="Eye Color"
          {...form.register("victimEyes")}
        />
      </div>
      
      <div className="space-y-4 mt-4">
        <Textarea
          placeholder="Clothing Description"
          {...form.register("victimClothing")}
        />
        <Textarea
          placeholder="Identifying Marks (tattoos, scars, etc.)"
          {...form.register("victimIdentifyingMarks")}
        />
        <Textarea
          placeholder="Injuries/Condition"
          {...form.register("victimInjuries")}
        />
      </div>
    </ReportSection>
  )
}

export default VictimSection
