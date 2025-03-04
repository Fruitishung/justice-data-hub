import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { UserX } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { Label } from "@/components/ui/label"
import FingerprintScanner from "./FingerprintScanner"

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
        <Input
          placeholder="Gender"
          {...form.register("suspectGender")}
        />
        <Input
          placeholder="Height"
          {...form.register("suspectHeight")}
        />
        <Input
          placeholder="Weight"
          {...form.register("suspectWeight")}
        />
        <Input
          placeholder="Hair Color"
          {...form.register("suspectHair")}
        />
        <Input
          placeholder="Eye Color"
          {...form.register("suspectEyes")}
        />
        <Input
          placeholder="Weapon Used/Type"
          {...form.register("suspectWeapon")}
        />
        <Input
          placeholder="Strong/Dominant Hand"
          {...form.register("suspectStrongHand")}
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
          <FingerprintScanner 
            form={form}
            onScanComplete={handleScanComplete}
          />
        </div>
      </div>
    </ReportSection>
  )
}

export default SuspectSection
