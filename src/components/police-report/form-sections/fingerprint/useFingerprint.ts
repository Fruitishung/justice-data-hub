
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { SuspectDetails } from '@/types/reports';

export const useFingerprint = () => {
  const fetchBiometricData = useCallback(async (fingerprintData: string) => {
    try {
      const { data, error } = await supabase
        .from('fingerprint_scans')
        .select('*, incident_reports(*)')
        .eq('scan_data', fingerprintData)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return null;
      }

      const suspectDetails = data.incident_reports?.suspect_details as SuspectDetails | null;
      
      return {
        fingerprintClass: suspectDetails?.fingerprint_classification || 'Unknown',
        handDominance: suspectDetails?.hand_dominance || 'Unknown',
        matchScore: calculateMatchScore(fingerprintData, data.scan_data || '')
      };
    } catch (error) {
      console.error('Error fetching biometric data:', error);
      toast.error('Failed to fetch biometric data');
      return null;
    }
  }, []);

  const calculateMatchScore = (sample1: string, sample2: string) => {
    return sample1 === sample2 ? 100 : 0;
  };

  return {
    fetchBiometricData
  };
};
