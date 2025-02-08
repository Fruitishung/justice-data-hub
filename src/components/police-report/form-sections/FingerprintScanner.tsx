
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Fingerprint, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>;
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [currentFinger, setCurrentFinger] = useState<string | null>(null);
  const fingerPositions = [
    'Right Thumb',
    'Right Index',
    'Right Middle',
    'Right Ring',
    'Right Little',
    'Left Thumb',
    'Left Index',
    'Left Middle',
    'Left Ring',
    'Left Little'
  ];

  const simulateScan = async (position: string) => {
    setCurrentFinger(position);
    setScanning(true);
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock scan data (in a real implementation, this would come from a hardware device)
    const mockScanData = {
      position,
      scanData: `mock_scan_${Date.now()}`,
      quality: Math.random() * 100,
      timestamp: new Date().toISOString()
    };
    
    // Update form data
    const currentFingerprints = form.getValues('suspectFingerprints') || [];
    form.setValue('suspectFingerprints', [...currentFingerprints, mockScanData]);
    
    setScanning(false);
    setCurrentFinger(null);
  };

  const removeScan = (position: string) => {
    const currentFingerprints = form.getValues('suspectFingerprints') || [];
    form.setValue(
      'suspectFingerprints',
      currentFingerprints.filter(scan => scan.position !== position)
    );
  };

  const getScannedData = (position: string) => {
    const fingerprints = form.getValues('suspectFingerprints') || [];
    return fingerprints.find(scan => scan.position === position);
  };

  return (
    <div className="space-y-4">
      <Label>Fingerprint Scans</Label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {fingerPositions.map((position) => {
          const scanData = getScannedData(position);
          
          return (
            <Card 
              key={position}
              className="p-4 relative flex flex-col items-center justify-center gap-2"
            >
              <p className="text-sm font-medium text-center">{position}</p>
              
              {scanData ? (
                <>
                  <Fingerprint className="w-8 h-8 text-green-500" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeScan(position)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Quality: {scanData.quality.toFixed(1)}%
                  </span>
                </>
              ) : (
                <Button
                  variant="outline"
                  disabled={scanning}
                  onClick={() => simulateScan(position)}
                  className="w-full"
                >
                  {scanning && currentFinger === position ? (
                    <span>Scanning...</span>
                  ) : (
                    <span>Scan</span>
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FingerprintScanner;
