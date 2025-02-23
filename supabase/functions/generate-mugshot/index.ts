
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { arrest_tag_id } = await req.json()
    console.log('Starting mugshot generation for arrest tag:', arrest_tag_id)

    if (!arrest_tag_id) {
      throw new Error('Missing required field: arrest_tag_id')
    }

    // Verify OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured in environment variables')
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: openaiKey.trim()
    })

    // Generate image with a more detailed prompt for realistic mugshots
    console.log('Generating image with DALL-E...')
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A hyperrealistic police booking photograph. Front-facing portrait of a person against a plain light gray background with height measurement lines visible. The subject has a neutral expression, wearing civilian clothes, and is well-lit with standard police booking photo lighting. The image should be clear, professional, and appear as a genuine police booking photo without any text overlays or artistic effects. Ensure the image follows standard police photography guidelines with proper framing from shoulders up.",
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    if (!imageResponse.data?.[0]?.url) {
      throw new Error('Failed to generate image with DALL-E')
    }

    const imageUrl = imageResponse.data[0].url
    console.log('Successfully generated image URL:', imageUrl)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First verify the arrest tag exists
    const { data: existingTag, error: fetchError } = await supabase
      .from('arrest_tags')
      .select('id')
      .eq('id', arrest_tag_id)
      .single()

    if (fetchError || !existingTag) {
      throw new Error(`Failed to verify arrest tag: ${fetchError?.message || 'Tag not found'}`)
    }

    // Update the arrest tag
    const { data: updateData, error: updateError } = await supabase
      .from('arrest_tags')
      .update({
        mugshot_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', arrest_tag_id)
      .select()

    if (updateError) {
      throw new Error(`Failed to update arrest tag: ${updateError.message}`)
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
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
