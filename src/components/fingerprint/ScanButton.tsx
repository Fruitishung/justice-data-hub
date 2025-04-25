
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";

interface ScanButtonProps {
  onScan: () => void;
  isScanning: boolean;
}

export const ScanButton = ({ onScan, isScanning }: ScanButtonProps) => {
  return (
    <Button
      onClick={onScan}
      disabled={isScanning}
      className="w-full sm:w-auto"
      variant="secondary"
    >
      <Fingerprint className="mr-2 h-4 w-4" />
      {isScanning ? "Scanning..." : "Start Fingerprint Scan"}
    </Button>
  );
};
