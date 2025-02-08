
import { Input } from "@/components/ui/input"
import { Car } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"

interface VehicleSectionProps {
  form: UseFormReturn<ReportFormData>
}

const VehicleSection = ({ form }: VehicleSectionProps) => {
  return (
    <ReportSection icon={Car} title="Vehicle Information">
      <Input
        placeholder="Vehicle Make"
        {...form.register("vehicleMake")}
      />
      <Input
        placeholder="Vehicle Model"
        {...form.register("vehicleModel")}
      />
    </ReportSection>
  )
}

export default VehicleSection
