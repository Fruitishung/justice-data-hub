
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface IncidentSectionProps {
  form: UseFormReturn<ReportFormData>
}

const IncidentSection = ({ form }: IncidentSectionProps) => {
  return (
    <ReportSection icon={Link} title="Incident Details">
      <Input
        type="datetime-local"
        placeholder="Incident Date & Time"
        {...form.register("incidentDate")}
      />
      <div className="space-y-2">
        <Textarea
          placeholder="Incident Description"
          {...form.register("incidentDescription")}
        />
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Link className="h-4 w-4" />
          A detailed narrative report will be linked after submission
        </p>
      </div>
    </ReportSection>
  )
}

export default IncidentSection
