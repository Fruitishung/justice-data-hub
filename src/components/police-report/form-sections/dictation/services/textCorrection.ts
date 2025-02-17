
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { sanitizeText } from "../utils/textProcessing";

export const correctText = async (
  text: string,
  maxLength: number
): Promise<string> => {
  try {
    if (!text || text.length > maxLength) {
      throw new Error("Invalid text length");
    }

    const { data, error } = await supabase.functions.invoke('correct-text', {
      body: { text: sanitizeText(text, maxLength) },
    });

    if (error) throw error;
    return sanitizeText(data.correctedText, maxLength);
  } catch (error) {
    console.error('Error correcting text:', error);
    toast({
      title: "Error",
      description: "Failed to correct text. Using original transcription.",
      variant: "destructive",
    });
    return sanitizeText(text, maxLength);
  }
};
