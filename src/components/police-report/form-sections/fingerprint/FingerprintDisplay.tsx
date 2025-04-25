
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Fingerprint } from "lucide-react";

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
  // Debug when image data is received or changes
  useEffect(() => {
    console.log(`FingerprintDisplay (${position}): imageData:`, imageData ? `${imageData.substring(0, 30)}...` : 'null');
  }, [imageData, position]);

  return (
    <Card className="p-4 relative">
      <div className="text-sm font-medium mb-2">{position}</div>
      <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${isScanning ? 'bg-gray-200' : ''}`}>
        {imageData ? (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={imageData} 
              alt={`Fingerprint ${position}`}
              className="max-h-full max-w-full object-contain"
              onError={(e) => console.error(`Image load error for ${position}:`, e)}
              onLoad={() => console.log(`Image loaded successfully for ${position}`)}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            {isScanning ? 'Scanning...' : (
              <Fingerprint className="w-12 h-12 text-gray-300" />
            )}
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
