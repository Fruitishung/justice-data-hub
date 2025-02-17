
import { useToast } from "@/components/ui/use-toast";

export const requestMicrophonePermission = async (toast: ReturnType<typeof useToast>) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    console.log("Microphone permission granted");
    return true;
  } catch (error) {
    console.error("Microphone permission denied:", error);
    toast({
      title: "Permission Denied",
      description: "Please allow microphone access for voice dictation.",
      variant: "destructive",
    });
    return false;
  }
};

export const createSpeechRecognition = (toast: ReturnType<typeof useToast>) => {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.error("Speech recognition not supported");
    toast({
      title: "Not Supported",
      description: "Speech recognition is not supported in your browser.",
      variant: "destructive",
    });
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  return recognition;
};
