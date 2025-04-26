
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const initializeClients = () => {
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!openaiKey) throw new Error('OpenAI API key not configured')
  if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase configuration')

  return {
    openai: new OpenAI({ apiKey: openaiKey.trim() }),
    supabase: createClient(supabaseUrl, supabaseServiceKey)
  }
}

const verifyArrestTag = async (supabase: any, arrestTagId: string) => {
  const { data, error } = await supabase
    .from('arrest_tags')
    .select('id, suspect_name')
    .eq('id', arrestTagId)
    .maybeSingle()

  if (error) throw new Error(`Database error: ${error.message}`)
  if (!data) throw new Error('Arrest tag not found')
  
  return data
}

const generateMugshot = async (openai: OpenAI) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `A realistic police booking photograph (mugshot). Front-facing portrait of a person with a neutral expression against a light gray background. Standard police height measurement lines are visible on the wall behind. The subject is well-lit with professional police photography lighting, wearing casual civilian clothing. Image should be clear, centered, and follow standard police booking photo protocols. The photo should be framed from just below the shoulders to above the head. No text overlays or timestamps.`,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "natural"
  })

  if (!response.data?.[0]?.url) {
    throw new Error('Failed to generate image')
  }

  return response.data[0].url
}

const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string) => {
  const { error } = await supabase
    .from('arrest_tags')
    .update({
      mugshot_url: imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', arrestTagId)

  if (error) throw new Error(`Failed to update arrest tag: ${error.message}`)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { arrest_tag_id, photo_type } = await req.json()
    if (!arrest_tag_id) throw new Error('Missing arrest_tag_id')

    console.log('Starting mugshot generation process for:', arrest_tag_id)
    
    const { openai, supabase } = initializeClients()
    
    // For AI-generated photos, we can skip verification if it's not from a real arrest tag
    if (photo_type !== 'ai') {
      // Step 1: Verify arrest tag exists
      await verifyArrestTag(supabase, arrest_tag_id)
      console.log('Arrest tag verified')
    }

    // Step 2: Generate mugshot
    console.log('Generating mugshot...')
    const imageUrl = await generateMugshot(openai)
    console.log('Mugshot generated successfully')

    // Step 3: Update arrest tag with new mugshot (only for real arrest tags)
    if (photo_type !== 'ai') {
      console.log('Updating arrest tag...')
      await updateArrestTag(supabase, arrest_tag_id, imageUrl)
      console.log('Arrest tag updated successfully')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mugshot generated and saved successfully',
        mugshot_url: imageUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in generate-mugshot function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
