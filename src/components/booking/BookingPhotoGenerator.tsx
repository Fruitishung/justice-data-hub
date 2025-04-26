
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BookingPhotoGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const { toast } = useToast();

  const generateMugshot = async () => {
    setIsGenerating(true);
    try {
      const testId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke(
        'generate-mugshot',
        {
          body: {
            arrest_tag_id: testId,
            photo_type: 'ai'
          }
        }
      );

      if (error) throw error;

      if (data?.mugshot_url) {
        setPhotos(prev => [...prev, data.mugshot_url]);
        toast({
          title: "Success",
          description: "Booking photo generated successfully",
        });
      }
    } catch (error) {
      console.error("Error generating photo:", error);
      toast({
        title: "Error",
        description: "Failed to generate booking photo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Booking Photos Generator</h2>
          <Button 
            onClick={generateMugshot} 
            disabled={isGenerating}
            className="gap-2"
          >
            <Camera className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate New Photo"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((url, index) => (
            <div 
              key={index}
              className="aspect-square rounded-lg overflow-hidden border bg-white"
            >
              <img 
                src={url} 
                alt={`Generated booking photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {photos.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No photos generated yet. Click the button above to generate some!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
