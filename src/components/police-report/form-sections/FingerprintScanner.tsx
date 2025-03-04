
import React from 'react';
import { Button } from "@/components/ui/button";
import { useFingerprint } from './fingerprint/useFingerprint';
import FingerprintDisplay from './fingerprint/FingerprintDisplay';

interface FingerprintScannerProps {
  onScanComplete: (scanData: {
    scanData: string;
    position: string;
    quality: string;
    timestamp: string;
  }) => void;
}

const FingerprintScanner = ({ onScanComplete }: FingerprintScannerProps) => {
  const { isScanning, currentPrint, currentPosition, startScan } = useFingerprint();

  const handleScan = async (position: string) => {
    try {
      const scanResult = await startScan(position);
      onScanComplete(scanResult);
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FingerprintDisplay
          imageData={currentPosition === 'Right Index' ? currentPrint || undefined : undefined}
          position="Right Index"
          isScanning={isScanning && currentPosition === 'Right Index'}
        />
        <FingerprintDisplay
          imageData={currentPosition === 'Left Index' ? currentPrint || undefined : undefined}
          position="Left Index"
          isScanning={isScanning && currentPosition === 'Left Index'}
        />
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={() => handleScan('Right Index')}
          disabled={isScanning}
          variant="outline"
        >
          Scan Right Index
        </Button>
        <Button
          onClick={() => handleScan('Left Index')}
          disabled={isScanning}
          variant="outline"
        >
          Scan Left Index
        </Button>
      </div>
    </div>
  );
};

export default FingerprintScanner;
