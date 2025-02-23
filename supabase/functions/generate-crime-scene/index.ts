
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
    const { incident_report_id } = await req.json()
    console.log('Starting crime scene photo generation for report:', incident_report_id)

    if (!incident_report_id) {
      throw new Error('Missing required field: incident_report_id')
    }

    // Initialize OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const openai = new OpenAI({
      apiKey: openaiKey.trim()
    })

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the incident report to determine the type of crime scene
    const { data: report, error: reportError } = await supabase
      .from('incident_reports')
      .select('incident_type, incident_description, penal_code')
      .eq('id', incident_report_id)
      .single()

    if (reportError || !report) {
      throw new Error(`Failed to fetch incident report: ${reportError?.message || 'Report not found'}`)
    }

    // Generate an appropriate prompt based on the incident type
    let prompt = "A professional crime scene photograph taken by law enforcement. "
    
    if (report.incident_type === 'burglary') {
      prompt += "Interior of a residence showing signs of forced entry, with evidence markers visible. Forensic lighting illuminates the scene. Wide-angle shot showing the point of entry."
    } else if (report.incident_type === 'assault') {
      prompt += "Urban setting showing an area where an altercation occurred. Yellow evidence markers on the ground. Police tape visible in the background. Documentary-style photography."
    } else if (report.incident_type === 'vandalism') {
      prompt += "Close-up of property damage with evidence markers. Clear documentation of the vandalized area. Professional police photography style."
    } else {
      prompt += "A general crime scene with police tape and evidence markers. Professional law enforcement photography perspective. Clear documentation of the area."
    }

    prompt += " The image should be clear, well-lit, and documentary in style, following standard police photography protocols. No people or graphic content should be visible."

    console.log('Generating image with prompt:', prompt)
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    })

    if (!imageResponse.data?.[0]?.url) {
      throw new Error('Failed to generate image')
    }

    const imageUrl = imageResponse.data[0].url
    console.log('Successfully generated image URL:', imageUrl)

    // Store the generated photo in the database
    const { error: insertError } = await supabase
      .from('ai_crime_scene_photos')
      .insert({
        incident_report_id,
        image_path: imageUrl,
        prompt_used: prompt
      })

    if (insertError) {
      throw new Error(`Failed to save crime scene photo: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Crime scene photo generated and saved successfully',
        image_url: imageUrl
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
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
