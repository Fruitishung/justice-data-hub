
import OpenAI from "https://esm.sh/openai@4.28.0"
import { BioMarkers } from "./types.ts";

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('OpenAI API key not configured');
    this.openai = new OpenAI({ apiKey });
  }

  private generatePhotoPrompt(bioMarkers: BioMarkers = {}): string {
    return `Generate a realistic police booking photograph (mugshot) with these EXACT specifications:
    
    MANDATORY REQUIREMENTS:
    1. Subject MUST be an ADULT (30-50 years old) - ABSOLUTELY NO CHILDREN OR MINORS
    2. Subject MUST have a neutral facial expression with NO SMILING
    3. Background MUST be a light blue or gray wall with visible height measurement lines
    4. Subject MUST be shown from shoulders up in a front-facing view
    5. Subject MUST be holding a black booking information placard with white text
    6. Lighting MUST be harsh and unflattering as typical in police stations
    7. Image MUST be documentary/photojournalistic style - NOT glamorized
    
    Physical characteristics:
    - Gender: ${bioMarkers?.gender || 'male'}
    - Height: ${bioMarkers?.height || '5\'10"'}
    - Build: ${bioMarkers?.weight || 'average'} build
    - Hair: ${bioMarkers?.hair || 'dark'} hair
    - Eyes: ${bioMarkers?.eyes || 'brown'} eyes
    
    This MUST appear as an official police booking photograph - NOT a casual or social media photo. NO social settings, NO phones, NO smiling.`;
  }

  async generateMugshot(bioMarkers?: BioMarkers): Promise<string> {
    try {
      const prompt = this.generatePhotoPrompt(bioMarkers);
      console.log("Generating image with prompt:", prompt);

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural",
        response_format: "url"
      });

      if (!response.data?.[0]?.url) {
        throw new Error('Invalid response from OpenAI API');
      }

      return response.data[0].url;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
