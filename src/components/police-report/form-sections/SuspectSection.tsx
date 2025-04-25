import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { UserX } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { FingerprintScanner } from "@/components/fingerprint/FingerprintScanner";

interface SuspectSectionProps {
  form: UseFormReturn<ReportFormData>
}

const SuspectSection = ({ form }: SuspectSectionProps) => {
  // Handle fingerprint scan completion
  const handleScanComplete = (scanData: {
    scanData: string;
    position: string;
    quality: string;
    timestamp: string;
  }) => {
    // This function is now optional in FingerprintScanner props,
    // but we can use it here to perform additional actions if needed
    console.log('Fingerprint scan completed:', scanData);
  };

  return (
    <ReportSection icon={UserX} title="Suspect Information">
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
        
        {/* Gender Dropdown */}
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
        
        {/* Height Dropdown */}
        <FormField
          control={form.control}
          name="suspectHeight"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4'8'' - 4'11''">4'8'' - 4'11''</SelectItem>
                    <SelectItem value="5'0'' - 5'3''">5'0'' - 5'3''</SelectItem>
                    <SelectItem value="5'4'' - 5'7''">5'4'' - 5'7''</SelectItem>
                    <SelectItem value="5'8'' - 5'11''">5'8'' - 5'11''</SelectItem>
                    <SelectItem value="6'0'' - 6'3''">6'0'' - 6'3''</SelectItem>
                    <SelectItem value="6'4'' - 6'7''">6'4'' - 6'7''</SelectItem>
                    <SelectItem value="6'8'' and above">6'8'' and above</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Weight Dropdown */}
        <FormField
          control={form.control}
          name="suspectWeight"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under 100 lbs">Under 100 lbs</SelectItem>
                    <SelectItem value="100-120 lbs">100-120 lbs</SelectItem>
                    <SelectItem value="121-140 lbs">121-140 lbs</SelectItem>
                    <SelectItem value="141-160 lbs">141-160 lbs</SelectItem>
                    <SelectItem value="161-180 lbs">161-180 lbs</SelectItem>
                    <SelectItem value="181-200 lbs">181-200 lbs</SelectItem>
                    <SelectItem value="201-220 lbs">201-220 lbs</SelectItem>
                    <SelectItem value="221-240 lbs">221-240 lbs</SelectItem>
                    <SelectItem value="241-260 lbs">241-260 lbs</SelectItem>
                    <SelectItem value="261-280 lbs">261-280 lbs</SelectItem>
                    <SelectItem value="281-300 lbs">281-300 lbs</SelectItem>
                    <SelectItem value="Over 300 lbs">Over 300 lbs</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Hair Color Dropdown */}
        <FormField
          control={form.control}
          name="suspectHair"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Hair Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Blonde">Blonde</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Bald">Bald</SelectItem>
                    <SelectItem value="Dyed - Multiple Colors">Dyed - Multiple Colors</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Eye Color Dropdown */}
        <FormField
          control={form.control}
          name="suspectEyes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Eye Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Hazel">Hazel</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                    <SelectItem value="Amber">Amber</SelectItem>
                    <SelectItem value="Heterochromia">Heterochromia (Different Colors)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Weapon Dropdown */}
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
        
        {/* Strong/Dominant Hand Dropdown */}
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
      </div>
      
      <div className="space-y-4 mt-4">
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="inCustody"
            {...form.register("suspectInCustody")}
          />
          <Label htmlFor="inCustody">Currently In Custody</Label>
        </div>

        <div className="mt-6">
          <FingerprintScanner form={form} />
        </div>
      </div>
    </ReportSection>
  );
};

export default SuspectSection;
