
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link, Mic, MicOff } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface IncidentSectionProps {
  form: UseFormReturn<ReportFormData>
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const IncidentSection = ({ form }: IncidentSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        const currentDescription = form.getValues('incidentDescription') || '';
        form.setValue('incidentDescription', currentDescription + ' ' + transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "There was an error with the speech recognition. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [form, toast]);

  const toggleRecording = () => {
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
      toast({
        title: "Recording Stopped",
        description: "Voice dictation has been stopped.",
      });
    } else {
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
          <Textarea
            placeholder="Incident Description"
            className="flex-1"
            {...form.register("incidentDescription")}
          />
          <Button
            type="button"
            variant={isRecording ? "destructive" : "secondary"}
            size="icon"
            className="mt-1"
            onClick={toggleRecording}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Link className="h-4 w-4" />
          A detailed narrative report will be linked after submission
        </p>
      </div>
    </ReportSection>
  )
}

export default IncidentSection
