
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type IncidentReport, type SuspectDetails } from '@/types/reports';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Create empty report data template
export const createEmptyReport = (): IncidentReport => ({
  id: '',
  case_number: 'NEW',
  incident_date: new Date().toISOString(),
  incident_description: '',
  report_status: 'Open',
  created_at: new Date().toISOString(),
  evidence_photos: [],
  ai_crime_scene_photos: [],
  suspect_fingerprints: [],
  suspect_details: {
    first_name: '',
    last_name: '',
    dob: '',
    address: '',
    gender: '',
    height: '',
    weight: '',
    hair: '',
    eyes: '',
    clothing: '',
    identifying_marks: '',
    direction: '',
    arrest_history: '',
    charges: '',
    in_custody: false,
    cell_phone: '',
    home_phone: '',
    work_phone: '',
    weapon: '',
    strong_hand: '',
    parole_officer: '',
  },
  location_address: '',
  location_details: '',
  evidence_description: '',
  evidence_location: '',
  emergency_response: '',
  emergency_units: '',
  conclusion_details: null,
  evidence_property: null,
  penal_code: null,
  vehicle_year: null,
  vehicle_color: null,
  vehicle_plate: null,
  vehicle_vin: null,
  vehicle_model: null,
  vehicle_make: null,
  victim_details: null,
  report_priority: null,
  report_category: null,
  officer_name: null,
  officer_rank: null,
  officer_badge_number: null
});

export function useReportData(id: string | undefined) {
  const { toast } = useToast();
  
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) {
        console.log('No ID provided, redirecting to new report');
        return createEmptyReport();
      }

      // For new reports, return empty report immediately
      if (id === 'new') {
        console.log('Creating new report');
        return createEmptyReport();
      }
      
      console.log('Fetching report details for ID:', id);
      
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching report:', error);
        throw error;
      }

      if (!data) {
        console.error('No report found for ID:', id);
        throw new Error('Report not found');
      }

      // Fetch related data separately to avoid type issues
      const { data: evidencePhotos } = await supabase
        .from('evidence_photos')
        .select('id, file_path')
        .eq('incident_report_id', id);

      const { data: aiPhotos } = await supabase
        .from('ai_crime_scene_photos')
        .select('id, image_path')
        .eq('incident_report_id', id);

      const { data: fingerprints } = await supabase
        .from('fingerprint_scans')
        .select('id, finger_position, scan_data, scan_quality, scan_date')
        .eq('incident_report_id', id);

      // Ensure suspect_details is properly typed
      const parsedSuspectDetails: SuspectDetails = {
        first_name: '',
        last_name: '',
        dob: '',
        address: '',
        gender: '',
        height: '',
        weight: '',
        hair: '',
        eyes: '',
        clothing: '',
        identifying_marks: '',
        direction: '',
        arrest_history: '',
        charges: '',
        in_custody: false,
        cell_phone: '',
        home_phone: '',
        work_phone: '',
        weapon: '',
        strong_hand: '',
        parole_officer: '',
        ...data.suspect_details as Partial<SuspectDetails>
      };

      // Ensure proper type conversion for evidence_property and victim_details
      // to satisfy the IncidentReport type requirements
      const evidence_property = typeof data.evidence_property === 'object' 
        ? data.evidence_property as Record<string, any> 
        : null;
        
      const victim_details = typeof data.victim_details === 'object' 
        ? data.victim_details as Record<string, any> 
        : null;
      
      const conclusion_details = data.conclusion_details && typeof data.conclusion_details === 'object'
        ? data.conclusion_details as Record<string, any>
        : null;

      // Combine all the data with explicit type conversions
      const fullReport: IncidentReport = {
        ...data,
        evidence_photos: evidencePhotos || [],
        ai_crime_scene_photos: aiPhotos || [],
        suspect_fingerprints: fingerprints || [],
        suspect_details: parsedSuspectDetails,
        evidence_property: evidence_property,
        victim_details: victim_details,
        conclusion_details: conclusion_details
      };

      console.log('Fetched full report:', fullReport);
      return fullReport;
    },
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false
  });

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      console.error('Report fetch error:', error);
      toast({
        title: "Error loading report",
        description: error.message || "Failed to load report details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return { report, isLoading, error };
}
