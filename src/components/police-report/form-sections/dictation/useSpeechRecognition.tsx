
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
  const maxTranscriptLength = 5000;
  const { toast } = useToast();

  const sanitizeText = (text: string): string => {
    if (!text) return '';
    const sanitized = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim();
    return sanitized.slice(0, maxTranscriptLength);
  };

  const correctText = async (text: string) => {
    try {
      if (!text || text.length > maxTranscriptLength) {
        throw new Error("Invalid text length");
      }

      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('correct-text', {
        body: { text: sanitizeText(text) },
      });

      if (error) throw error;
      return sanitizeText(data.correctedText);
    } catch (error) {
      console.error('Error correcting text:', error);
      toast({
        title: "Error",
        description: "Failed to correct text. Using original transcription.",
        variant: "destructive",
      });
      return sanitizeText(text);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeSpeechRecognition = async () => {
      try {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          console.error("Speech recognition not supported");
          toast({
            title: "Not Supported",
            description: "Speech recognition is not supported in your browser.",
            variant: "destructive",
          });
          return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        // Request microphone permission explicitly
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
          console.log("Microphone permission granted");
        } catch (error) {
          console.error("Microphone permission denied:", error);
          toast({
            title: "Permission Denied",
            description: "Please allow microphone access for voice dictation.",
            variant: "destructive",
          });
          return;
        }
        
        recognitionInstance.onresult = async (event: any) => {
          if (!isMounted) return;
          
          console.log("Speech recognition result received");

          try {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join(' ');
            
            console.log("Raw transcript:", transcript);
            
            const currentDescription = form.getValues('incidentDescription') || '';
            const newTranscript = sanitizeText(transcript);
            
            if ((currentDescription + newTranscript).length > maxTranscriptLength) {
              toast({
                title: "Warning",
                description: "Maximum text length reached.",
                variant: "destructive",
              });
              return;
            }

            transcriptBufferRef.current += ' ' + newTranscript;

            if (processingTimeoutRef.current) {
              clearTimeout(processingTimeoutRef.current);
            }

            processingTimeoutRef.current = setTimeout(async () => {
              if (!isMounted) return;
              
              if (transcriptBufferRef.current) {
                const correctedText = await correctText(transcriptBufferRef.current);
                console.log("Corrected text:", correctedText);
                form.setValue('incidentDescription', 
                  ((currentDescription ? currentDescription + ' ' : '') + correctedText).trim()
                );
                transcriptBufferRef.current = '';
              }
            }, 500);
          } catch (error) {
            console.error('Error processing speech result:', error);
            if (isMounted) {
              toast({
                title: "Error",
                description: "Failed to process speech. Please try again.",
                variant: "destructive",
              });
            }
          }
        };

        recognitionInstance.onerror = (event: any) => {
          if (!isMounted) return;
          console.error("Speech recognition error:", event.error);
          
          if (event.error !== 'aborted') {
            toast({
              title: "Error",
              description: "There was an error with the speech recognition. Please try again.",
              variant: "destructive",
            });
          }
          setIsRecording(false);
        };

        recognitionInstance.onend = () => {
          if (!isMounted) return;
          console.log("Speech recognition ended");
          
          if (isRecording) {
            try {
              recognitionInstance.start();
              console.log("Speech recognition restarted");
            } catch (error) {
              console.error('Error restarting recognition:', error);
              setIsRecording(false);
            }
          }
        };

        setRecognition(recognitionInstance);
        console.log("Speech recognition initialized successfully");

      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to initialize speech recognition.",
            variant: "destructive",
          });
        }
      }
    };

    initializeSpeechRecognition();

    return () => {
      isMounted = false;
      if (recognition) {
        try {
          recognition.abort();
          recognition.stop();
        } catch (error) {
          console.error('Error cleaning up recognition:', error);
        }
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [form, toast]);

  return { recognition, isRecording, setIsRecording, isProcessing };
};
