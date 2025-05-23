
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useToast } from "@/components/ui/use-toast"
import { useSpeechRecognition } from "./dictation/useSpeechRecognition"
import { useAudioVisualization } from "./dictation/useAudioVisualization"
import { RecordButton } from "./dictation/RecordButton"
import { AudioVisualizer } from "./dictation/AudioVisualizer"
import CaseNumberDisplay from "./CaseNumberDisplay"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

interface IncidentSectionProps {
  form: UseFormReturn<ReportFormData>
}

const IncidentSection = ({ form }: IncidentSectionProps) => {
  const { toast } = useToast();
  const { recognition, isRecording, setIsRecording, isProcessing } = useSpeechRecognition(form);
  const { audioLevel, startVisualization, stopVisualization } = useAudioVisualization();
  const [showTemplate, setShowTemplate] = useState(false);

  const handleFocus = () => {
    setShowTemplate(true);
    const currentValue = form.getValues("incidentDescription");
    if (!currentValue) {
      form.setValue("incidentDescription", 
        "Source of Activity:\n" +
        "(How did this incident come to your attention? e.g., dispatch call, on-view, citizen report)\n\n" +
        "Investigation:\n" +
        "(Detail your investigative steps, interviews conducted, evidence collected)\n\n" +
        "Location:\n" +
        "(Specific address or location details)\n\n" +
        "Time:\n" +
        "(Time and date of the incident)\n\n" +
        "Initial Observation:\n" +
        "(What did you first observe upon arrival?)\n\n" +
        "Probable Cause:\n" +
        "(Facts that established probable cause)\n\n" +
        "Actions Taken:\n" +
        "(What actions did you take in response?)\n\n" +
        "Conclusions/Deductions:\n" +
        "(Based on evidence and investigation, what conclusions were drawn?)\n\n" +
        "Disposition:\n" +
        "(Final outcome, charges filed, pending follow-up, case status)\n\n"
      );
    }
  };

  const toggleRecording = async () => {
    if (!recognition) {
      toast({
        title: "Not Available",
        description: "Speech recognition is not available.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      stopVisualization();
      toast({
        title: "Recording Stopped",
        description: "Voice dictation has been stopped.",
      });
    } else {
      await startVisualization();
      recognition.start();
      setShowTemplate(true);
      handleFocus(); // Add template when starting dictation
      toast({
        title: "Recording Started",
        description: "Voice dictation is now active. Speak clearly into your microphone.",
      });
    }
    
    setIsRecording(!isRecording);
  };

  const caseNumber = form.watch("caseNumber");

  return (
    <ReportSection icon={Link} title="Incident Details">
      <div className="space-y-6">
        <CaseNumberDisplay caseNumber={caseNumber} />

        <Input
          type="datetime-local"
          placeholder="Incident Date & Time"
          {...form.register("incidentDate")}
        />
        
        <div className="space-y-2">
          <div className="flex items-start gap-4">
            <div className="relative flex-1">
              <Textarea
                placeholder="Click or start dictation to show template"
                className="flex-1 min-h-[300px] font-mono"
                {...form.register("incidentDescription")}
                onFocus={handleFocus}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center rounded-md">
                  <div className="text-sm text-muted-foreground">Processing...</div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <RecordButton isRecording={isRecording} onClick={toggleRecording} />
              {isRecording && <AudioVisualizer audioLevel={audioLevel} />}
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Link className="h-4 w-4" />
            A detailed narrative report will be linked after submission
          </p>
        </div>
      </div>
    </ReportSection>
  );
};

export default IncidentSection;
