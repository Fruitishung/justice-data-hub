
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
  disabled?: boolean;
}

export const GeneratePhotoButton = ({ form, onPhotoGenerated, disabled }: GeneratePhotoButtonProps) => {
  const { isGenerating, generatePhoto } = usePhotoGeneration();
  const { toast } = useToast();

  const generateAIPhoto = async () => {
    try {
      const imageUrl = await generatePhoto();
      
      if (imageUrl) {
        onPhotoGenerated(imageUrl);
        
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
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isGenerating}
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Generate Photo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={generateAIPhoto}>
          <Wand2 className="mr-2 h-4 w-4" /> AI-Generated Photo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
