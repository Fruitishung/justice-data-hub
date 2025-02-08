
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface RecordButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export const RecordButton = ({ isRecording, onClick }: RecordButtonProps) => (
  <Button
    type="button"
    variant={isRecording ? "destructive" : "secondary"}
    size="icon"
    className="mt-1"
    onClick={onClick}
  >
    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
  </Button>
);
