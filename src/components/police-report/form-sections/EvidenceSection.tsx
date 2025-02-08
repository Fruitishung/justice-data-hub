
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface EvidenceSectionProps {
  form: UseFormReturn<ReportFormData>
}

const EvidenceSection = ({ form }: EvidenceSectionProps) => {
  return (
    <ReportSection icon={FileText} title="Evidence Log">
      <Textarea
        placeholder="Evidence Description"
        {...form.register("evidenceDescription")}
      />
      <Input
        placeholder="Evidence Location"
        {...form.register("evidenceLocation")}
      />
    </ReportSection>
  )
}

export default EvidenceSection
