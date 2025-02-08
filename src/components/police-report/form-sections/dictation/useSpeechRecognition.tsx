
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useSpeechRecognition = (form: UseFormReturn<ReportFormData>) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptBufferRef = useRef<string>('');
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
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
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          
          const currentDescription = form.getValues('incidentDescription') || '';
          transcriptBufferRef.current += ' ' + transcript;

          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
          }

          processingTimeoutRef.current = setTimeout(async () => {
            if (transcriptBufferRef.current) {
              const correctedText = await correctText(transcriptBufferRef.current);
              form.setValue('incidentDescription', 
                ((currentDescription ? currentDescription + ' ' : '') + correctedText).trim()
              );
              transcriptBufferRef.current = '';
            }
          }, 500);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          toast({
            title: "Error",
            description: "There was an error with the speech recognition. Please try again.",
            variant: "destructive",
          });
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          if (isRecording) {
            recognitionInstance.start();
          }
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
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [form, toast, isRecording, recognition]);

  return { recognition, isRecording, setIsRecording, isProcessing };
};
