
import { Database } from '@/integrations/supabase/types';

export type SuspectDetails = {
  first_name?: string;
  last_name?: string;
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
};

export type IncidentReport = Database['public']['Tables']['incident_reports']['Row'] & {
  evidence_photos: { id: string; file_path: string; }[];
  ai_crime_scene_photos: { id: string; image_path: string; }[];
  suspect_fingerprints: {
    id: string;
    finger_position: string;
    scan_data: string;
    scan_quality: number | null;
    scan_date: string | null;
  }[];
  suspect_details: SuspectDetails;
};
