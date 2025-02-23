
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { arrest_tag_id } = await req.json()
    console.log('Starting mugshot generation for arrest tag:', arrest_tag_id)

    if (!arrest_tag_id) {
      throw new Error('Missing required field: arrest_tag_id')
    }

    // Initialize OpenAI with API key - check both possible environment variable names
    const openaiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OPENAI_KEY')
    if (!openaiKey) {
      console.error('OpenAI API key not found in environment variables')
      throw new Error('OpenAI API key not configured')
    }
    
    console.log('OpenAI key found, initializing client...')
    const openai = new OpenAI({ apiKey: openaiKey })
    
    console.log('Generating image with DALL-E...')
    
    // Generate mugshot using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Professional police mugshot photo against a light blue background, frontal view, harsh lighting, neutral expression, wearing civilian clothes. No text or watermarks. Photorealistic, law enforcement style documentation photo.",
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    if (!response.data?.[0]?.url) {
      console.error('No image URL in OpenAI response:', response)
      throw new Error('No image URL received from OpenAI')
    }

    const imageUrl = response.data[0].url
    console.log('Successfully generated image URL:', imageUrl)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials')
      throw new Error('Supabase configuration missing')
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Saving mugshot URL to database...')

    // Save the mugshot URL
    const { error: updateError } = await supabase
      .from('arrest_tags')
      .update({ 
        mugshot_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', arrest_tag_id)

    if (updateError) {
      console.error('Error updating arrest tag:', updateError)
      throw updateError
    }

    console.log('Successfully updated arrest tag with mugshot URL')
    return new Response(
      JSON.stringify({ success: true, mugshot_url: imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-mugshot function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
