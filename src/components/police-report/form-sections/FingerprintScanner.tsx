
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useFingerprint } from './fingerprint/useFingerprint';
import FingerprintDisplay from './fingerprint/FingerprintDisplay';
import { ReportFormData } from "../types";
import { UseFormReturn } from "react-hook-form";

interface FingerprintScannerProps {
  onScanComplete?: (scanData: {
    scanData: string;
    position: string;
    quality: string;
    timestamp: string;
  }) => void;
  form: UseFormReturn<ReportFormData>;
}

const FingerprintScanner = ({ onScanComplete, form }: FingerprintScannerProps) => {
  const { isScanning, currentPrint, currentPosition, startScan } = useFingerprint();
  const [rightIndexPrint, setRightIndexPrint] = useState<string | undefined>(undefined);
  const [leftIndexPrint, setLeftIndexPrint] = useState<string | undefined>(undefined);

  const handleScan = async (position: string) => {
    try {
      const scanResult = await startScan(position);
      
      // Update the specific finger's print based on position
      if (position === 'Right Index') {
        setRightIndexPrint(scanResult.scanData);
      } else if (position === 'Left Index') {
        setLeftIndexPrint(scanResult.scanData);
      }
      
      // Store in form data if needed
      const suspectFingerprints = form.getValues('suspectFingerprints') || [];
      form.setValue('suspectFingerprints', [
        ...suspectFingerprints.filter(p => p.position !== position),
        {
          position: scanResult.position,
          scanData: scanResult.scanData,
          quality: Number(scanResult.quality) || 0,
          timestamp: scanResult.timestamp
        }
      ]);
      
      // Call the onScanComplete callback if provided
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FingerprintDisplay
          imageData={rightIndexPrint || (currentPosition === 'Right Index' ? currentPrint || undefined : undefined)}
          position="Right Index"
          isScanning={isScanning && currentPosition === 'Right Index'}
        />
        <FingerprintDisplay
          imageData={leftIndexPrint || (currentPosition === 'Left Index' ? currentPrint || undefined : undefined)}
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
