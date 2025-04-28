
// Configuration constants for the mugshot generator

// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fallback images if generation fails
export const FALLBACK_MUGSHOTS = [
  "https://images.unsplash.com/photo-1589279715734-6631a314dfa2?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584650589355-e219e23d9775?q=80&w=1024&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551129923-db84575e0c30?q=80&w=1024&auto=format&fit=crop"
];
