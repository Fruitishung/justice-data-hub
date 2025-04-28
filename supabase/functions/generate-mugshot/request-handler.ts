
import { RequestBody, ResponseData } from './types.ts';
import { corsHeaders } from './config.ts';

// Parse and validate request body
export const parseRequestBody = async (req: Request): Promise<RequestBody> => {
  try {
    const body = await req.json();
    if (!body.arrest_tag_id) {
      throw new Error('Missing arrest_tag_id');
    }
    return body as RequestBody;
  } catch (e) {
    throw new Error(`Invalid request body: ${e.message}`);
  }
};

// Create successful response
export const createSuccessResponse = (imageUrl: string): Response => {
  const responseData: ResponseData = {
    success: true,
    message: 'Mugshot generated successfully',
    mugshot_url: imageUrl,
    timestamp: new Date().toISOString()
  };

  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

// Create error response
export const createErrorResponse = (error: Error, fallbackUrl: string): Response => {
  const responseData: ResponseData = {
    success: false,
    error: error.message,
    message: 'Using fallback image due to error',
    mugshot_url: fallbackUrl,
    timestamp: new Date().toISOString()
  };

  return new Response(
    JSON.stringify(responseData),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};
