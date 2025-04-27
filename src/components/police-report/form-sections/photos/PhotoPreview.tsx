
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PhotoPreviewProps {
  urls: string[];
}

export const PhotoPreview = ({ urls }: PhotoPreviewProps) => {
  const { toast } = useToast();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (urls.length === 0) return null;

  const handleImageError = (url: string) => {
    console.error("Failed to load image:", url);
    setFailedImages(prev => ({ ...prev, [url]: true }));
    toast({
      title: "Image Error",
      description: "Failed to load one or more images. Please try again.",
      variant: "destructive"
    });
  };

  // Filter out failed images
  const validUrls = urls.filter(url => !failedImages[url]);

  if (validUrls.length === 0 && urls.length > 0) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-destructive/10 text-destructive">
        <h4 className="text-sm font-medium mb-2">Image Loading Error</h4>
        <p>All images failed to load. Please try generating or uploading again.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Photo Preview</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {validUrls.map((url, index) => (
          <div 
            key={url} 
            className={`w-full aspect-square border rounded-lg overflow-hidden ${index === 0 ? 'col-span-full sm:col-span-1' : ''}`}
          >
            <img 
              src={url} 
              alt={`Evidence photo ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={() => handleImageError(url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
