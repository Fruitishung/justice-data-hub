
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

    // Explicitly check for OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('OpenAI API key status:', openaiKey ? 'Found' : 'Not found')
    
    if (!openaiKey) {
      throw new Error('OpenAI API key not found in environment variables. Please ensure it is set in the Supabase dashboard.')
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ 
      apiKey: openaiKey.trim() // Ensure no whitespace
    })
    
    console.log('OpenAI client initialized, generating image...')
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "A professional frontal view police mugshot against a light gray background. Subject looking directly at camera with neutral expression. Standard police booking photo style, minimal shadows, clear facial features. No text overlays or watermarks.",
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural"
      })

      console.log('OpenAI API response received')

      if (!response.data?.[0]?.url) {
        console.error('Invalid response from OpenAI:', response)
        throw new Error('No image URL in OpenAI response')
      }

      const imageUrl = response.data[0].url
      console.log('Image URL generated successfully')

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not found')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Update the arrest tag with the new mugshot URL
      const { error: updateError } = await supabase
        .from('arrest_tags')
        .update({ 
          mugshot_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', arrest_tag_id)

      if (updateError) {
        console.error('Database update error:', updateError)
        throw updateError
      }

      console.log('Mugshot URL saved successfully')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          mugshot_url: imageUrl 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      throw new Error(`OpenAI API error: ${openaiError.message}`)
    }

  } catch (error) {
    console.error('Function error:', error.message)
    return new Response(
      JSON.stringify({ 
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
