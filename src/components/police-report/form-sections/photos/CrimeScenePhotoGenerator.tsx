
import React, { useState } from "react";
import { Camera, Wand2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CrimeScenePhotoGeneratorProps {
  incidentReportId?: string;
  onPhotoGenerated?: (imageUrl: string) => void;
  disabled?: boolean;
}

export const CrimeScenePhotoGenerator = ({ 
  incidentReportId, 
  onPhotoGenerated,
  disabled 
}: CrimeScenePhotoGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [lastGeneratedImage, setLastGeneratedImage] = useState<string | null>(null);
  const [generationDetails, setGenerationDetails] = useState<any>(null);
  const { toast } = useToast();

  const generateCrimeScenePhoto = async (photoType: 'ai' | 'manual') => {
    if (!incidentReportId) {
      toast({
        title: "Error",
        description: "No incident report ID available for photo generation",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating crime scene photo:', { incidentReportId, photoType, customPrompt });

      const requestBody = {
        incident_report_id: incidentReportId,
        photo_type: photoType,
        ...(customPrompt.trim() && { custom_prompt: customPrompt.trim() })
      };

      const { data, error } = await supabase.functions.invoke('generate-crime-scene', {
        body: requestBody
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      console.log('Crime scene photo generated successfully:', data);

      if (data.image_url) {
        setLastGeneratedImage(data.image_url);
        setGenerationDetails(data);
        onPhotoGenerated?.(data.image_url);

        toast({
          title: "Success",
          description: `${photoType === 'ai' ? 'AI-generated' : 'Manual'} crime scene photo created successfully`,
        });
      } else if (photoType === 'manual') {
        toast({
          title: "Manual Photo Slot Created",
          description: "A slot for manual photo upload has been created. Please upload your crime scene photo.",
        });
      }

    } catch (error) {
      console.error('Error generating crime scene photo:', error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate crime scene photo: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => generateCrimeScenePhoto('manual')}
          disabled={disabled || isGenerating}
          variant="outline"
          className="flex-1"
        >
          <Camera className="mr-2 h-4 w-4" />
          Create Manual Photo Slot
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={disabled || isGenerating}
              variant="outline"
              className="flex-1"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate AI Photo"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate AI Crime Scene Photo</DialogTitle>
              <DialogDescription>
                Generate a realistic crime scene photo based on the incident details. 
                You can optionally provide a custom prompt for more specific results.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-prompt">Custom Prompt (Optional)</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="Describe specific details you want in the crime scene photo..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  AI photos are generated based on incident details and are for training/simulation purposes only.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => generateCrimeScenePhoto('ai')}
                disabled={isGenerating}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate AI Photo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lastGeneratedImage && (
        <div className="space-y-2">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Latest crime scene photo generated successfully
            </AlertDescription>
          </Alert>
          
          <div className="relative">
            <img
              src={lastGeneratedImage}
              alt="Generated crime scene photo"
              className="w-full h-48 object-cover rounded-lg border"
              onError={(e) => {
                console.error('Error loading generated image');
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {generationDetails && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Case Type:</strong> {generationDetails.incident_details?.case_type}</p>
              <p><strong>Location:</strong> {generationDetails.incident_details?.location}</p>
              {generationDetails.prompt_used && (
                <details className="mt-2">
                  <summary className="cursor-pointer hover:text-primary">View AI Prompt</summary>
                  <p className="mt-1 text-xs bg-muted p-2 rounded">{generationDetails.prompt_used}</p>
                </details>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
