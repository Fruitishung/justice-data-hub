
import React from "react";

interface PhotoGridProps {
  photos: string[];
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  return (
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
            onError={(e) => {
              console.error("Failed to load image:", url);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      ))}
      {photos.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No photos generated yet. Click the button above to generate some!
        </div>
      )}
    </div>
  );
};
