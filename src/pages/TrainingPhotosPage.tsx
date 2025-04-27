
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TrainingPhotosPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const generatePhoto = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mugshot", {
        body: {
          arrest_tag_id: crypto.randomUUID(),
          photo_type: "training"
        },
      });

      if (error) throw error;

      if (data?.mugshot_url) {
        setPhotos(prev => [...prev, data.mugshot_url]);
        toast.success("Training photo generated successfully");
      }
    } catch (error) {
      console.error("Error generating photo:", error);
      toast.error("Failed to generate photo");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/mock-data" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Training Data
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Training Photo Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage photos for training purposes
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated Photos</h2>
              <Button 
                onClick={generatePhoto} 
                disabled={isGenerating}
              >
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
                    alt={`Generated photo ${index + 1}`}
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
      </div>
    </div>
  );
};

export default TrainingPhotosPage;
