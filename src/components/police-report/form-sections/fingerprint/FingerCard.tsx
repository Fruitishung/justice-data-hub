
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fingerprint, X } from "lucide-react";

interface FingerCardProps {
  position: string;
  scanData?: {
    position: string;
    scanData: string;
    quality: number;
    timestamp: string;
  };
  onScan: (position: string) => void;
  onRemove: (position: string) => void;
  scanning: boolean;
  analyzing: boolean;
  isCurrentFinger: boolean;
  isConnected: boolean;
}

const FingerCard = ({
  position,
  scanData,
  onScan,
  onRemove,
  scanning,
  analyzing,
  isCurrentFinger,
  isConnected,
}: FingerCardProps) => {
  return (
    <Card className="p-4 relative flex flex-col items-center justify-center gap-2">
      <p className="text-sm font-medium text-center">{position}</p>
      
      {scanData ? (
        <>
          <Fingerprint className="w-8 h-8 text-green-500" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1"
            onClick={() => onRemove(position)}
          >
            <X className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Quality: {scanData.quality.toFixed(1)}%
          </span>
        </>
      ) : (
        <Button
          variant="outline"
          disabled={scanning || analyzing || !isConnected}
          onClick={() => onScan(position)}
          className="w-full"
        >
          {scanning && isCurrentFinger ? (
            <span>Scanning...</span>
          ) : analyzing ? (
            <span>Analyzing...</span>
          ) : (
            <span>Scan</span>
          )}
        </Button>
      )}
    </Card>
  );
};

export default FingerCard;
