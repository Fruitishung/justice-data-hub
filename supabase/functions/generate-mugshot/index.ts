
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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate mugshot using DALL-E
    const prompt = `A front-facing police mugshot photo of a person in front of a gray background with height measurements visible. The photo should be well-lit, clear, and realistic, capturing a neutral facial expression. Documentary style, professional lighting.`;
    
    console.log('Making request to DALL-E API...');
    const openAIResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`,
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
      const errorData = await openAIResponse.json();
      console.error('DALL-E API Error:', errorData);
      throw new Error(`DALL-E API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const aiResponse = await openAIResponse.json();
    if (!aiResponse.data?.[0]?.url) {
      throw new Error('No image URL received from DALL-E');
    }

    const imageUrl = aiResponse.data[0].url;
    console.log('Successfully generated image:', imageUrl);

    // Download the image
    console.log('Downloading generated image...');
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    console.log('Uploading to Supabase storage...');
    const fileName = `${arrest_tag_id}_${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('suspect_mugshots')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('suspect_mugshots')
      .getPublicUrl(fileName);

    console.log('Successfully uploaded image, public URL:', publicUrl);

    // Update the arrest tag with the mugshot URL
    const { error: updateError } = await supabase
      .from('arrest_tags')
      .update({ mugshot_url: publicUrl })
      .eq('id', arrest_tag_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update arrest tag: ${updateError.message}`);
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
    console.error('Error in generate-mugshot function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
