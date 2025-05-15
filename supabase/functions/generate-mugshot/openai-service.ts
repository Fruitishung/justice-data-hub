
import OpenAI from "https://esm.sh/openai@4.28.0"
import { BioMarkers } from "./types.ts";

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('OpenAI API key not configured');
    this.openai = new OpenAI({ apiKey });
    console.log("OpenAI client initialized");
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
    
    return `Generate a realistic police booking photograph (mugshot) with these EXACT specifications:
    
    MANDATORY REQUIREMENTS:
    1. Subject MUST be an ADULT (30-50 years old) - ABSOLUTELY NO CHILDREN OR MINORS
    2. Subject MUST have a neutral facial expression with NO SMILING
    3. Background MUST be a light blue or gray wall with visible height measurement lines
    4. Subject MUST be shown from shoulders up in a front-facing view
    5. Subject MUST be holding a black booking information placard with white text showing their name and date
    6. Lighting MUST be harsh and unflattering as typical in police stations
    7. Image MUST be documentary/photojournalistic style - NOT glamorized
    
    Physical characteristics:
    - Gender: ${gender}
    - Height: ${height}
    - Build: ${weight} build
    - Hair: ${hair} hair
    - Eyes: ${eyes} eyes
    
    Booking information:
    - Name: ${name}
    - Charges: ${charges}
    - Date: ${new Date().toLocaleDateString()}
    
    This MUST appear as an official police booking photograph - NOT a casual or social media photo. NO social settings, NO phones, NO smiling.`;
  }

  async generateMugshot(bioMarkers?: BioMarkers): Promise<string> {
    try {
      console.log("bioMarkers received in generateMugshot:", JSON.stringify(bioMarkers));
      const prompt = this.generatePhotoPrompt(bioMarkers);
      console.log("Generating image with prompt length:", prompt.length);
      console.log("First 100 chars of prompt:", prompt.substring(0, 100));

      console.log("Making OpenAI API request");
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
        response_format: "url"
      });

      console.log("OpenAI API response received");
      
      if (!response.data?.[0]?.url) {
        console.error('Invalid response from OpenAI API:', response);
        throw new Error('Invalid response from OpenAI API');
      }

      console.log("Image URL received from OpenAI");
      return response.data[0].url;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
