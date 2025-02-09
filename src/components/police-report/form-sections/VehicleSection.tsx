
import { Input } from "@/components/ui/input"
import { Car, Truck, AlertTriangle } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VehicleSectionProps {
  form: UseFormReturn<ReportFormData>
}

const VehicleSection = ({ form }: VehicleSectionProps) => {
  return (
    <ReportSection icon={Car} title="Vehicle Information">
      <div className="space-y-6">
        {/* Vehicle Identification */}
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
            type="number"
            min={1900}
            max={new Date().getFullYear() + 1}
            placeholder="Vehicle Year"
            {...form.register("vehicleYear", {
              validate: {
                yearRange: (value: string) => {
                  if (!value) return true;
                  const year = parseInt(value, 10);
                  return (year >= 1900 && year <= new Date().getFullYear() + 1) || 
                         "Year must be between 1900 and next year";
                }
              }
            })}
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

        {/* Towing Authority Section */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Towing Authority</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Towing Company"
              {...form.register("vehicleTowingCompany")}
            />
            <Input
              placeholder="Towing Operator"
              {...form.register("vehicleTowingOperator")}
            />
            <Input
              type="datetime-local"
              placeholder="Towing Date/Time"
              {...form.register("vehicleTowingDate", {
                setValueAs: (value: string) => value || null // Convert empty string to null
              })}
            />
            <Input
              placeholder="Towing Location"
              {...form.register("vehicleTowingLocation")}
            />
          </div>
        </div>

        {/* Crime Involvement Section */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Crime Involvement</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vehicleCrimeInvolved" 
                {...form.register("vehicleCrimeInvolved")}
              />
              <Label htmlFor="vehicleCrimeInvolved">Vehicle involved in crime</Label>
            </div>
            <Input
              placeholder="Type of Crime"
              {...form.register("vehicleCrimeType")}
            />
            <Textarea
              placeholder="Additional Details about Crime Involvement"
              className="min-h-[100px]"
              {...form.register("vehicleCrimeDetails")}
            />
          </div>
        </div>
      </div>
    </ReportSection>
  )
}

export default VehicleSection
