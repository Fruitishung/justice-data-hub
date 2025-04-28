
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { OpenAIService } from './openai-service.ts';
import { ArrestTag, BioMarkers, Clients } from './types.ts';
import { FALLBACK_MUGSHOTS } from './config.ts';

// Get a random fallback image
export const getFallbackImage = (): string => {
  const fallbackUrl = FALLBACK_MUGSHOTS[Math.floor(Math.random() * FALLBACK_MUGSHOTS.length)];
  console.log("Using fallback image:", fallbackUrl);
  return fallbackUrl;
};

// Client initialization
export const initializeClients = (): Clients => {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!openaiKey) throw new Error('OpenAI API key not configured');
  if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase configuration');

  return {
    openaiService: new OpenAIService(openaiKey),
    supabase: createClient(supabaseUrl, supabaseServiceKey)
  };
};

// Verify arrest tag exists
export const verifyArrestTag = async (supabase: any, arrestTagId: string): Promise<ArrestTag> => {
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
};

// Update arrest tag with new mugshot
export const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('arrest_tags')
    .update({
      mugshot_url: imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', arrestTagId);

  if (error) throw new Error(`Failed to update arrest tag: ${error.message}`);
};

// Generate mugshot using OpenAI service or fallback
export const generateMugshot = async (openaiService: any, bioMarkers?: BioMarkers): Promise<string> => {
  try {
    return await openaiService.generateMugshot(bioMarkers);
  } catch (error) {
    console.error('Error generating mugshot:', error);
    return getFallbackImage();
  }
};
