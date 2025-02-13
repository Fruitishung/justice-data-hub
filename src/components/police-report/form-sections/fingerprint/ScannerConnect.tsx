
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Usb } from "lucide-react";

interface ScannerConnectProps {
  isConnected: boolean;
  onConnect: () => void;
}

const ScannerConnect = ({ isConnected, onConnect }: ScannerConnectProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Label>Fingerprint Scans</Label>
      <Button
        variant={isConnected ? "secondary" : "default"}
        onClick={onConnect}
        className="flex items-center gap-2"
      >
        <Usb className="w-4 h-4" />
        {isConnected ? "Scanner Connected" : "Connect Scanner"}
      </Button>
    </div>
  );
};

export default ScannerConnect;
