import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Fingerprint, X, UserCheck, Usb } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { scannerUtils } from "@/utils/fingerprintScanner";

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>;
}

interface MatchResult {
  id: string;
  name: string;
  similarity: number;
  matchedFingerPosition: string;
}

interface BiometricMatch extends MatchResult {
  patternType?: string;
  ridgeCount?: number;
  whorlPattern?: string;
  handDominance?: string;
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [currentFinger, setCurrentFinger] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matches, setMatches] = useState<BiometricMatch[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  
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
        data.matches.map(async (match: MatchResult) => {
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
              incidentReportId: form.getValues('id')
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
        
        form.setValue('suspectFingerprints', [
          ...form.getValues('suspectFingerprints') || [],
          scanData
        ]);
        
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

  React.useEffect(() => {
    return () => {
      scannerUtils.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Label>Fingerprint Scans</Label>
        <Button
          variant={isConnected ? "secondary" : "default"}
          onClick={connectScanner}
          className="flex items-center gap-2"
        >
          <Usb className="w-4 h-4" />
          {isConnected ? "Scanner Connected" : "Connect Scanner"}
        </Button>
      </div>
      
      {matches.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <UserCheck className="text-yellow-600" />
            Potential Matches Found
          </h3>
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div key={match.id} className="flex flex-col bg-white p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{match.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({(match.similarity * 100).toFixed(1)}% match on {match.matchedFingerPosition})
                  </span>
                </div>
                {(match.patternType || match.handDominance) && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {match.patternType && (
                      <span className="mr-3">Pattern: {match.patternType}</span>
                    )}
                    {match.handDominance && (
                      <span>Dominant Hand: {match.handDominance}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
                  disabled={scanning || analyzing || !isConnected}
                  onClick={() => scanFinger(position)}
                  className="w-full"
                >
                  {scanning && currentFinger === position ? (
                    <span>Scanning...</span>
                  ) : analyzing ? (
                    <span>Analyzing...</span>
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
