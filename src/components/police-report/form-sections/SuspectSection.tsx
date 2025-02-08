
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserX } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface SuspectSectionProps {
  form: UseFormReturn<ReportFormData>
}

const SuspectSection = ({ form }: SuspectSectionProps) => {
  return (
    <ReportSection icon={UserX} title="Suspect Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Full Name (if known)"
          {...form.register("suspectName")}
        />
        <Input
          placeholder="Approximate Age"
          {...form.register("suspectAge")}
        />
        <Input
          placeholder="Gender"
          {...form.register("suspectGender")}
        />
        <Input
          placeholder="Height"
          {...form.register("suspectHeight")}
        />
        <Input
          placeholder="Weight"
          {...form.register("suspectWeight")}
        />
        <Input
          placeholder="Hair Color"
          {...form.register("suspectHair")}
        />
        <Input
          placeholder="Eye Color"
          {...form.register("suspectEyes")}
        />
      </div>
      <Textarea
        placeholder="Clothing Description"
        {...form.register("suspectClothing")}
      />
      <Textarea
        placeholder="Identifying Marks (tattoos, scars, etc.)"
        {...form.register("suspectIdentifyingMarks")}
      />
      <Input
        placeholder="Direction of Travel/Last Seen"
        {...form.register("suspectDirection")}
      />
    </ReportSection>
  )
}

export default SuspectSection
