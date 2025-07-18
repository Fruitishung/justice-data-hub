
import OpenAI from "https://esm.sh/openai@4.28.0"
import { BioMarkers } from "./types.ts";

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('OpenAI API key not configured');
    
    // Initialize with minimal configuration for better Deno compatibility
    this.openai = new OpenAI({ 
      apiKey: apiKey,
      // Remove custom headers that cause Deno issues
      defaultHeaders: {},
      maxRetries: 3,
      timeout: 60000
    });
    console.log("OpenAI client initialized successfully");
  }

  private generatePhotoPrompt(bioMarkers: BioMarkers = {}): string {
    // Ensure we have default values for all bioMarkers
    const gender = bioMarkers?.gender || 'male';
    const height = bioMarkers?.height || '5\'10"';
    const weight = bioMarkers?.weight || 'average';
    const hair = bioMarkers?.hair || 'dark';
    const eyes = bioMarkers?.eyes || 'brown';
    const name = bioMarkers?.name || 'John Doe';
    const charges = bioMarkers?.charges || 'PC 459 - Burglary';
    
    console.log(`Generating prompt with bioMarkers: gender=${gender}, height=${height}, weight=${weight}, hair=${hair}, eyes=${eyes}, name=${name}, charges=${charges}`);
    
    return `Generate a realistic police booking photograph (mugshot) of a HUMAN PERSON with these EXACT specifications:
    
    CRITICAL: This MUST be a photograph of a HUMAN ADULT PERSON - NOT objects, food, animals, or anything else.
    
    MANDATORY REQUIREMENTS:
    1. Subject MUST be a HUMAN ADULT (30-50 years old) - ABSOLUTELY NO CHILDREN OR MINORS
    2. Subject MUST have a neutral, serious facial expression with NO SMILING
    3. Background MUST be a plain light blue or gray wall with visible height measurement lines
    4. Subject MUST be shown from shoulders up in a front-facing view
    5. Subject MUST be holding a black booking information placard with white text
    6. Lighting MUST be harsh institutional lighting as typical in police stations
    7. Image MUST be documentary/photojournalistic style - NOT glamorized
    8. This is a PROFESSIONAL POLICE PHOTOGRAPH of a HUMAN PERSON
    
    SPECIFIC PHYSICAL CHARACTERISTICS TO MATCH EXACTLY:
    - Gender: ${gender}
    - Height: ${height}
    - Build: ${weight} build
    - Hair: ${hair} hair color
    - Eyes: ${eyes} eyes
    
    BOOKING INFORMATION TO DISPLAY:
    - Name: ${name}
    - Charges: ${charges}
    - Date: ${new Date().toLocaleDateString()}
    
    The subject must be a HUMAN PERSON who clearly matches these physical characteristics: ${gender} person with ${hair} hair, ${eyes} eyes, ${height} tall with ${weight} build. This MUST appear as an official police booking photograph of a HUMAN PERSON - NOT a casual photo, NOT objects, NOT food items, NOT animals. NO social settings, NO phones, NO smiling. Professional mugshot style only. Generate a HUMAN FACE AND SHOULDERS.`;
  }

  async generateMugshot(bioMarkers?: BioMarkers): Promise<string> {
    try {
      console.log("bioMarkers received in generateMugshot:", JSON.stringify(bioMarkers));
      const prompt = this.generatePhotoPrompt(bioMarkers);
      console.log("Generating image with prompt length:", prompt.length);
      console.log("First 100 chars of prompt:", prompt.substring(0, 100));

      console.log("Making OpenAI API request");
      
      // Use the correct method call for the OpenAI library
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      console.log("OpenAI API response received successfully");
      
      if (!response.data?.[0]?.url) {
        console.error('Invalid response from OpenAI API:', response);
        throw new Error('Invalid response from OpenAI API');
      }

      console.log("Image URL received from OpenAI:", response.data[0].url.substring(0, 50) + "...");
      return response.data[0].url;
    } catch (error) {
      console.error('OpenAI API error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        status: error.status
      });
      
      // Provide more specific error information based on error type
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits at https://platform.openai.com/usage');
      }
      if (error.code === 'invalid_api_key') {
        throw new Error('OpenAI API key is invalid. Please check your API key configuration.');
      }
      if (error.code === 'billing_not_active') {
        throw new Error('OpenAI billing is not active. Please set up billing at https://platform.openai.com/billing');
      }
      if (error.message?.includes('content_policy')) {
        throw new Error('Content policy violation - the prompt was rejected by OpenAI safety filters');
      }
      if (error.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please wait and try again.');
      }
      if (error.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      }
      
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}
