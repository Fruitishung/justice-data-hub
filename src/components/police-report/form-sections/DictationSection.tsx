
import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { Button } from "@/components/ui/button";

interface DictationSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const DictationSection = ({ form }: DictationSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Microphone functionality will be implemented later
  };

  return (
    <ReportSection icon={Mic} title="Voice Dictation">
      <div className="flex flex-col items-center gap-4">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="rounded-full p-8"
          onClick={toggleRecording}
        >
          {isRecording ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          {isRecording ? "Click to stop recording" : "Click to start recording"}
        </p>
      </div>
    </ReportSection>
  );
};

export default DictationSection;
