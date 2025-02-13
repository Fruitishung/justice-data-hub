
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { penal_code } = await req.json();

    if (!penal_code) {
      throw new Error('Penal code is required');
    }

    // Generate a realistic but safe prompt based on the penal code
    let prompt = '';
    if (penal_code === '187') {
      prompt = 'A crime scene with police tape, forensic markers, and investigators working. Dark mood, professional documentary style photography.';
    } else if (penal_code === '211') {
      prompt = 'A commercial storefront with police tape and evidence markers. Security camera perspective, documentary style.';
    }

    // Call OpenAI's DALL-E API to generate the image
    const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Failed to generate image with DALL-E');
    }

    const aiResponse = await openAIResponse.json();
    const imageUrl = aiResponse.data[0].url;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const fileName = `${crypto.randomUUID()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('ai_crime_scene_photos')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Create a record in the ai_crime_scene_photos table
    const { data: photoRecord, error: dbError } = await supabase
      .from('ai_crime_scene_photos')
      .insert([
        {
          image_path: fileName,
          prompt_used: prompt,
          penal_code: penal_code,
        }
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: photoRecord
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
