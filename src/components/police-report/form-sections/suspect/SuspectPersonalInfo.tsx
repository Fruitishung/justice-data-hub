
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SuspectPersonalInfoProps {
  form: UseFormReturn<ReportFormData>;
}

const SuspectPersonalInfo = ({ form }: SuspectPersonalInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        placeholder="First Name"
        {...form.register("suspectFirstName")}
      />
      <Input
        placeholder="Last Name"
        {...form.register("suspectLastName")}
      />
      <Input
        placeholder="Also Known As (AKA)"
        className="md:col-span-2"
        {...form.register("suspectAKA")}
      />
      <Input
        type="date"
        placeholder="Date of Birth"
        {...form.register("suspectDOB")}
      />
      <Input
        placeholder="Address"
        {...form.register("suspectAddress")}
      />
      <Input
        placeholder="Cell Phone"
        type="tel"
        {...form.register("suspectCellPhone")}
      />
      <Input
        placeholder="Home Phone"
        type="tel"
        {...form.register("suspectHomePhone")}
      />
      <Input
        placeholder="Work Phone"
        type="tel"
        {...form.register("suspectWorkPhone")}
      />
      
      <FormField
        control={form.control}
        name="suspectGender"
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
  );
};

export default SuspectPersonalInfo;
