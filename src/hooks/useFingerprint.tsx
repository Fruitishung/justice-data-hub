
import { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "@/components/police-report/types";
import { toast } from "@/components/ui/use-toast";

interface UseFingerprintProps {
  form: UseFormReturn<ReportFormData>;
}

export const useFingerprint = ({ form }: UseFingerprintProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setScanError(null);
    
    try {
      // Simulate fingerprint scanning progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(i);
      }
      
      // Mock successful scan data
      const mockScanData = {
        scanData: `data:image/png;base64,${Math.random().toString(36).substring(2)}`, // Mock base64 data
        position: "Right Index", // Default position
        quality: 85, // Mock quality score
        timestamp: new Date().toISOString(),
      };
      
      // Get current fingerprints array or initialize it if empty
      const currentFingerprints = form.getValues('suspectFingerprints') || [];
      
      // Add new fingerprint scan to the array
      form.setValue('suspectFingerprints', [...currentFingerprints, mockScanData]);
      
      toast({
        title: "Scan Complete",
        description: "Fingerprint scan completed successfully",
      });
      
      return mockScanData; // Return the scan data for further processing if needed
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan fingerprint';
      setScanError(errorMessage);
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  return {
    isScanning,
    scanProgress,
    scanError,
    startScan,
  };
};
