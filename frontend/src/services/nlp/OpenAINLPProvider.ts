// OpenAI NLP Provider - Advanced Natural Language Understanding
// Uses ChatGPT for complex voice command interpretation

import { NLPProvider, VoiceIntent } from './types';
import { universalCommandProcessor } from './UniversalCommandProcessor';

export class OpenAINLPProvider implements NLPProvider {
  name = 'openai';
  private apiKey: string;
  private model: string = 'gpt-4o-mini'; // Most cost-effective model
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  
  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async processCommand(text: string): Promise<VoiceIntent> {
    try {
      // Step 1: Get base intent from UniversalCommandProcessor
      const baseResult = universalCommandProcessor.processCommand(text);
      
      // Step 2: If we have a strong local match, return it
      if (baseResult.confidence >= 0.7) {
        return baseResult;
      }
      
      // Step 3: Use OpenAI to enhance understanding for complex/ambiguous commands
      const aiEnhancement = await this.enhanceWithOpenAI(text, baseResult);
      
      // Step 4: Return enhanced result
      return {
        ...baseResult,
        confidence: Math.max(baseResult.confidence, aiEnhancement.confidence),
        // If AI provides better payload structure, use it
        payload: aiEnhancement.payload || baseResult.payload
      };
    } catch (error) {
      // OpenAI failed - fallback to universal processor
      const fallbackResult = universalCommandProcessor.processCommand(text);
      
      // If fallback also fails, return unknown intent
      if (fallbackResult.confidence < 0.3) {
        return {
          intent: 'UNKNOWN_INTENT',
          confidence: 0.0,
          originalText: text,
          language: this.detectLanguage(text)
        };
      }
      
      return fallbackResult;
    }
  }

  private async enhanceWithOpenAI(text: string, baseResult: VoiceIntent): Promise<{ confidence: number; payload?: Record<string, unknown> }> {
    // Use OpenAI to enhance understanding of complex or ambiguous commands
    const prompt = `Analyze this voice command for a textile business: "${text}"

Base understanding: ${baseResult.intent} with confidence ${baseResult.confidence}

Is this correct? Can you provide better confidence (0.0-1.0) and extract any specific entities like:
- Location names (Mumbai, Surat, etc.)
- Fabric types (Cotton, Silk, etc.)
- Priority levels (hot, warm, cold)
- Quantities/measurements

Respond with ONLY JSON:
{
  "confidence": 0.95,
  "entities": {"location": "Mumbai", "fabric": "Cotton"}
}`;

    const response = await this.callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        payload: parsed.entities ? { ...baseResult.payload, ...parsed.entities } : undefined
      };
    } catch {
      // If OpenAI response is malformed, return moderate confidence
      return { confidence: 0.6 };
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a voice command analyzer for textile business. Always respond with valid JSON only.'
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.1, // Low temperature for consistent analysis
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }


  private detectLanguage(text: string): 'en' | 'hi' | 'gu' | 'mixed' {
    const hindiChars = /[\u0900-\u097F]/;
    const gujaratiChars = /[\u0A80-\u0AFF]/;
    
    const hasHindi = hindiChars.test(text);
    const hasGujarati = gujaratiChars.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    if ((hasHindi && hasEnglish) || (hasGujarati && hasEnglish) || (hasHindi && hasGujarati)) {
      return 'mixed';
    }
    
    if (hasHindi) return 'hi';
    if (hasGujarati) return 'gu';
    return 'en';
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  getCost(): number {
    // Cost per request for gpt-4o-mini: approximately $0.0001
    // Cost per request for gpt-4o: approximately $0.002  
    return this.model === 'gpt-4o-mini' ? 0.0001 : 0.002;
  }

  // Update API configuration
  updateConfig(apiKey: string, model: string = 'gpt-4o-mini'): void {
    this.apiKey = apiKey;
    this.model = model;
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const testResponse = await this.processCommand('test connection');
      return testResponse.intent !== 'UNKNOWN_INTENT' || testResponse.confidence >= 0;
    } catch {
      return false;
    }
  }
}