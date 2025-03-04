
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FingerprintDisplayProps {
  imageData?: string;
  position: string;
  isScanning: boolean;
  scanProgress?: number;
}

const FingerprintDisplay = ({ 
  imageData, 
  position, 
  isScanning, 
  scanProgress = 0 
}: FingerprintDisplayProps) => {
  // Log when image data is received
  useEffect(() => {
    if (imageData) {
      console.log(`FingerprintDisplay: Image data received for ${position}`);
    }
  }, [imageData, position]);

  return (
    <Card className="p-4 relative">
      <div className="text-sm font-medium mb-2">{position}</div>
      <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${isScanning ? 'bg-gray-200' : ''}`}>
        {imageData ? (
          <img 
            src={imageData} 
            alt={`Fingerprint ${position}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {isScanning ? 'Scanning...' : 'No print'}
          </div>
        )}
        
        {isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
            <div className="animate-pulse text-sm font-medium text-white bg-black/50 px-2 py-1 rounded">
              Scanning...
            </div>
            <div className="w-3/4 mt-2">
              <Progress value={scanProgress} className="h-2" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FingerprintDisplay;
