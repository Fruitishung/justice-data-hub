
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
    const { suspect_name, arrest_tag_id } = await req.json();

    if (!suspect_name || !arrest_tag_id) {
      throw new Error('Suspect name and arrest tag ID are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate mugshot using DALL-E
    const prompt = `A front-facing police mugshot photo of a person in front of a gray background with height measurements visible. The photo should be well-lit, clear, and realistic, capturing a neutral facial expression. Documentary style, professional lighting.`;
    
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
      throw new Error('Failed to generate mugshot with DALL-E');
    }

    const aiResponse = await openAIResponse.json();
    const imageUrl = aiResponse.data[0].url;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const fileName = `${arrest_tag_id}_${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('suspect_mugshots')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('suspect_mugshots')
      .getPublicUrl(fileName);

    // Update the arrest tag with the mugshot URL
    const { error: updateError } = await supabase
      .from('arrest_tags')
      .update({ mugshot_url: publicUrl })
      .eq('id', arrest_tag_id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        mugshot_url: publicUrl
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
