
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Fingerprint, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AITestingPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ type: string; url: string }>>([]);
  const { toast } = useToast();

  const generateImage = async (type: 'mugshot' | 'crime-scene' | 'fingerprint') => {
    setIsGenerating(true);
    try {
      // Create a temporary test ID
      const testId = crypto.randomUUID();

      let endpoint = '';
      let requestBody = {};
      
      if (type === 'mugshot') {
        endpoint = 'generate-mugshot';
        requestBody = {
          arrest_tag_id: testId,
          photo_type: 'ai'
        };
      } else if (type === 'crime-scene') {
        endpoint = 'generate-crime-scene';
        requestBody = {
          incident_report_id: testId,
          photo_type: 'ai'
        };
      } else if (type === 'fingerprint') {
        endpoint = 'generate-fingerprint';
        requestBody = {
          scan_id: testId,
          finger_position: 'right-index',
          is_simulated: true
        };
      }

      const { data, error } = await supabase.functions.invoke(
        endpoint,
        { body: requestBody }
      );

      if (error) throw error;

      let imageUrl = '';
      if (type === 'mugshot') {
        imageUrl = data?.mugshot_url;
      } else if (type === 'crime-scene') {
        imageUrl = data?.image_url;
      } else if (type === 'fingerprint') {
        imageUrl = data?.fingerprint_url;
      }
      
      if (imageUrl) {
        setGeneratedImages(prev => [...prev, { type, url: imageUrl }]);
        toast({
          title: "Success",
          description: `${type === 'mugshot' ? 'Mugshot' : type === 'crime-scene' ? 'Crime scene photo' : 'Fingerprint'} generated successfully`
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

  const simulateFingerprintScan = async () => {
    setIsGenerating(true);
    try {
      const testId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke(
        'generate-fingerprint',
        {
          body: {
            scan_id: testId,
            finger_position: 'right-index',
            is_simulated: false // This indicates a simulated real scan
          }
        }
      );

      if (error) throw error;

      if (data?.fingerprint_url) {
        setGeneratedImages(prev => [...prev, { type: 'fingerprint-scan', url: data.fingerprint_url }]);
        toast({
          title: "Scan Complete",
          description: "Fingerprint successfully scanned"
        });
      }
    } catch (error) {
      console.error("Error scanning fingerprint:", error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan fingerprint. Please try again.",
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
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => generateImage('mugshot')} 
                disabled={isGenerating}
              >
                <Image className="mr-2 h-4 w-4" />
                Generate Mugshot
              </Button>
              <Button 
                onClick={() => generateImage('crime-scene')} 
                disabled={isGenerating}
              >
                <Image className="mr-2 h-4 w-4" />
                Generate Crime Scene
              </Button>
              <Button 
                onClick={() => generateImage('fingerprint')} 
                disabled={isGenerating}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Generate AI Fingerprint
              </Button>
              <Button 
                onClick={simulateFingerprintScan} 
                disabled={isGenerating}
                variant="secondary"
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                Simulate Real Scan
              </Button>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">
                    {image.type === 'mugshot' ? 'Generated Mugshot' : 
                     image.type === 'crime-scene' ? 'Generated Crime Scene' :
                     image.type === 'fingerprint' ? 'AI Fingerprint' : 'Scanned Fingerprint'}
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
