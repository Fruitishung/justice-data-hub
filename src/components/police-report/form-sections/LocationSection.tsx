
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface LocationSectionProps {
  form: UseFormReturn<ReportFormData>
}

const LocationSection = ({ form }: LocationSectionProps) => {
  return (
    <ReportSection icon={MapPin} title="Location Data">
      <Input
        placeholder="Address"
        {...form.register("locationAddress")}
      />
      <Textarea
        placeholder="Location Details"
        {...form.register("locationDetails")}
      />
    </ReportSection>
  )
}

export default LocationSection
