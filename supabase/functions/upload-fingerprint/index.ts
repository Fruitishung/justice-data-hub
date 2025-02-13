
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fingerprintData, position, incidentReportId } = await req.json()
    
    if (!fingerprintData) {
      throw new Error('No fingerprint data provided')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Convert base64 to Uint8Array
    const binaryData = Uint8Array.from(atob(fingerprintData), c => c.charCodeAt(0))
    
    const fileName = `${incidentReportId}_${position}_${Date.now()}.png`

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fingerprint_scans')
      .upload(fileName, binaryData, {
        contentType: 'image/png',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('fingerprint_scans')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ 
        success: true,
        fileName,
        publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error uploading fingerprint:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
