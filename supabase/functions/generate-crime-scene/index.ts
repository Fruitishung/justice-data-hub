
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
    const { incident_report_id, photo_type = 'manual' } = await req.json()
    console.log('Starting crime scene photo generation for report:', incident_report_id, 'Type:', photo_type)

    if (!incident_report_id) {
      throw new Error('Missing required field: incident_report_id')
    }

    // Initialize OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey && photo_type === 'ai') {
      throw new Error('OpenAI API key not configured')
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the incident report
    const { data: report, error: reportError } = await supabase
      .from('incident_reports')
      .select('incident_type, incident_description, penal_code')
      .eq('id', incident_report_id)
      .single()

    if (reportError || !report) {
      throw new Error(`Failed to fetch incident report: ${reportError?.message || 'Report not found'}`)
    }

    let imageUrl = null;

    // Different logic for manual and AI photo generation
    if (photo_type === 'ai') {
      const openai = new OpenAI({ apiKey: openaiKey.trim() })

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

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural"
      })

      imageUrl = imageResponse.data?.[0]?.url
    } else {
      // For manual photos, we'll return null and expect the user to upload a photo manually
      imageUrl = null
    }

    // Store the generated or manual photo in the database
    const { error: insertError } = await supabase
      .from('ai_crime_scene_photos')
      .insert({
        incident_report_id,
        image_path: imageUrl,
        photo_type,
        prompt_used: photo_type === 'ai' ? prompt : null
      })

    if (insertError) {
      throw new Error(`Failed to save crime scene photo: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Crime scene photo processed successfully',
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
