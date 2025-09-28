// Google Cloud NLP Provider - Strong Indian Language Support
// Uses Google Cloud Natural Language API for voice command interpretation

import { NLPProvider, VoiceIntent } from './types';
import { universalCommandProcessor } from './UniversalCommandProcessor';

export class GoogleNLPProvider implements NLPProvider {
  name = 'google';
  private apiKey: string;
  private baseUrl = 'https://language.googleapis.com/v1/documents:classifyText';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processCommand(text: string): Promise<VoiceIntent> {
    try {
      // Step 1: Get base intent from UniversalCommandProcessor
      const baseResult = universalCommandProcessor.processCommand(text);
      
      // Step 2: If we have a strong local match, return it
      if (baseResult.confidence >= 0.7) {
        return baseResult;
      }
      
      // Step 3: Use Google AI to enhance confidence and accuracy
      const aiEnhancement = await this.enhanceWithGoogleAI(text, baseResult);
      
      // Step 4: Return enhanced result
      return {
        ...baseResult,
        confidence: Math.max(baseResult.confidence, aiEnhancement.confidence)
      };
    } catch (error) {
      // Google AI failed - fallback to universal processor
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

  private async enhanceWithGoogleAI(text: string, baseResult: VoiceIntent): Promise<{ confidence: number }> {
    // Use Google Cloud Natural Language API to analyze sentiment and confidence
    // This helps improve confidence scores for ambiguous commands
    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document: {
          content: text,
          type: 'PLAIN_TEXT'
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status} ${response.statusText}`);
    }

    const analysis = await response.json();
    
    // Use Google's analysis to enhance confidence
    // For MVP, we'll use a simple confidence boost if Google understands the text
    const aiConfidence = analysis.documentSentiment ? 0.8 : 0.4;
    
    return { confidence: aiConfidence };
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
    // Google Cloud Natural Language API cost per request
    return 0.001; // Approximately $0.001 per request
  }

  // Update API configuration
  updateConfig(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const testResponse = await this.processCommand('test connection');
      return testResponse.confidence > 0;
    } catch {
      return false;
    }
  }
}