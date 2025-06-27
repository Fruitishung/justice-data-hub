
// Client types
export interface Clients {
  openaiService: OpenAIService;
  supabase: SupabaseClient;
}

// OpenAI Service interface
export interface OpenAIService {
  images: {
    generate: (params: any) => Promise<any>;
  };
}

// Supabase Client interface
export interface SupabaseClient {
  from: (table: string) => any;
}

// ArrestTag data structure
export interface ArrestTag {
  id: string;
  suspect_name: string;
}

// BioMarkers for AI image generation
export interface BioMarkers {
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
  name?: string;
  charges?: string;
  seed?: string;  // Added for random seed to ensure unique generations
}

// Request body structure
export interface RequestBody {
  arrest_tag_id: string;
  photo_type?: string;
  bio_markers?: BioMarkers;
}

// Response data structure
export interface ResponseData {
  success: boolean;
  message: string;
  mugshot_url: string;
  timestamp: string;
  error?: string;
}
