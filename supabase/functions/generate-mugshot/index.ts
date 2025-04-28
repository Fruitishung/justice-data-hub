import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { OpenAIService } from './openai-service.ts'

// Constants
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const FALLBACK_MUGSHOTS = [
  "https://images.unsplash.com/photo-1589279715734-6631a314dfa2?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584650589355-e219e23d9775?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551129923-db84575e0c30?q=80&w=1024&auto=format&fit=crop"
];

interface Clients {
  openaiService: OpenAIService;
  supabase: any;
}

interface BioMarkers {
  gender?: string;
  height?: string;
  weight?: string;
  hair?: string;
  eyes?: string;
}

interface RequestBody {
  arrest_tag_id: string;
  photo_type?: 'ai' | 'training';
  bio_markers?: BioMarkers;
}

// Get a random fallback image
const getFallbackImage = (): string => {
  const fallbackUrl = FALLBACK_MUGSHOTS[Math.floor(Math.random() * FALLBACK_MUGSHOTS.length)];
  console.log("Using fallback image:", fallbackUrl);
  return fallbackUrl;
}

// Client initialization
const initializeClients = (): Clients => {
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!openaiKey) throw new Error('OpenAI API key not configured')
  if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase configuration')

  return {
    openaiService: new OpenAIService(openaiKey),
    supabase: createClient(supabaseUrl, supabaseServiceKey)
  }
}

// Verify arrest tag exists
const verifyArrestTag = async (supabase: any, arrestTagId: string) => {
  // Skip verification for test/dev photos
  if (arrestTagId.startsWith('test-') || arrestTagId.includes('test')) {
    return { id: arrestTagId, suspect_name: "Test Subject" };
  }

  const { data, error } = await supabase
    .from('arrest_tags')
    .select('id, suspect_name')
    .eq('id', arrestTagId)
    .maybeSingle();

  if (error) throw new Error(`Database error: ${error.message}`);
  if (!data) throw new Error('Arrest tag not found');
  
  return data;
}

// Update arrest tag with new mugshot
const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('arrest_tags')
    .update({
      mugshot_url: imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', arrestTagId);

  if (error) throw new Error(`Failed to update arrest tag: ${error.message}`);
}

// Parse and validate request body
const parseRequestBody = async (req: Request): Promise<RequestBody> => {
  try {
    const body = await req.json();
    if (!body.arrest_tag_id) {
      throw new Error('Missing arrest_tag_id');
    }
    return body as RequestBody;
  } catch (e) {
    throw new Error(`Invalid request body: ${e.message}`);
  }
}

// Main request handler
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { arrest_tag_id, photo_type, bio_markers } = await parseRequestBody(req);
    console.log('Processing request:', { arrest_tag_id, photo_type, bio_markers });

    const { openaiService, supabase } = initializeClients();

    if (photo_type !== 'ai') {
      await verifyArrestTag(supabase, arrest_tag_id);
    }

    let imageUrl: string;
    try {
      imageUrl = await openaiService.generateMugshot(bio_markers);
    } catch (error) {
      console.error('Error generating mugshot:', error);
      imageUrl = getFallbackImage();
    }

    if (!arrest_tag_id.includes('test') && photo_type !== 'ai') {
      await updateArrestTag(supabase, arrest_tag_id, imageUrl);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mugshot generated successfully',
        mugshot_url: imageUrl,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    const fallbackUrl = getFallbackImage();

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Using fallback image due to error',
        mugshot_url: fallbackUrl,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
