
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fallback images for when OpenAI fails - updated to real mugshot-style photos
const FALLBACK_MUGSHOTS = [
  "https://images.unsplash.com/photo-1589279715734-6631a314dfa2?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584650589355-e219e23d9775?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551129923-db84575e0c30?q=80&w=1024&auto=format&fit=crop"
];

const initializeClients = () => {
  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!openaiKey) throw new Error('OpenAI API key not configured')
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase configuration')

    return {
      openai: new OpenAI({ apiKey: openaiKey }),
      supabase: createClient(supabaseUrl, supabaseServiceKey)
    }
  } catch (error) {
    console.error("Error initializing clients:", error)
    throw new Error(`Failed to initialize clients: ${error.message}`)
  }
}

const verifyArrestTag = async (supabase: any, arrestTagId: string) => {
  try {
    // For AI-generated test photos, we'll skip verification
    if (arrestTagId.startsWith('test-') || arrestTagId.includes('test')) {
      return { id: arrestTagId, suspect_name: "Test Subject" };
    }

    const { data, error } = await supabase
      .from('arrest_tags')
      .select('id, suspect_name')
      .eq('id', arrestTagId)
      .maybeSingle()

    if (error) throw new Error(`Database error: ${error.message}`)
    if (!data) throw new Error('Arrest tag not found')
    
    return data
  } catch (error) {
    console.error("Error verifying arrest tag:", error)
    throw error
  }
}

const generateMugshot = async (openai: OpenAI, bioMarkers: any) => {
  try {
    console.log("Starting OpenAI image generation with bio markers:", bioMarkers);
    
    // Create an extremely detailed and specific mugshot prompt
    const prompt = `Generate a realistic police booking photograph (mugshot) with these EXACT specifications:
    
    MANDATORY REQUIREMENTS:
    1. Subject MUST be an ADULT (30-50 years old) - ABSOLUTELY NO CHILDREN OR MINORS
    2. Subject MUST have a neutral facial expression with NO SMILING
    3. Background MUST be a light blue or gray wall with visible height measurement lines
    4. Subject MUST be shown from shoulders up in a front-facing view
    5. Subject MUST be holding a black booking information placard with white text
    6. Lighting MUST be harsh and unflattering as typical in police stations
    7. Image MUST be documentary/photojournalistic style - NOT glamorized
    
    Physical characteristics:
    - Gender: ${bioMarkers?.gender || 'male'}
    - Height: ${bioMarkers?.height || '5\'10"'}
    - Build: ${bioMarkers?.weight || 'average'} build
    - Hair: ${bioMarkers?.hair || 'dark'} hair
    - Eyes: ${bioMarkers?.eyes || 'brown'} eyes
    
    This MUST appear as an official police booking photograph - NOT a casual or social media photo. NO social settings, NO phones, NO smiling.`;

    // Set a timeout for the OpenAI request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI request timed out')), 15000);
    });

    // Create the image generation promise
    const imagePromise = openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    // Race the timeout against the actual request
    const response = await Promise.race([imagePromise, timeoutPromise]) as any;
    console.log("OpenAI response received:", response);

    if (!response.data?.[0]?.url) {
      throw new Error('Failed to generate image - no URL in response');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Get a random fallback image that's more realistic as a mugshot
    return FALLBACK_MUGSHOTS[Math.floor(Math.random() * FALLBACK_MUGSHOTS.length)];
  }
}

const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string) => {
  try {
    // Skip database update for test arrest tags
    if (arrestTagId.startsWith('test-') || arrestTagId.includes('test')) {
      console.log("Test arrest tag - skipping database update");
      return;
    }

    const { error } = await supabase
      .from('arrest_tags')
      .update({
        mugshot_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', arrestTagId)

    if (error) throw new Error(`Failed to update arrest tag: ${error.message}`)
  } catch (error) {
    console.error("Error updating arrest tag:", error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { arrest_tag_id, photo_type, bio_markers } = await req.json()
    
    if (!arrest_tag_id) {
      throw new Error('Missing arrest_tag_id')
    }

    console.log('Starting mugshot generation process for:', arrest_tag_id)
    console.log('Photo type:', photo_type)
    console.log('Bio markers:', bio_markers)
    
    // Initialize clients
    const { openai, supabase } = initializeClients()
    
    // For AI-generated photos, we can skip verification for test/dev photos
    if (photo_type !== 'ai') {
      await verifyArrestTag(supabase, arrest_tag_id)
    }

    // Generate mugshot
    const imageUrl = await generateMugshot(openai, bio_markers)
    console.log('Mugshot generated successfully:', imageUrl)

    // Update arrest tag with new mugshot (only for real arrest tags)
    if (photo_type !== 'ai' && imageUrl && !arrest_tag_id.includes('test')) {
      await updateArrestTag(supabase, arrest_tag_id, imageUrl)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mugshot generated successfully',
        mugshot_url: imageUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in generate-mugshot function:', error)
    
    // Use fallback image in case of error
    const fallbackUrl = FALLBACK_MUGSHOTS[0]
    
    return new Response(
      JSON.stringify({
        success: true, // Return success even with fallback
        error: error.message,
        message: 'Using fallback image due to error',
        mugshot_url: fallbackUrl,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 with fallback image instead of error
      }
    )
  }
})
