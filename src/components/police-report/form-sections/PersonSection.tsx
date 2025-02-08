
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface PersonSectionProps {
  form: UseFormReturn<ReportFormData>
}

const PersonSection = ({ form }: PersonSectionProps) => {
  return (
    <ReportSection icon={User} title="Person Details">
      <Input
        placeholder="Person Name"
        {...form.register("personName")}
      />
      <Textarea
        placeholder="Person Description"
        {...form.register("personDescription")}
      />
    </ReportSection>
  )
}

export default PersonSection
