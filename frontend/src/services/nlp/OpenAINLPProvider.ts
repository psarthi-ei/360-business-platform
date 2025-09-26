// OpenAI NLP Provider - Advanced Natural Language Understanding
// Uses ChatGPT for complex voice command interpretation

import { NLPProvider, VoiceIntent } from './types';

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
      const response = await this.callOpenAI(text);
      return this.parseOpenAIResponse(text, response);
    } catch (error) {
      // OpenAI NLP Error occurred
      return {
        intent: 'UNKNOWN_INTENT',
        confidence: 0.0,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
  }

  private async callOpenAI(text: string): Promise<string> {
    const prompt = `You are a voice assistant for ElevateBusiness 360°, a textile manufacturing business platform. 

Analyze this voice command and classify the user's intent. The platform has these main functions:
- OPEN_LEADS: Lead/customer prospect management
- OPEN_PAYMENTS: Payment tracking and management  
- OPEN_CUSTOMERS: Customer relationship management
- OPEN_INVENTORY: Stock/material/fabric inventory
- OPEN_ORDERS: Sales orders and bookings
- OPEN_ANALYTICS: Business reports and performance data
- OPEN_PRODUCTION: Manufacturing and production tracking
- SHOW_BUSINESS_OVERVIEW: Dashboard overview
- SHOW_PRIORITIES: Urgent items needing attention
- HELP_COMMAND: User needs help or instructions
- UNKNOWN_INTENT: Cannot determine intent

The user might speak in English, Hindi (हिंदी), Gujarati (ગુજરાતી), or mix languages.

User command: "${text}"

Respond with ONLY a JSON object:
{
  "intent": "INTENT_NAME",
  "confidence": 0.95,
  "language": "en|hi|gu|mixed",
  "entities": {"optional": "extracted entities"}
}`;

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
            content: 'You are a precise intent classifier. Always respond with valid JSON only.'
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.1, // Low temperature for consistent classification
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
  }

  private parseOpenAIResponse(originalText: string, response: string): VoiceIntent {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        intent: parsed.intent || 'UNKNOWN_INTENT',
        confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1),
        entities: parsed.entities || {},
        originalText,
        language: parsed.language || this.detectLanguage(originalText)
      };
    } catch (error) {
      // Failed to parse OpenAI response
      return {
        intent: 'UNKNOWN_INTENT', 
        confidence: 0.0,
        originalText,
        language: this.detectLanguage(originalText)
      };
    }
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