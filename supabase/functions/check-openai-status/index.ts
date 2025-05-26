
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../generate-mugshot/config.ts';
import { DiagnosticService } from '../generate-mugshot/diagnostic-service.ts';

serve(async (req: Request) => {
  console.log("Received OpenAI status check request");
  
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      return new Response(
        JSON.stringify({
          isConfigured: false,
          hasValidKey: false,
          hasBilling: false,
          hasQuota: false,
          canGenerateImages: false,
          errors: ['OpenAI API key not found in environment variables'],
          details: {}
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Initializing diagnostic service");
    const diagnosticService = new DiagnosticService(openaiKey);
    
    console.log("Running OpenAI status check");
    const statusCheck = await diagnosticService.checkOpenAIStatus();
    
    console.log("Status check completed:", statusCheck);
    
    return new Response(
      JSON.stringify(statusCheck),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in OpenAI status check:', error);
    
    return new Response(
      JSON.stringify({
        isConfigured: false,
        hasValidKey: false,
        hasBilling: false,
        hasQuota: false,
        canGenerateImages: false,
        errors: [`Diagnostic check failed: ${error.message}`],
        details: { error: error.message }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
