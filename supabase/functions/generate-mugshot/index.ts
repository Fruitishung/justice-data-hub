
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

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

    // Initialize HuggingFace
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    console.log('Generating image with AI...')
    
    // Generate the mugshot using AI
    const prompt = `Ultra realistic police mugshot photograph of a criminal suspect named ${suspect_name}, 
      front view, neutral expression, harsh lighting, police backdrop, 4k, highly detailed`
    
    const image = await hf.textToImage({
      inputs: prompt,
      model: "black-forest-labs/FLUX.1-schnell", // Fast, high-quality model
      parameters: {
        sampling_method: "DPM++ Karras SDE",
        num_inference_steps: 8
      }
    })

    // Convert the blob to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const imageUrl = `data:image/jpeg;base64,${base64}`

    console.log('Generated image, updating arrest tag...')

    // Update the arrest tag with the new mugshot URL
    const { error: updateError } = await supabase
      .from('arrest_tags')
      .update({ mugshot_url: imageUrl })
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
