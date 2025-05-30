import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { OpenAIService } from './openai-service.ts';
import { ArrestTag, BioMarkers, Clients } from './types.ts';
import { FALLBACK_MUGSHOTS } from './config.ts';

// Track which fallback images have been used recently
const recentlyUsedImages = new Set<string>();

// Get a random fallback image that hasn't been used recently
export const getFallbackImage = (): string => {
  // If all images have been used recently, clear the tracking
  if (recentlyUsedImages.size >= FALLBACK_MUGSHOTS.length - 1) {
    recentlyUsedImages.clear();
  }
  
  // Find an image that hasn't been used recently
  let availableImages = FALLBACK_MUGSHOTS.filter(img => !recentlyUsedImages.has(img));
  if (availableImages.length === 0) {
    availableImages = [...FALLBACK_MUGSHOTS];
    recentlyUsedImages.clear();
  }
  
  // Select a random image from available ones
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const fallbackUrl = availableImages[randomIndex];
  
  // Mark this image as recently used
  recentlyUsedImages.add(fallbackUrl);
  
  console.log(`Using fallback image: ${fallbackUrl} (${recentlyUsedImages.size}/${FALLBACK_MUGSHOTS.length} recent images tracked)`);
  return fallbackUrl;
};

// Download image from URL and upload to Supabase Storage
const downloadAndStoreImage = async (supabase: any, imageUrl: string, fileName: string): Promise<string> => {
  try {
    console.log(`Downloading image from: ${imageUrl.substring(0, 50)}...`);
    
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    
    const imageBlob = await response.blob();
    console.log(`Downloaded image blob, size: ${imageBlob.size} bytes`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('mugshots')
      .upload(fileName, imageBlob, {
        contentType: imageBlob.type || 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload to storage: ${error.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('mugshots')
      .getPublicUrl(fileName);

    console.log(`Image stored successfully at: ${publicUrl.substring(0, 50)}...`);
    return publicUrl;
  } catch (error) {
    console.error('Error downloading and storing image:', error);
    throw error;
  }
};

// Client initialization
export const initializeClients = (): Clients => {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  if (!openaiKey) {
    console.error('OpenAI API key not found in environment variables');
    throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your Supabase secrets.');
  }

  console.log(`Initializing clients. Supabase URL exists: ${!!supabaseUrl}, OpenAI key exists: ${!!openaiKey}, Key length: ${openaiKey.length}`);
  
  try {
    const openaiService = new OpenAIService(openaiKey);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    return { openaiService, supabase };
  } catch (error) {
    console.error('Error initializing OpenAI service:', error);
    throw new Error(`Failed to initialize OpenAI service: ${error.message}`);
  }
};

// Verify arrest tag exists
export const verifyArrestTag = async (supabase: any, arrestTagId: string): Promise<ArrestTag> => {
  // Skip verification for test/dev photos
  if (arrestTagId.startsWith('test-') || arrestTagId.includes('test')) {
    console.log(`Using test arrest tag: ${arrestTagId}`);
    return { id: arrestTagId, suspect_name: "Test Subject" };
  }

  console.log(`Verifying arrest tag: ${arrestTagId}`);
  
  try {
    const { data, error } = await supabase
      .from('arrest_tags')
      .select('id, suspect_name')
      .eq('id', arrestTagId)
      .maybeSingle();

    if (error) {
      console.error(`Database error when verifying arrest tag: ${error.message}`);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      console.error(`Arrest tag not found: ${arrestTagId}`);
      throw new Error('Arrest tag not found');
    }
    
    console.log(`Verified arrest tag: ${arrestTagId}`);
    return data;
  } catch (error) {
    console.error(`Error verifying arrest tag: ${error.message}`);
    throw error;
  }
};

// Update arrest tag with new mugshot
export const updateArrestTag = async (supabase: any, arrestTagId: string, imageUrl: string): Promise<void> => {
  try {
    console.log(`Updating arrest tag ${arrestTagId} with mugshot URL`);
    
    const { error } = await supabase
      .from('arrest_tags')
      .update({
        mugshot_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', arrestTagId);

    if (error) {
      console.error(`Failed to update arrest tag: ${error.message}`);
      throw new Error(`Failed to update arrest tag: ${error.message}`);
    }
    
    console.log(`Successfully updated arrest tag ${arrestTagId}`);
  } catch (error) {
    console.error(`Error updating arrest tag: ${error.message}`);
    throw error;
  }
};

// Generate mugshot using OpenAI service or fallback and store it
export const generateMugshot = async (openaiService: any, supabase: any, bioMarkers?: BioMarkers): Promise<string> => {
  try {
    console.log("Attempting to generate mugshot with bioMarkers:", bioMarkers);
    
    // Validate bioMarkers and ensure they're properly formatted
    const validatedBioMarkers = {
      gender: bioMarkers?.gender || 'male',
      height: bioMarkers?.height || '5\'10"',
      weight: bioMarkers?.weight || 'average',
      hair: bioMarkers?.hair || 'dark',
      eyes: bioMarkers?.eyes || 'brown',
      name: bioMarkers?.name || 'John Doe',
      charges: bioMarkers?.charges || 'PC 459 - Burglary',
      // Add random seed to ensure uniqueness on each call
      seed: Math.random().toString(36).substring(2, 15)
    };
    
    console.log("Using validated bioMarkers:", validatedBioMarkers);
    
    let tempImageUrl: string;
    let isOpenAIGenerated = false;
    
    try {
      tempImageUrl = await openaiService.generateMugshot(validatedBioMarkers);
      isOpenAIGenerated = true;
      console.log("Successfully generated mugshot from OpenAI");
    } catch (error) {
      console.error('Error generating mugshot with OpenAI:', error);
      
      // Log specific error details for debugging
      if (error.message?.includes('API key')) {
        console.error('OpenAI API key issue detected');
      } else if (error.message?.includes('quota')) {
        console.error('OpenAI quota/billing issue detected');
      } else {
        console.error('General OpenAI API error:', error.message);
      }
      
      // Use fallback image
      console.log('Falling back to placeholder image due to OpenAI error');
      tempImageUrl = getFallbackImage();
      isOpenAIGenerated = false;
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const source = isOpenAIGenerated ? 'openai' : 'fallback';
    const fileName = `mugshot_${source}_${timestamp}_${randomId}.png`;
    
    // Download and store the image in Supabase Storage
    console.log("Storing image in Supabase Storage...");
    const storedImageUrl = await downloadAndStoreImage(supabase, tempImageUrl, fileName);
    
    console.log("Image successfully stored and accessible at:", storedImageUrl.substring(0, 50) + "...");
    return storedImageUrl;
    
  } catch (storageError) {
    console.error('Error storing image:', storageError);
    
    // If storage fails, return the original temporary URL as fallback
    console.log('Storage failed, returning temporary URL as fallback');
    return getFallbackImage();
  }
};
