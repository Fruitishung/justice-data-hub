
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FingerprintData {
  position: string;
  scanData: string;
  quality: number;
  timestamp: string;
}

interface StudentMatch {
  id: string;
  name: string;
  similarity: number;
  matchedFingerPosition: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fingerprint } = await req.json()
    const { position, scanData, quality } = fingerprint as FingerprintData

    console.log(`Analyzing fingerprint for position: ${position}`)

    // Get all fingerprints from database for comparison
    const { data: existingScans, error: fetchError } = await supabaseClient
      .from('fingerprint_scans')
      .select('*')
      .neq('finger_position', position)
    
    if (fetchError) {
      throw new Error(`Error fetching fingerprints: ${fetchError.message}`)
    }

    // Simple minutiae analysis simulation
    const matches = existingScans.map(scan => {
      const similarity = compareFingerprints(scanData, scan.scan_data)
      return {
        scan_id: scan.id,
        incident_report_id: scan.incident_report_id,
        similarity_score: similarity,
        matched_position: scan.finger_position
      }
    })

    // Filter for high confidence matches
    const significantMatches = matches
      .filter(m => m.similarity_score > 0.7)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, 5) // Get top 5 matches

    // Get student information for matches
    const matchDetails = await Promise.all(
      significantMatches.map(async (match) => {
        const { data: report } = await supabaseClient
          .from('incident_reports')
          .select('suspect_details')
          .eq('id', match.incident_report_id)
          .single()

        return {
          id: match.incident_report_id,
          name: report?.suspect_details?.first_name 
            ? `${report.suspect_details.first_name} ${report.suspect_details.last_name}`
            : 'Unknown',
          similarity: match.similarity_score,
          matchedFingerPosition: match.matched_position
        }
      })
    )

    return new Response(
      JSON.stringify({
        matches: matchDetails,
        analyzed_at: new Date().toISOString(),
        total_comparisons: matches.length
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in analyze-fingerprints:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

// Simulated fingerprint comparison function
function compareFingerprints(scan1: string, scan2: string): number {
  const features1 = extractFeatures(scan1)
  const features2 = extractFeatures(scan2)
  
  const commonFeatures = features1.filter(f => features2.includes(f))
  return commonFeatures.length / Math.max(features1.length, features2.length)
}

function extractFeatures(scanData: string): string[] {
  return scanData.split('').filter((_, i) => i % 3 === 0)
}
