
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFingerprint = () => {
  const fetchBiometricData = useCallback(async (fingerprintData: string) => {
    try {
      // Query the fingerprint_scans table instead of non-existent suspect_biometrics
      const { data, error } = await supabase
        .from('fingerprint_scans')
        .select('*, incident_reports(*)')
        .eq('scan_data', fingerprintData)
        .single();

      if (error) throw error;

      if (!data) {
        return null;
      }

      // Access the biometric data from the incident report's suspect details
      const suspectDetails = data.incident_reports?.suspect_details || {};
      
      return {
        fingerprintClass: suspectDetails?.fingerprint_classification || 'Unknown',
        handDominance: suspectDetails?.hand_dominance || 'Unknown',
        matchScore: calculateMatchScore(fingerprintData, data.scan_data)
      };
    } catch (error) {
      console.error('Error fetching biometric data:', error);
      toast.error('Failed to fetch biometric data');
      return null;
    }
  }, []);

  const calculateMatchScore = (sample1: string, sample2: string) => {
    // Simple matching algorithm - can be enhanced
    return sample1 === sample2 ? 100 : 0;
  };

  return {
    fetchBiometricData
  };
};
