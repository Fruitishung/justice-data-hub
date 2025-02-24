import { Database } from '@/integrations/supabase/types';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type SuspectDetails = {
  first_name?: string;
  last_name?: string;
  aka?: string;
  dob?: string;
  address?: string;
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
  clothing?: string;
  identifying_marks?: string;
  direction?: string;
  arrest_history?: string;
  charges?: string;
  in_custody?: boolean;
  cell_phone?: string;
  home_phone?: string;
  work_phone?: string;
  weapon?: string;
  strong_hand?: string;
  parole_officer?: string;
  fingerprint_classification?: string;
  hand_dominance?: string;
};

export type ArrestTag = Database['public']['Tables']['arrest_tags']['Row'] & {
  incident_reports?: Database['public']['Tables']['incident_reports']['Row'] | null;
};

export type IncidentReport = {
  id: string;
  case_number: string | null;
  incident_date: string;
  incident_description: string | null;
  report_status: string;
  report_priority?: string | null;
  report_category?: string | null;
  created_at: string;
  officer_name: string | null;
  officer_rank?: string | null;
  officer_badge_number?: string | null;
  location_address: string | null;
  location_details: string | null;
  evidence_description: string | null;
  evidence_location: string | null;
  emergency_response: string | null;
  emergency_units: string | null;
  evidence_property: Record<string, any> | null;
  suspect_details: SuspectDetails;
  victim_details: Record<string, any> | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  vehicle_color: string | null;
  vehicle_plate: string | null;
  vehicle_vin: string | null;
  penal_code: string | null;
  conclusion_details?: Record<string, any> | null;
  evidence_photos: { id: string; file_path: string; }[];
  ai_crime_scene_photos: { id: string; image_path: string; }[];
  suspect_fingerprints: {
    id: string;
    finger_position: string;
    scan_data: string;
    scan_quality: number | null;
    scan_date: string | null;
  }[];
};

export type FingerprintScan = {
  id: string;
  incident_report_id: string;
  scan_data: string;
  finger_position: string;
  scan_quality: number | null;
  scan_date: string | null;
};

export type NarrativeReport = {
  id: string;
  incident_report_id: string;
  narrative_text: string | null;
  status: string;
  created_at: string;
};

export type EvidencePhoto = {
  id: string;
  incident_report_id: string;
  file_path: string;
  uploaded_at: string;
};

export type AICrimeScenePhoto = {
  id: string;
  incident_report_id: string;
  image_path: string;
  generated_at: string;
};

// For MCTETTS Page
export type Warrant = {
  id: string;
  suspect_name: string;
  warrant_type: string;
  issue_date: string;
  status: string;
  case_number: string;
  correlation_score: number;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: string;
  vin: string;
  plate: string;
  owner: string;
};

export type PropertyRecord = {
  id: string;
  type: string;
  description: string;
  serial_number: string;
  owner: string;
  status: string;
};

declare global {
  type Database = {
    public: {
      Tables: {
        arrest_tags: {
          Row: ArrestTag;
          Insert: Omit<ArrestTag, 'id' | 'created_at'>;
          Update: Partial<ArrestTag>;
        };
        incident_reports: {
          Row: IncidentReport;
          Insert: Omit<IncidentReport, 'id' | 'created_at'>;
          Update: Partial<IncidentReport>;
        };
        fingerprint_scans: {
          Row: FingerprintScan;
          Insert: Omit<FingerprintScan, 'id'>;
          Update: Partial<FingerprintScan>;
        };
        narrative_reports: {
          Row: NarrativeReport;
          Insert: Omit<NarrativeReport, 'id' | 'created_at'>;
          Update: Partial<NarrativeReport>;
        };
        evidence_photos: {
          Row: EvidencePhoto;
          Insert: Omit<EvidencePhoto, 'id' | 'uploaded_at'>;
          Update: Partial<EvidencePhoto>;
        };
        ai_crime_scene_photos: {
          Row: AICrimeScenePhoto;
          Insert: Omit<AICrimeScenePhoto, 'id' | 'generated_at'>;
          Update: Partial<AICrimeScenePhoto>;
        };
      };
      Functions: {
        search_warrants: {
          Args: { search_term: string };
          Returns: Warrant[];
        };
        search_vehicles: {
          Args: { search_term: string };
          Returns: Vehicle[];
        };
        search_property: {
          Args: { search_term: string };
          Returns: PropertyRecord[];
        };
      };
    };
  };
}
