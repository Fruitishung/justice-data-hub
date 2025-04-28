
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { arrest_tag_id, photo_type, bio_markers } = await parseRequestBody(req);
    console.log('Processing request:', { arrest_tag_id, photo_type, bio_markers });

    const { openaiService, supabase } = initializeClients();

    if (photo_type !== 'ai') {
      await verifyArrestTag(supabase, arrest_tag_id);
    }

    const imageUrl = await generateMugshot(openaiService, bio_markers);

    if (!arrest_tag_id.includes('test') && photo_type !== 'ai') {
      await updateArrestTag(supabase, arrest_tag_id, imageUrl);
    }

    return createSuccessResponse(imageUrl);

  } catch (error) {
    console.error('Error processing request:', error);
    const fallbackUrl = getFallbackImage();
    return createErrorResponse(error, fallbackUrl);
  }
});
