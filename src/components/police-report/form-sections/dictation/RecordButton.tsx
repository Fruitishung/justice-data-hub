
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export const RecordButton = ({ isRecording, onClick }: RecordButtonProps) => (
  <Button
    type="button"
    variant={isRecording ? "secondary" : "destructive"}
    size="icon"
    className={`mt-1 relative ${
      isRecording 
        ? "bg-[#F2FCE2] hover:bg-[#F2FCE2]/90" 
        : "bg-[#ea384c] hover:bg-[#ea384c]/90"
    }`}
    onClick={onClick}
  >
    {isRecording ? (
      <div className="animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
        <Mic className="h-4 w-4 text-green-600" />
      </div>
    ) : (
      <MicOff className="h-4 w-4 text-white" />
    )}
  </Button>
);
