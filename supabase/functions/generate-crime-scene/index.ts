
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log("Crime scene photo generation request received");
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { incident_report_id, photo_type = 'manual', custom_prompt } = await req.json()
    console.log('Processing crime scene photo generation:', { incident_report_id, photo_type, has_custom_prompt: !!custom_prompt })

    if (!incident_report_id) {
      throw new Error('Missing required field: incident_report_id')
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the incident report with enhanced data
    const { data: report, error: reportError } = await supabase
      .from('incident_reports')
      .select(`
        incident_type, 
        incident_description, 
        penal_code, 
        report_category,
        location_address,
        location_details,
        evidence_description,
        suspect_details,
        victim_details
      `)
      .eq('id', incident_report_id)
      .single()

    if (reportError || !report) {
      throw new Error(`Failed to fetch incident report: ${reportError?.message || 'Report not found'}`)
    }

    let imageUrl = null;
    let promptUsed = null;

    // Enhanced AI photo generation
    if (photo_type === 'ai') {
      const openaiKey = Deno.env.get('OPENAI_API_KEY')
      if (!openaiKey) {
        throw new Error('OpenAI API key not configured for AI photo generation')
      }

      const openai = new OpenAI({ apiKey: openaiKey.trim() })

      // Generate enhanced prompt based on incident details
      promptUsed = custom_prompt || generateEnhancedPrompt(report);
      
      console.log('Generating image with enhanced prompt:', promptUsed.substring(0, 100) + '...')

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: promptUsed,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural"
      })

      imageUrl = imageResponse.data?.[0]?.url

      if (!imageUrl) {
        throw new Error('Failed to generate image - no URL returned from OpenAI')
      }

      console.log('Successfully generated AI crime scene photo')
    }

    // Store the photo record in database
    const { data: photoRecord, error: insertError } = await supabase
      .from('ai_crime_scene_photos')
      .insert({
        incident_report_id,
        image_path: imageUrl,
        photo_type,
        prompt_used: promptUsed
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw new Error(`Failed to save crime scene photo: ${insertError.message}`)
    }

    // Return enhanced response
    return new Response(
      JSON.stringify({
        success: true,
        message: `${photo_type === 'ai' ? 'AI-generated' : 'Manual'} crime scene photo processed successfully`,
        image_url: imageUrl,
        photo_id: photoRecord.id,
        prompt_used: promptUsed,
        incident_details: {
          case_type: report.incident_type,
          location: report.location_address
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Crime scene photo generation error:', error)
    
    // Enhanced error response with specific error codes
    const errorResponse = {
      success: false,
      error: error.message,
      error_type: getErrorType(error),
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: getErrorStatus(error)
      }
    )
  }
})

function generateEnhancedPrompt(report: any): string {
  const basePrompt = "Generate a realistic crime scene photograph taken by law enforcement. Professional police photography style with proper evidence documentation. "
  
  let specificPrompt = ""
  
  // Enhanced prompts based on incident type and penal code
  if (report.penal_code === '187' || report.incident_type === 'homicide') {
    specificPrompt = "Serious crime scene with forensic investigators working methodically. Evidence markers placed throughout the area. Professional lighting reveals important details. Somber, documentary photography style."
  } else if (report.penal_code === '211' || report.incident_type === 'robbery') {
    specificPrompt = "Commercial robbery scene showing disrupted merchandise or cash register area. Security camera perspective. Evidence of forced entry or struggle. Police tape securing the perimeter."
  } else if (report.incident_type === 'burglary' || report.penal_code === '459') {
    specificPrompt = "Residential burglary scene showing signs of forced entry. Broken window or damaged door frame. Items scattered, evidence markers placed on key evidence. Interior lighting shows the disturbance."
  } else if (report.incident_type === 'assault') {
    specificPrompt = "Assault scene in urban setting. Evidence markers on ground indicating points of contact. Wide-angle documentation shot showing the immediate area. Professional police photography."
  } else if (report.incident_type === 'vandalism') {
    specificPrompt = "Property damage documentation showing graffiti, broken windows, or damaged surfaces. Close-up evidence photography with measurement scales. Clear documentation of the damage extent."
  } else if (report.incident_type === 'vehicle_theft') {
    specificPrompt = "Vehicle crime scene showing empty parking space or abandoned vehicle. Tire tracks, broken glass, or other evidence marked. Wide establishing shot of the location."
  } else {
    specificPrompt = "General crime scene with police investigators documenting evidence. Yellow police tape, evidence markers, and forensic equipment visible. Professional law enforcement photography."
  }

  // Add location context if available
  if (report.location_details) {
    specificPrompt += ` Scene location: ${report.location_details.toLowerCase()}.`
  }

  // Add evidence context
  if (report.evidence_description) {
    specificPrompt += ` Key evidence includes: ${report.evidence_description.toLowerCase()}.`
  }

  const finalPrompt = basePrompt + specificPrompt + " High-quality, realistic police documentation photography. No people visible in the photo, focus on the scene and evidence."
  
  console.log('Generated enhanced prompt for incident type:', report.incident_type)
  return finalPrompt
}

function getErrorType(error: Error): string {
  if (error.message.includes('OpenAI')) return 'OPENAI_ERROR'
  if (error.message.includes('Supabase') || error.message.includes('database')) return 'DATABASE_ERROR'
  if (error.message.includes('Missing')) return 'VALIDATION_ERROR'
  return 'UNKNOWN_ERROR'
}

function getErrorStatus(error: Error): number {
  if (error.message.includes('not configured') || error.message.includes('Missing')) return 400
  if (error.message.includes('not found')) return 404
  if (error.message.includes('OpenAI')) return 502
  return 500
}
