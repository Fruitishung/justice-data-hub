
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

interface IncidentSectionProps {
  form: UseFormReturn<ReportFormData>
}

const IncidentSection = ({ form }: IncidentSectionProps) => {
  const { toast } = useToast();
  const { recognition, isRecording, setIsRecording, isProcessing } = useSpeechRecognition(form);
  const { audioLevel, startVisualization, stopVisualization } = useAudioVisualization();

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
      toast({
        title: "Recording Started",
        description: "Voice dictation is now active. Speak clearly into your microphone.",
      });
    }
    
    setIsRecording(!isRecording);
  };

  return (
    <ReportSection icon={Link} title="Incident Details">
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
              className="flex-1"
              {...form.register("incidentDescription")}
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
    </ReportSection>
  );
};

export default IncidentSection;
