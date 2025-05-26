
import OpenAI from "https://esm.sh/openai@4.28.0"

export class DiagnosticService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('OpenAI API key not configured');
    
    this.openai = new OpenAI({ 
      apiKey: apiKey,
      defaultHeaders: {},
      maxRetries: 1,
      timeout: 30000
    });
  }

  async checkOpenAIStatus(): Promise<{
    isConfigured: boolean;
    hasValidKey: boolean;
    hasBilling: boolean;
    hasQuota: boolean;
    canGenerateImages: boolean;
    errors: string[];
    details: any;
  }> {
    const result = {
      isConfigured: false,
      hasValidKey: false,
      hasBilling: false,
      hasQuota: false,
      canGenerateImages: false,
      errors: [] as string[],
      details: {} as any
    };

    try {
      // Test 1: Check if API key is valid by making a simple request
      console.log("Testing OpenAI API key validity...");
      const modelsResponse = await this.openai.models.list();
      result.hasValidKey = true;
      result.details.modelsCount = modelsResponse.data?.length || 0;
      console.log(`✓ API key is valid. Found ${result.details.modelsCount} models.`);

      // Test 2: Try to make a small image generation request to test billing/quota
      console.log("Testing image generation capability...");
      try {
        const testResponse = await this.openai.images.generate({
          model: "dall-e-3",
          prompt: "A simple test image of a blue circle",
          n: 1,
          size: "1024x1024",
          quality: "standard"
        });

        if (testResponse.data?.[0]?.url) {
          result.hasBilling = true;
          result.hasQuota = true;
          result.canGenerateImages = true;
          result.details.testImageUrl = testResponse.data[0].url;
          console.log("✓ Image generation successful - billing and quota are active");
        }
      } catch (imageError: any) {
        console.log("Image generation test failed:", imageError.message);
        
        if (imageError.code === 'insufficient_quota') {
          result.errors.push('OpenAI quota exceeded. Please check your usage limits.');
          result.details.quotaError = true;
        } else if (imageError.code === 'billing_not_active') {
          result.errors.push('OpenAI billing is not active. Please set up billing.');
          result.details.billingError = true;
        } else if (imageError.status === 429) {
          result.errors.push('Rate limit exceeded. Your API key works but you\'re hitting rate limits.');
          result.hasQuota = true; // Rate limit means billing is working
          result.hasBilling = true;
        } else {
          result.errors.push(`Image generation failed: ${imageError.message}`);
        }
      }

      result.isConfigured = result.hasValidKey;

    } catch (error: any) {
      console.error('OpenAI diagnostic check failed:', error);
      
      if (error.code === 'invalid_api_key' || error.status === 401) {
        result.errors.push('Invalid OpenAI API key. Please check your API key configuration.');
      } else if (error.status === 429) {
        result.errors.push('OpenAI API rate limit exceeded.');
        result.hasValidKey = true; // Rate limit means the key is valid
      } else {
        result.errors.push(`OpenAI API error: ${error.message}`);
      }
    }

    return result;
  }
}
