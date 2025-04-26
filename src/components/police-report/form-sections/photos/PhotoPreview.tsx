
import { useToast } from "@/hooks/use-toast";

interface PhotoPreviewProps {
  urls: string[];
}

export const PhotoPreview = ({ urls }: PhotoPreviewProps) => {
  const { toast } = useToast();

  if (urls.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Photo Preview</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {urls.map((url, index) => (
          <div 
            key={url} 
            className={`w-full aspect-square border rounded-lg overflow-hidden ${index === 0 ? 'col-span-full sm:col-span-1' : ''}`}
          >
            <img 
              src={url} 
              alt={`Evidence photo ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={() => {
                toast({
                  title: "Image Error",
                  description: "Failed to load image. Please try again.",
                  variant: "destructive"
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
