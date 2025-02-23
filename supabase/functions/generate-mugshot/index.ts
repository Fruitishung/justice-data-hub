
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
    const { arrest_tag_id, suspect_name } = await req.json()
    console.log('Generating mugshot for:', { arrest_tag_id, suspect_name })

    if (!arrest_tag_id || !suspect_name) {
      throw new Error('Missing required fields: arrest_tag_id and suspect_name are required')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials')
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Initialize OpenAI with API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('Missing OpenAI API key')
    }
    
    const openai = new OpenAI({ apiKey: openaiKey })
    
    console.log('Generating image with DALL-E...')
    
    // Generate the mugshot using DALL-E
    const prompt = `Ultra realistic police mugshot photograph of a criminal suspect, 
      front view against light blue background, harsh lighting, neutral expression, 
      wearing civilian clothes, photorealistic, 4k, highly detailed. The photo should look 
      like a real police mugshot, not artistic or stylized.`
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    if (!response.data?.[0]?.url) {
      throw new Error('No image URL received from OpenAI')
    }

    const imageUrl = response.data[0].url
    console.log('Generated image URL:', imageUrl)

    // Update the arrest tag with the new mugshot URL
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
