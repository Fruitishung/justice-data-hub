
import { UserX } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { FingerprintScanner } from "@/components/fingerprint/FingerprintScanner"
import SuspectPersonalInfo from "./suspect/SuspectPersonalInfo"
import SuspectPhysicalDescription from "./suspect/SuspectPhysicalDescription"
import SuspectAdditionalInfo from "./suspect/SuspectAdditionalInfo"

interface SuspectSectionProps {
  form: UseFormReturn<ReportFormData>
}

const SuspectSection = ({ form }: SuspectSectionProps) => {
  return (
    <ReportSection icon={UserX} title="Suspect Information">
      <div className="space-y-6">
        <SuspectPersonalInfo form={form} />
        <SuspectPhysicalDescription form={form} />
        <SuspectAdditionalInfo form={form} />
        
        <div className="mt-6">
          <FingerprintScanner form={form} />
        </div>
      </div>
    </ReportSection>
  );
};

export default SuspectSection;
