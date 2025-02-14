
import { useState } from 'react';
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../../types";
import { useToast } from "@/components/ui/use-toast";
import { scannerUtils } from "@/utils/fingerprintScanner";
import { supabase } from "@/integrations/supabase/client";

interface BiometricMatch {
  id: string;
  name: string;
  similarity: number;
  matchedFingerPosition: string;
  patternType?: string;
  ridgeCount?: number;
  whorlPattern?: string;
  handDominance?: string;
}

export const useFingerprint = (form: UseFormReturn<ReportFormData>) => {
  const [scanning, setScanning] = useState(false);
  const [currentFinger, setCurrentFinger] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matches, setMatches] = useState<BiometricMatch[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const connectScanner = async () => {
    try {
      const connected = await scannerUtils.connect();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "Scanner Connected",
          description: "Fingerprint scanner is ready to use.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to fingerprint scanner.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Scanner connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to scanner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const analyzeFingerprint = async (scanData: {
    position: string;
    scanData: string;
    quality: number;
    timestamp: string;
  }) => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-fingerprints', {
        body: { fingerprint: scanData }
      });

      if (error) throw error;

      const biometricMatches = await Promise.all(
        data.matches.map(async (match: BiometricMatch) => {
          const { data: biometricData } = await supabase
            .from('suspect_biometrics')
            .select('*')
            .eq('incident_report_id', match.id)
            .maybeSingle();

          return {
            ...match,
            patternType: biometricData?.fingerprint_classification,
            handDominance: biometricData?.hand_dominance,
          };
        })
      );

      setMatches(biometricMatches);

      if (biometricMatches.length > 0) {
        toast({
          title: "Match Found!",
          description: `Found ${biometricMatches.length} potential matches with biometric data.`,
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: "No significant matches found in database.",
        });
      }
    } catch (error) {
      console.error('Fingerprint analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze fingerprint scan.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const scanFinger = async (position: string) => {
    if (!isConnected) {
      toast({
        title: "Scanner Not Connected",
        description: "Please connect a fingerprint scanner first.",
        variant: "destructive",
      });
      return;
    }

    setCurrentFinger(position);
    setScanning(true);
    
    try {
      const result = await scannerUtils.captureFingerprint();
      
      if (result) {
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(result.data))
        );

        const { data: uploadResponse, error: uploadError } = await supabase.functions.invoke(
          'upload-fingerprint',
          {
            body: {
              fingerprintData: base64String,
              position,
              caseNumber: form.getValues('caseNumber')
            }
          }
        );

        if (uploadError) {
          throw uploadError;
        }

        const scanData = {
          position,
          scanData: base64String,
          quality: result.quality,
          timestamp: new Date().toISOString(),
          image_path: uploadResponse.publicUrl
        };
        
        const currentFingerprints = form.getValues('suspectFingerprints') || [];
        form.setValue('suspectFingerprints', [...currentFingerprints, scanData]);
        
        await analyzeFingerprint(scanData);
      }
    } catch (error) {
      console.error('Scanning error:', error);
      toast({
        title: "Scanning Error",
        description: "Failed to capture fingerprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
      setCurrentFinger(null);
    }
  };

  const removeScan = (position: string) => {
    const currentFingerprints = form.getValues('suspectFingerprints') || [];
    form.setValue(
      'suspectFingerprints',
      currentFingerprints.filter(scan => scan.position !== position)
    );
    setMatches([]);
  };

  const getScannedData = (position: string) => {
    const fingerprints = form.getValues('suspectFingerprints') || [];
    return fingerprints.find(scan => scan.position === position);
  };

  return {
    scanning,
    currentFinger,
    analyzing,
    matches,
    isConnected,
    connectScanner,
    scanFinger,
    removeScan,
    getScannedData
  };
};
