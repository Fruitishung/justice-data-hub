
import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import ReportSection from "../ReportSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DictationSectionProps {
  form: UseFormReturn<ReportFormData>;
}

const DictationSection = ({ form }: DictationSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
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
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Your speech will be transcribed into the incident description field. Click the microphone to start/stop recording.
        </p>
      </div>
    </ReportSection>
  );
};

export default DictationSection;
