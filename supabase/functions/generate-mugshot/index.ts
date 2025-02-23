
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
    // Log the request body for debugging
    const body = await req.json();
    console.log('Request body:', body);
    const { suspect_name, arrest_tag_id } = body;

    if (!suspect_name || !arrest_tag_id) {
      console.error('Missing required fields:', { suspect_name, arrest_tag_id });
      throw new Error('Suspect name and arrest tag ID are required');
    }

    // Verify OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('OpenAI API Key present:', !!openAIApiKey);
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log('Supabase credentials present:', {
      url: !!supabaseUrl,
      key: !!supabaseKey
    });

    const supabase = createClient(
      supabaseUrl ?? '',
      supabaseKey ?? ''
    );

    // Generate mugshot using DALL-E
    const prompt = `A front-facing police mugshot photo of a person in front of a gray background with height measurements visible. The photo should be well-lit, clear, and realistic, capturing a neutral facial expression. Documentary style, professional lighting.`;
    
    console.log('Making request to DALL-E API...');
    try {
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

      console.log('DALL-E API response status:', openAIResponse.status);

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        console.error('DALL-E API Error:', errorData);
        throw new Error(`DALL-E API error: ${JSON.stringify(errorData)}`);
      }

      const aiResponse = await openAIResponse.json();
      console.log('DALL-E API response:', aiResponse);

      if (!aiResponse.data?.[0]?.url) {
        throw new Error('No image URL received from DALL-E');
      }

      const imageUrl = aiResponse.data[0].url;
      console.log('Successfully generated image URL:', imageUrl);

      // Download the image
      console.log('Downloading generated image...');
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download generated image: ${imageResponse.status}`);
      }
      const imageBlob = await imageResponse.blob();
      console.log('Image downloaded successfully, size:', imageBlob.size);

      // Upload to Supabase Storage
      console.log('Uploading to Supabase storage...');
      const fileName = `${arrest_tag_id}_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('suspect_mugshots')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('suspect_mugshots')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

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

    } catch (dallEError) {
      console.error('DALL-E processing error:', dallEError);
      throw dallEError;
    }

  } catch (error) {
    console.error('Error in generate-mugshot function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
