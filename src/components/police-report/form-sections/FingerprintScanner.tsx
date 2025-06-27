
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useFingerprint } from './fingerprint/useFingerprint';
import FingerprintDisplay from './fingerprint/FingerprintDisplay';
import { ReportFormData } from "../types";
import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { ScannerStatus } from '@/components/fingerprint/ScannerStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

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
  const { isScanning, currentPrint, currentPosition, scanProgress, startScan } = useFingerprint();
  const [rightIndexPrint, setRightIndexPrint] = useState<string | undefined>(undefined);
  const [leftIndexPrint, setLeftIndexPrint] = useState<string | undefined>(undefined);
  const [scannerConnected, setScannerConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastScanError, setLastScanError] = useState<string | null>(null);

  // Debug current state
  useEffect(() => {
    console.log('FingerprintScanner state:', { 
      rightIndexPrint: rightIndexPrint ? 'Has data' : 'No data', 
      leftIndexPrint: leftIndexPrint ? 'Has data' : 'No data',
      isScanning,
      currentPosition
    });
  }, [rightIndexPrint, leftIndexPrint, isScanning, currentPosition]);

  // Load existing fingerprints from form data on component mount
  useEffect(() => {
    const existingPrints = form.getValues('suspectFingerprints') || [];
    console.log('Loading existing fingerprints:', existingPrints);
    
    existingPrints.forEach(print => {
      if (print.position === 'Right Index') {
        console.log('Setting initial right index print');
        setRightIndexPrint(print.scanData);
      } else if (print.position === 'Left Index') {
        console.log('Setting initial left index print');
        setLeftIndexPrint(print.scanData);
      }
    });
  }, [form]);

  const handleScan = async (position: string, isRetry = false) => {
    try {
      console.log(`Starting scan for ${position}${isRetry ? ' (retry)' : ''}`);
      setLastScanError(null);
      
      if (!scannerConnected) {
        toast({
          title: "Scanner Not Connected",
          description: "Please check the scanner connection above",
          variant: "destructive",
        });
        return;
      }
      
      // Start the scan and get the result
      const scanResult = await startScan(position);
      console.log('Scan completed with result:', scanResult);
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Update the specific finger's print based on position
      if (position === 'Right Index') {
        console.log('Setting right index print:', scanResult.scanData.substring(0, 30) + '...');
        setRightIndexPrint(scanResult.scanData);
      } else if (position === 'Left Index') {
        console.log('Setting left index print:', scanResult.scanData.substring(0, 30) + '...');
        setLeftIndexPrint(scanResult.scanData);
      }
      
      // Store in form data if needed
      const suspectFingerprints = form.getValues('suspectFingerprints') || [];
      const updatedFingerprints = [
        ...suspectFingerprints.filter(p => p.position !== position),
        {
          position: scanResult.position,
          scanData: scanResult.scanData,
          quality: Number(scanResult.quality) || 0,
          timestamp: scanResult.timestamp
        }
      ];
      
      console.log('Updating form with fingerprints, count:', updatedFingerprints.length);
      form.setValue('suspectFingerprints', updatedFingerprints, { shouldDirty: true });
      
      // Call the onScanComplete callback if provided
      if (onScanComplete) {
        onScanComplete(scanResult);
      }
      
      toast({
        title: "Fingerprint Saved",
        description: `${position} fingerprint has been added to the report`,
      });
    } catch (error) {
      console.error('Scan failed:', error);
      const errorMessage = error.message || "Failed to capture fingerprint";
      setLastScanError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // Show different messages based on error type
      let toastTitle = "Scan Failed";
      let toastDescription = errorMessage;
      
      if (errorMessage.includes('quality too low')) {
        toastTitle = "Poor Quality Scan";
        toastDescription = "Please ensure finger is clean and properly placed on scanner";
      } else if (errorMessage.includes('timeout')) {
        toastTitle = "Scan Timeout";
        toastDescription = "Please try again and keep finger steady on scanner";
      }
      
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "destructive",
        action: retryCount < 3 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScan(position, true)}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        ) : undefined
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Status */}
      <ScannerStatus 
        onStatusChange={setScannerConnected}
        showDetails={true}
      />
      
      {/* Error Alert */}
      {lastScanError && retryCount >= 3 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Multiple scan attempts failed. Please check:
            <ul className="list-disc list-inside mt-2">
              <li>Scanner is clean and free of dust</li>
              <li>Finger is clean and dry</li>
              <li>Finger is placed flat on the scanner</li>
              <li>Scanner drivers are up to date</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Fingerprint Display Grid */}
      <div className="grid grid-cols-2 gap-4">
        <FingerprintDisplay
          imageData={rightIndexPrint}
          position="Right Index"
          isScanning={isScanning && currentPosition === 'Right Index'}
          scanProgress={scanProgress}
        />
        <FingerprintDisplay
          imageData={leftIndexPrint}
          position="Left Index"
          isScanning={isScanning && currentPosition === 'Left Index'}
          scanProgress={scanProgress}
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
