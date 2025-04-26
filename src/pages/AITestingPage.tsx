
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AITestingPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ type: string; url: string }>>([]);
  const { toast } = useToast();

  const generateImage = async (type: 'mugshot' | 'crime-scene') => {
    setIsGenerating(true);
    try {
      // Create a temporary test ID
      const testId = crypto.randomUUID();

      const { data, error } = await supabase.functions.invoke(
        type === 'mugshot' ? 'generate-mugshot' : 'generate-crime-scene',
        {
          body: {
            arrest_tag_id: type === 'mugshot' ? testId : undefined,
            incident_report_id: type === 'crime-scene' ? testId : undefined,
            photo_type: 'ai'
          }
        }
      );

      if (error) throw error;

      const imageUrl = type === 'mugshot' ? data?.mugshot_url : data?.image_url;
      
      if (imageUrl) {
        setGeneratedImages(prev => [...prev, { type, url: imageUrl }]);
        toast({
          title: "Success",
          description: `${type === 'mugshot' ? 'Mugshot' : 'Crime scene photo'} generated successfully`
        });
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate ${type}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">AI Generation Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test various AI generation features
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button 
                onClick={() => generateImage('mugshot')} 
                disabled={isGenerating}
              >
                Generate Mugshot
              </Button>
              <Button 
                onClick={() => generateImage('crime-scene')} 
                disabled={isGenerating}
              >
                Generate Crime Scene
              </Button>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">
                    {image.type === 'mugshot' ? 'Generated Mugshot' : 'Generated Crime Scene'}
                  </h3>
                  <div className="aspect-square rounded-lg overflow-hidden border bg-white">
                    <img 
                      src={image.url} 
                      alt={`Generated ${image.type}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AITestingPage;
