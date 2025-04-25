
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SuspectAdditionalInfoProps {
  form: UseFormReturn<ReportFormData>;
}

const SuspectAdditionalInfo = ({ form }: SuspectAdditionalInfoProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Clothing Description"
        {...form.register("suspectClothing")}
      />
      <Textarea
        placeholder="Identifying Marks (tattoos, scars, etc.)"
        {...form.register("suspectIdentifyingMarks")}
      />
      <Textarea
        placeholder="Previous Arrest History"
        {...form.register("suspectArrestHistory")}
      />
      <Textarea
        placeholder="Current Charges"
        {...form.register("suspectCharges")}
      />
      <Input
        placeholder="Direction of Travel/Last Seen"
        {...form.register("suspectDirection")}
      />
      <Input
        placeholder="Parole/Probation Officer"
        {...form.register("suspectParoleOfficer")}
      />
      
      <FormField
        control={form.control}
        name="suspectWeapon"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Weapon Used/Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Handgun">Handgun</SelectItem>
                  <SelectItem value="Rifle">Rifle</SelectItem>
                  <SelectItem value="Shotgun">Shotgun</SelectItem>
                  <SelectItem value="Knife">Knife</SelectItem>
                  <SelectItem value="Blunt object">Blunt object</SelectItem>
                  <SelectItem value="Explosive">Explosive</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Chemical/Poison">Chemical/Poison</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="suspectStrongHand"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Strong/Dominant Hand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right">Right</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Ambidextrous">Ambidextrous</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="inCustody"
          {...form.register("suspectInCustody")}
        />
        <Label htmlFor="inCustody">Currently In Custody</Label>
      </div>
    </div>
  );
};

export default SuspectAdditionalInfo;
