
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "@/components/police-report/types";
import { useFingerprint } from "@/hooks/useFingerprint";
import { ScanButton } from "./ScanButton";
import { ScanProgress } from "./ScanProgress";

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>;
}

export const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const { isScanning, scanProgress, scanError, startScan } = useFingerprint({ form });

  return (
    <div className="space-y-4">
      <ScanButton onScan={startScan} isScanning={isScanning} />
      {(isScanning || scanError) && (
        <ScanProgress progress={scanProgress} error={scanError} />
      )}
    </div>
  );
};
