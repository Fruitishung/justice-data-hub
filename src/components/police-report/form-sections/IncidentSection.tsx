
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
      toast({
        title: "Recording Started",
        description: "Voice dictation is now active. Speak clearly into your microphone.",
      });
    }
    
    setIsRecording(!isRecording);
  };

  const handleDescriptionFocus = () => {
    setShowTemplate(true);
  };

  const caseNumber = form.watch("caseNumber");

  return (
    <ReportSection icon={Link} title="Incident Details">
      <div className="space-y-6">
        <CaseNumberDisplay caseNumber={caseNumber} />
        
        {showTemplate && (
          <Alert className="bg-muted/50">
            <AlertDescription className="text-xs text-muted-foreground">
              Template Example:<br />
              On [DATE] at approximately [TIME] hours while [ASSIGNMENT/PATROL STATUS], 
              I observed [INITIAL OBSERVATION/SUSPICIOUS BEHAVIOR]. 
              The incident occurred at [LOCATION]. [DESCRIBE PROBABLE CAUSE FOR CONTACT].
            </AlertDescription>
          </Alert>
        )}

        <Input
          type="datetime-local"
          placeholder="Incident Date & Time"
          {...form.register("incidentDate")}
        />
        
        <div className="space-y-2">
          <div className="flex items-start gap-4">
            <div className="relative flex-1">
              <Textarea
                placeholder="Incident Description"
                className="flex-1 min-h-[200px]"
                {...form.register("incidentDescription")}
                onFocus={handleDescriptionFocus}
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
