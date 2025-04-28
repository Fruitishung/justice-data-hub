
import React, { useState, useEffect } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { usePhotoGeneration } from "@/hooks/usePhotoGeneration";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { useToast } from "@/hooks/use-toast";

interface GeneratePhotoButtonProps {
  form: UseFormReturn<ReportFormData>;
  onPhotoGenerated: (url: string) => void;
  onGeneratingStateChange?: (isGenerating: boolean) => void;
  disabled?: boolean;
}

export const GeneratePhotoButton = ({ 
  form, 
  onPhotoGenerated, 
  onGeneratingStateChange,
  disabled 
}: GeneratePhotoButtonProps) => {
  const { isGenerating, generatePhoto } = usePhotoGeneration();
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Update parent component with generation state
  useEffect(() => {
    if (onGeneratingStateChange) {
      onGeneratingStateChange(isGenerating);
    }
  }, [isGenerating, onGeneratingStateChange]);

  const generateAIPhoto = async () => {
    try {
      toast({
        title: "Generating Photo",
        description: "Please wait while your AI photo is being generated..."
      });
      
      const testId = crypto.randomUUID();
      console.log("Generating AI photo with test ID:", testId);
      
      const imageUrl = await generatePhoto(testId, 'ai', {
        gender: form.getValues('suspectGender') || undefined,
        height: form.getValues('suspectHeight') || undefined,
        weight: form.getValues('suspectWeight') || undefined,
        hair: form.getValues('suspectHair') || undefined,
        eyes: form.getValues('suspectEyes') || undefined
      });
      
      if (imageUrl) {
        console.log("AI photo generated, URL:", imageUrl);
        
        // Add the generated URL to the preview
        onPhotoGenerated(imageUrl);
        
        // Save to form data for submission
        const currentPhotos = form.getValues('evidencePhotos') || [];
        form.setValue('evidencePhotos', [...currentPhotos, {
          path: imageUrl,
          uploaded_at: new Date().toISOString()
        }]);
        
        toast({
          title: "AI Photo Generated",
          description: "An AI-generated photo has been added to your evidence photos."
        });
      }
    } catch (error) {
      console.error('Error generating AI photo:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI photo. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isGenerating}
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Photo"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            generateAIPhoto();
          }}
          disabled={isGenerating}
        >
          <Wand2 className="mr-2 h-4 w-4" /> 
          AI-Generated Photo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
