
import { useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { toast } from "@/hooks/use-toast";
import { sanitizeText } from "./utils/textProcessing";
import { correctText } from "./services/textCorrection";
import { createSpeechRecognition, requestMicrophonePermission } from "./utils/initializeSpeechRecognition";

export const useSpeechRecognition = (form: UseFormReturn<ReportFormData>) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const transcriptBufferRef = useRef<string>('');
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
  const maxTranscriptLength = 5000;

  const startRecognition = async (recognitionInstance: SpeechRecognition) => {
    try {
      await recognitionInstance.start();
      console.log("Speech recognition started successfully");
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    let currentRecognition: SpeechRecognition | null = null;

    const initializeSpeechRecognition = async () => {
      try {
        const hasMicPermission = await requestMicrophonePermission();
        if (!hasMicPermission) return;

        const recognitionInstance = createSpeechRecognition();
        if (!recognitionInstance) return;
        
        recognitionInstance.onresult = async (event: SpeechRecognitionEvent) => {
          if (!isMounted) return;
          
          try {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                finalTranscript += result[0].transcript;
              } else {
                interimTranscript += result[0].transcript;
              }
            }
            
            console.log("Final transcript:", finalTranscript);
            console.log("Interim transcript:", interimTranscript);
            
            if (finalTranscript) {
              const currentDescription = form.getValues('incidentDescription') || '';
              const newTranscript = sanitizeText(finalTranscript, maxTranscriptLength);
              
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
                  setIsProcessing(true);
                  const correctedText = await correctText(
                    transcriptBufferRef.current,
                    maxTranscriptLength
                  );
                  console.log("Corrected text:", correctedText);
                  form.setValue('incidentDescription', 
                    ((currentDescription ? currentDescription + ' ' : '') + correctedText).trim()
                  );
                  transcriptBufferRef.current = '';
                  setIsProcessing(false);
                }
              }, 1000);
            }
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

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (!isMounted) return;
          console.error("Speech recognition error:", event.error);
          
          if (event.error === 'no-speech') {
            console.log("No speech detected");
            return;
          }
          
          if (event.error !== 'aborted') {
            toast({
              title: "Error",
              description: "There was an error with the speech recognition. Please try again.",
              variant: "destructive",
            });
            setIsRecording(false);
          }
        };

        recognitionInstance.onend = () => {
          if (!isMounted) return;
          console.log("Speech recognition ended");
          
          if (isRecording && currentRecognition) {
            console.log("Attempting to restart speech recognition");
            startRecognition(currentRecognition);
          } else {
            setIsRecording(false);
          }
        };

        currentRecognition = recognitionInstance;
        setRecognition(recognitionInstance);
        console.log("Speech recognition initialized successfully");

        if (isRecording) {
          startRecognition(recognitionInstance);
        }

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
      if (currentRecognition) {
        try {
          currentRecognition.abort();
          currentRecognition.stop();
        } catch (error) {
          console.error('Error cleaning up recognition:', error);
        }
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [form, isRecording]);

  return { recognition, isRecording, setIsRecording, isProcessing };
};
