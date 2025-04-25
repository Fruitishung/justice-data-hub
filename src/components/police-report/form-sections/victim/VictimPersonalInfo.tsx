
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../../types"

interface VictimPersonalInfoProps {
  form: UseFormReturn<ReportFormData>
}

const VictimPersonalInfo = ({ form }: VictimPersonalInfoProps) => {
  return (
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
      
      <FormField
        control={form.control}
        name="victimGender"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Transgender">Transgender</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

export default VictimPersonalInfo
