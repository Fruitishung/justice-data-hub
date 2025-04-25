
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../../types"

interface VictimDescriptionProps {
  form: UseFormReturn<ReportFormData>
}

const VictimDescription = ({ form }: VictimDescriptionProps) => {
  return (
    <div className="space-y-4">
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
  )
}

export default VictimDescription
