
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Sending request to OpenAI with text:', text);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Changed to a valid model
        messages: [
          {
            role: 'system',
            content: 'You are a professional editor. Correct any spelling or grammar mistakes in the text. Keep the same meaning but make it more professional and clear. Only return the corrected text, nothing else.'
          },
          { role: 'user', content: text }
        ],
      }),
    });

    const responseData = await response.json();
    
    // Log the OpenAI response for debugging
    console.log('OpenAI API response:', JSON.stringify(responseData));

    if (!response.ok) {
      console.error('OpenAI API error:', responseData);
      throw new Error(responseData.error?.message || 'Failed to correct text');
    }

    if (!responseData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const correctedText = responseData.choices[0].message.content;

    return new Response(
      JSON.stringify({ correctedText }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in correct-text function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to correct text',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
