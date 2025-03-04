
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { IncidentReport, SuspectDetails } from '@/types/reports';
import { Json } from '@/types/reports';

/**
 * Custom hook for fetching incident report data
 */
export const useReportData = (id?: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id || id === 'new') {
        // Return a new empty report
        return null;
      }

      // Fetch the report data from Supabase
      const { data, error } = await supabase
        .from('incident_reports')
        .select(`
          *,
          evidence_photos:evidence_photos(*),
          ai_crime_scene_photos:ai_crime_scene_photos(*),
          suspect_fingerprints:fingerprint_scans(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching report:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      // Type cast data to IncidentReport
      return transformReportData(data);
    },
    enabled: !!id && id !== 'new',
  });
};

/**
 * Transforms the raw data from Supabase into the IncidentReport type
 */
const transformReportData = (data: any): IncidentReport => {
  // Ensure suspect_details is properly typed
  const suspectDetails: SuspectDetails = {
    first_name: data.suspect_details?.first_name || '',
    last_name: data.suspect_details?.last_name || '',
    aka: data.suspect_details?.aka || '',
    dob: data.suspect_details?.dob || '',
    address: data.suspect_details?.address || '',
    gender: data.suspect_details?.gender || '',
    height: data.suspect_details?.height || '',
    weight: data.suspect_details?.weight || '',
    hair: data.suspect_details?.hair || '',
    eyes: data.suspect_details?.eyes || '',
    clothing: data.suspect_details?.clothing || '',
    identifying_marks: data.suspect_details?.identifying_marks || '',
    direction: data.suspect_details?.direction || '',
    arrest_history: data.suspect_details?.arrest_history || '',
    charges: data.suspect_details?.charges || '',
    in_custody: data.suspect_details?.in_custody || false,
    cell_phone: data.suspect_details?.cell_phone || '',
    home_phone: data.suspect_details?.home_phone || '',
    work_phone: data.suspect_details?.work_phone || '',
    weapon: data.suspect_details?.weapon || '',
    strong_hand: data.suspect_details?.strong_hand || '',
    parole_officer: data.suspect_details?.parole_officer || '',
    fingerprint_classification: data.suspect_details?.fingerprint_classification || '',
    hand_dominance: data.suspect_details?.hand_dominance || '',
  };

  // Transform the data into an IncidentReport
  return {
    id: data.id,
    case_number: data.case_number,
    incident_date: data.incident_date,
    incident_description: data.incident_description,
    report_status: data.report_status,
    report_priority: data.report_priority,
    report_category: data.report_category,
    created_at: data.created_at,
    officer_name: data.officer_name,
    officer_rank: data.officer_rank,
    officer_badge_number: data.officer_badge_number,
    location_address: data.location_address,
    location_details: data.location_details,
    evidence_description: data.evidence_description,
    evidence_location: data.evidence_location,
    emergency_response: data.emergency_response,
    emergency_units: data.emergency_units,
    evidence_property: data.evidence_property as Record<string, any> || null,
    suspect_details: suspectDetails,
    victim_details: data.victim_details as Record<string, any> || null,
    vehicle_make: data.vehicle_make,
    vehicle_model: data.vehicle_model,
    vehicle_year: data.vehicle_year,
    vehicle_color: data.vehicle_color,
    vehicle_plate: data.vehicle_plate,
    vehicle_vin: data.vehicle_vin,
    penal_code: data.penal_code,
    // Make sure conclusion_details exists, or default to null
    conclusion_details: (data.conclusion_details as Record<string, any>) || null,
    evidence_photos: data.evidence_photos || [],
    ai_crime_scene_photos: data.ai_crime_scene_photos || [],
    suspect_fingerprints: data.suspect_fingerprints || [],
  };
};
