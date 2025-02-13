
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
  patternType?: string;
  ridgeCount?: number;
  whorlPattern?: string;
  handDominance?: string;
}

interface MinutiaePoint {
  x: number;
  y: number;
  type: 'ending' | 'bifurcation';
  angle: number;
}

function analyzeMinutiae(scanData: string): { 
  minutiaePoints: MinutiaePoint[];
  ridgeCount: number;
  pattern: string;
  whorlType?: string;
} {
  // Simulate minutiae extraction and pattern analysis
  const dataLength = scanData.length;
  const minutiaePoints: MinutiaePoint[] = [];
  
  // Generate simulated minutiae points based on scan data
  for (let i = 0; i < dataLength; i += 20) {
    if (Math.random() > 0.7) {
      minutiaePoints.push({
        x: Math.floor(Math.random() * 500),
        y: Math.floor(Math.random() * 500),
        type: Math.random() > 0.5 ? 'ending' : 'bifurcation',
        angle: Math.floor(Math.random() * 360)
      });
    }
  }

  // Simulate ridge counting
  const ridgeCount = Math.floor(minutiaePoints.length * 1.5);

  // Determine pattern type based on data characteristics
  const patterns = ['Arch', 'Tented Arch', 'Right Loop', 'Left Loop', 'Whorl', 'Double Loop', 'Central Pocket Loop', 'Accidental'];
  const patternIndex = Math.floor(
    (parseInt(scanData.slice(0, 2), 36) / 36) * patterns.length
  );
  const pattern = patterns[patternIndex];

  // For whorls, determine the specific type
  const whorlTypes = ['Plain', 'Central Pocket', 'Double Loop', 'Accidental'];
  const whorlType = pattern.includes('Whorl') || pattern.includes('Loop') 
    ? whorlTypes[Math.floor(Math.random() * whorlTypes.length)]
    : undefined;

  return {
    minutiaePoints,
    ridgeCount,
    pattern,
    whorlType
  };
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

    // Extract features and analyze pattern
    const analysis = analyzeMinutiae(scanData);

    // Store minutiae points and analysis results
    const { data: savedScan, error: updateError } = await supabaseClient
      .from('fingerprint_scans')
      .update({
        minutiae_points: analysis.minutiaePoints,
        ridge_count: analysis.ridgeCount,
        pattern_type: analysis.pattern,
        whorl_pattern: analysis.whorlType
      })
      .eq('finger_position', position)
      .eq('scan_data', scanData)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating scan analysis: ${updateError.message}`);
    }

    // Get all fingerprints from database for comparison
    const { data: existingScans, error: fetchError } = await supabaseClient
      .from('fingerprint_scans')
      .select('*, incident_reports!inner(*)')
      .neq('finger_position', position);
    
    if (fetchError) {
      throw new Error(`Error fetching fingerprints: ${fetchError.message}`)
    }

    // Enhanced minutiae-based comparison
    const matches = existingScans.map(scan => {
      const similarity = compareMinutiae(
        analysis.minutiaePoints,
        scan.minutiae_points || []
      );

      return {
        scan_id: scan.id,
        incident_report_id: scan.incident_report_id,
        similarity_score: similarity,
        matched_position: scan.finger_position
      };
    });

    // Store significant matches
    const significantMatches = matches.filter(m => m.similarity_score > 0.7);
    for (const match of significantMatches) {
      await supabaseClient
        .from('fingerprint_matches')
        .insert({
          scan_id: savedScan.id,
          matched_scan_id: match.scan_id,
          similarity_score: match.similarity_score
        });
    }

    // Get suspect biometric data for matches
    const matchDetails = await Promise.all(
      significantMatches.map(async (match) => {
        const { data: biometricData } = await supabaseClient
          .from('suspect_biometrics')
          .select('*')
          .eq('incident_report_id', match.incident_report_id)
          .single();

        return {
          id: match.incident_report_id,
          name: biometricData?.suspect_name || 'Unknown',
          similarity: match.similarity_score,
          matchedFingerPosition: match.matched_position,
          patternType: biometricData?.fingerprint_classification,
          handDominance: biometricData?.hand_dominance
        };
      })
    );

    return new Response(
      JSON.stringify({
        matches: matchDetails,
        analysis: {
          pattern: analysis.pattern,
          ridgeCount: analysis.ridgeCount,
          minutiaeCount: analysis.minutiaePoints.length,
          whorlType: analysis.whorlType
        },
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

// Enhanced fingerprint comparison using minutiae points
function compareMinutiae(points1: MinutiaePoint[], points2: MinutiaePoint[]): number {
  if (!points1.length || !points2.length) return 0;

  let matchCount = 0;
  const threshold = {
    distance: 10, // pixel distance tolerance
    angle: 15     // degree angle tolerance
  };

  for (const p1 of points1) {
    for (const p2 of points2) {
      // Check if points match within tolerance
      const distance = Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
      );
      const angleDiff = Math.abs(p1.angle - p2.angle);
      
      if (distance <= threshold.distance && 
          angleDiff <= threshold.angle && 
          p1.type === p2.type) {
        matchCount++;
        break; // Count each point only once
      }
    }
  }

  // Calculate similarity score
  return matchCount / Math.max(points1.length, points2.length);
}
