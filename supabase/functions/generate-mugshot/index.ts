
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './config.ts';
import { 
  initializeClients, 
  verifyArrestTag, 
  updateArrestTag, 
  generateMugshot, 
  getFallbackImage 
} from './service.ts';
import { 
  parseRequestBody,
  createSuccessResponse,
  createErrorResponse
} from './request-handler.ts';

// Main request handler
serve(async (req: Request) => {
  console.log("Received generate-mugshot request");
  
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body");
    const { arrest_tag_id, photo_type, bio_markers } = await parseRequestBody(req);
    console.log('Processing request:', { arrest_tag_id, photo_type, bio_markers });

    console.log("Initializing clients");
    const { openaiService, supabase } = initializeClients();

    if (photo_type !== 'ai') {
      console.log("Verifying arrest tag for non-AI photo");
      await verifyArrestTag(supabase, arrest_tag_id);
    }

    console.log("Generating mugshot");
    const imageUrl = await generateMugshot(openaiService, bio_markers);
    console.log(`Generated mugshot URL: ${imageUrl.substring(0, 50)}...`);

    if (!arrest_tag_id.includes('test') && photo_type !== 'ai') {
      console.log("Updating arrest tag with new mugshot");
      await updateArrestTag(supabase, arrest_tag_id, imageUrl);
    }

    console.log("Sending success response");
    return createSuccessResponse(imageUrl);

  } catch (error) {
    console.error('Error processing request:', error);
    const fallbackUrl = getFallbackImage();
    console.log(`Using fallback image: ${fallbackUrl.substring(0, 50)}...`);
    return createErrorResponse(error, fallbackUrl);
  }
});
