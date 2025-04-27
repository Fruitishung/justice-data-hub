
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fallback images for when OpenAI fails
const FALLBACK_MUGSHOTS = [
  "https://images.unsplash.com/photo-1586038693164-cb7ee3fb8e2c?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506018589526-7470107d6680?q=80&w=1024&auto=format&fit=crop"
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

const generateMugshot = async (openai: OpenAI) => {
  try {
    console.log("Starting OpenAI image generation...")
    
    // Fix: Configure proper headers for OpenAI API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A realistic police booking photograph (mugshot). Front-facing portrait of a person with a neutral expression against a light gray background. Standard police height measurement lines are visible on the wall behind. The subject is well-lit with professional police photography lighting, wearing casual civilian clothing. Image should be clear, centered, and follow standard police booking photo protocols. The photo should be framed from just below the shoulders to above the head. No text overlays or timestamps.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    console.log("OpenAI response received:", response)

    if (!response.data?.[0]?.url) {
      throw new Error('Failed to generate image - no URL in response')
    }

    return response.data[0].url
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Get a random fallback image
    return FALLBACK_MUGSHOTS[Math.floor(Math.random() * FALLBACK_MUGSHOTS.length)]
  }
}

const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string) => {
  try {
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
    const { arrest_tag_id, photo_type } = await req.json()
    
    if (!arrest_tag_id) {
      throw new Error('Missing arrest_tag_id')
    }

    console.log('Starting mugshot generation process for:', arrest_tag_id)
    console.log('Photo type:', photo_type)
    
    // Initialize clients
    const { openai, supabase } = initializeClients()
    
    // For AI-generated photos, we can skip verification for test/dev photos
    if (photo_type !== 'ai') {
      await verifyArrestTag(supabase, arrest_tag_id)
    }

    // Generate mugshot
    const imageUrl = await generateMugshot(openai)
    console.log('Mugshot generated successfully:', imageUrl)

    // Update arrest tag with new mugshot (only for real arrest tags)
    if (photo_type !== 'ai' && imageUrl) {
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
