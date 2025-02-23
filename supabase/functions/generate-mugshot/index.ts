
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First verify the arrest tag exists
    console.log('Verifying arrest tag exists...')
    const { data: existingTag, error: fetchError } = await supabase
      .from('arrest_tags')
      .select('id, suspect_name')
      .eq('id', arrest_tag_id)
      .single()

    if (fetchError || !existingTag) {
      throw new Error(`Failed to verify arrest tag: ${fetchError?.message || 'Tag not found'}`)
    }

    console.log('Found arrest tag, generating mugshot...')

    // Generate image with improved prompt
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A realistic police booking photograph (mugshot). Front-facing portrait of a person with a neutral expression against a light gray background. Standard police height measurement lines are visible on the wall behind. The subject is well-lit with professional police photography lighting, wearing casual civilian clothing. Image should be clear, centered, and follow standard police booking photo protocols. The photo should be framed from just below the shoulders to above the head. No text overlays or timestamps.`,
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

    // Update the arrest tag with the new mugshot
    console.log('Updating arrest tag with new mugshot URL...')
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

    console.log('Successfully updated arrest tag with new mugshot')

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
    
    // Improved error response with more details
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
