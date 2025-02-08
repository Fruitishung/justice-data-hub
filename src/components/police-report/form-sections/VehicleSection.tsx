
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Vehicle Make"
          {...form.register("vehicleMake")}
        />
        <Input
          placeholder="Vehicle Model"
          {...form.register("vehicleModel")}
        />
        <Input
          placeholder="Vehicle Year"
          {...form.register("vehicleYear")}
        />
        <Input
          placeholder="Vehicle Color"
          {...form.register("vehicleColor")}
        />
        <Input
          placeholder="VIN Number"
          {...form.register("vehicleVin")}
        />
        <Input
          placeholder="License Plate"
          {...form.register("vehiclePlate")}
        />
      </div>
    </ReportSection>
  )
}

export default VehicleSection
