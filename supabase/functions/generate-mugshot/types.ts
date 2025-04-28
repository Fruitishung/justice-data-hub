
// Types for the mugshot generator

export interface BioMarkers {
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
}

export interface Clients {
  openaiService: any;
  supabase: any;
}

export interface RequestBody {
  arrest_tag_id: string;
  photo_type?: 'ai' | 'training';
  bio_markers?: BioMarkers;
}

export interface ArrestTag {
  id: string;
  suspect_name: string;
}

export interface ResponseData {
  success: boolean;
  message: string;
  mugshot_url: string;
  timestamp: string;
  error?: string;
}
