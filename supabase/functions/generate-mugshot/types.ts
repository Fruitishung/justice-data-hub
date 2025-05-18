
// Client types
export interface Clients {
  openaiService: any;
  supabase: any;
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
