
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Fingerprint, X, UserCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReportFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FingerprintScannerProps {
  form: UseFormReturn<ReportFormData>;
}

interface MatchResult {
  id: string;
  name: string;
  similarity: number;
  matchedFingerPosition: string;
}

const FingerprintScanner = ({ form }: FingerprintScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [currentFinger, setCurrentFinger] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
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

      setMatches(data.matches);

      if (data.matches.length > 0) {
        toast({
          title: "Match Found!",
          description: `Found ${data.matches.length} potential matches with other records.`,
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

  const simulateScan = async (position: string) => {
    setCurrentFinger(position);
    setScanning(true);
    
    // Simulate scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock scan data
    const mockScanData = {
      position,
      scanData: `mock_scan_${Date.now()}`,
      quality: Math.random() * 100,
      timestamp: new Date().toISOString()
    };
    
    // Update form data
    const currentFingerprints = form.getValues('suspectFingerprints') || [];
    form.setValue('suspectFingerprints', [...currentFingerprints, mockScanData]);
    
    // Analyze the new scan
    await analyzeFingerprint(mockScanData);
    
    setScanning(false);
    setCurrentFinger(null);
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

  return (
    <div className="space-y-4">
      <Label>Fingerprint Scans</Label>
      
      {matches.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <UserCheck className="text-yellow-600" />
            Potential Matches Found
          </h3>
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div key={match.id} className="flex items-center justify-between bg-white p-2 rounded">
                <div>
                  <span className="font-medium">{match.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({(match.similarity * 100).toFixed(1)}% match on {match.matchedFingerPosition})
                  </span>
                </div>
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
                  disabled={scanning || analyzing}
                  onClick={() => simulateScan(position)}
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
