
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link, Mic, MicOff } from "lucide-react"
import ReportSection from "../ReportSection"
import { UseFormReturn } from "react-hook-form"
import { ReportFormData } from "../types"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface IncidentSectionProps {
  form: UseFormReturn<ReportFormData>
}

const IncidentSection = ({ form }: IncidentSectionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const animationFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const { toast } = useToast();

  const correctText = async (text: string) => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('correct-text', {
        body: { text },
      });

      if (error) throw error;
      return data.correctedText;
    } catch (error) {
      console.error('Error correcting text:', error);
      toast({
        title: "Error",
        description: "Failed to correct text. Using original transcription.",
        variant: "destructive",
      });
      return text;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          
          const currentDescription = form.getValues('incidentDescription') || '';
          
          // Only send for correction if it's a final result
          if (event.results[event.results.length - 1].isFinal) {
            const correctedText = await correctText(transcript);
            form.setValue('incidentDescription', (currentDescription + ' ' + correctedText).trim());
          } else {
            // Show interim results immediately
            form.setValue('incidentDescription', (currentDescription + ' ' + transcript).trim());
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Error",
            description: "There was an error with the speech recognition. Please try again.",
            variant: "destructive",
          });
          setIsRecording(false);
          stopVisualization();
        };

        setRecognition(recognitionInstance);
      } else {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      stopVisualization();
    };
  }, [form, toast]);

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const updateVisualization = () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(Math.min(average / 128, 1));
        
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };

      updateVisualization();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    setAudioLevel(0);
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
            {isRecording && (
              <div className="w-1 h-20 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="w-full bg-[#0EA5E9] transition-all duration-100 rounded-full"
                  style={{
                    height: `${audioLevel * 100}%`,
                    opacity: 0.8 + (audioLevel * 0.2),
                  }}
                />
              </div>
            )}
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
