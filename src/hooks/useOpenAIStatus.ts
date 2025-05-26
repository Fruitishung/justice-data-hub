
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface OpenAIStatus {
  isConfigured: boolean;
  hasValidKey: boolean;
  hasBilling: boolean;
  hasQuota: boolean;
  canGenerateImages: boolean;
  errors: string[];
  details: any;
}

export const useOpenAIStatus = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<OpenAIStatus | null>(null);
  const { toast } = useToast();

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      console.log("Checking OpenAI status...");
      
      const { data, error } = await supabase.functions.invoke('check-openai-status', {
        body: {}
      });

      if (error) {
        console.error("Error checking OpenAI status:", error);
        throw new Error(`Status check failed: ${error.message}`);
      }

      console.log("OpenAI status check result:", data);
      setStatus(data);

      // Show appropriate toast based on status
      if (data.canGenerateImages) {
        toast({
          title: "OpenAI Setup Complete",
          description: "Your OpenAI configuration is working correctly and ready to generate images.",
        });
      } else if (data.hasValidKey && !data.hasBilling) {
        toast({
          title: "Billing Required",
          description: "Your API key is valid but billing needs to be set up to generate images.",
          variant: "destructive",
        });
      } else if (!data.hasValidKey) {
        toast({
          title: "Invalid API Key",
          description: "Please check your OpenAI API key configuration.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Configuration Issue",
          description: data.errors.join(" "),
          variant: "destructive",
        });
      }

      return data;
    } catch (error) {
      console.error('Error checking OpenAI status:', error);
      toast({
        title: "Status Check Failed",
        description: `Failed to check OpenAI status: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsChecking(false);
    }
  }, [toast]);

  return {
    status,
    isChecking,
    checkStatus
  };
};
