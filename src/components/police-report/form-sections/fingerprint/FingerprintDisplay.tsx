
import React from 'react';
import { Card } from "@/components/ui/card";

interface FingerprintDisplayProps {
  imageData?: string;
  position: string;
  isScanning: boolean;
}

const FingerprintDisplay = ({ imageData, position, isScanning }: FingerprintDisplayProps) => {
  return (
    <Card className="p-4 relative">
      <div className="text-sm font-medium mb-2">{position}</div>
      <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden relative ${isScanning ? 'animate-pulse' : ''}`}>
        {imageData ? (
          <img 
            src={imageData} 
            alt={`Fingerprint ${position}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No print
          </div>
        )}
      </div>
    </Card>
  );
};

export default FingerprintDisplay;
