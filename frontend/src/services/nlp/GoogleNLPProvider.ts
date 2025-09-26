// Google Cloud NLP Provider - Strong Indian Language Support
// Uses Google Cloud Natural Language API for voice command interpretation

import { NLPProvider, VoiceIntent } from './types';

export class GoogleNLPProvider implements NLPProvider {
  name = 'google';
  private apiKey: string;
  private baseUrl = 'https://language.googleapis.com/v1/documents:classifyText';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processCommand(text: string): Promise<VoiceIntent> {
    try {
      // For demo purposes, we'll use a simplified classification approach
      // In production, you would train a custom model or use AutoML
      const classification = await this.classifyText(text);
      return this.mapToBusinessIntent(text, classification);
    } catch (error) {
      // Google NLP Error occurred
      return {
        intent: 'UNKNOWN_INTENT',
        confidence: 0.0,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
  }

  private async classifyText(text: string): Promise<{ intent: string; confidence: number }> {
    // This is a simplified implementation
    // In production, you would use Google's classification or entity analysis
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

    return await response.json();
  }

  private mapToBusinessIntent(text: string, classification: any): VoiceIntent {
    // Simplified mapping logic
    // In production, this would be more sophisticated
    const lowerText = text.toLowerCase();
    
    // Business intent mapping based on keywords
    if (this.containsKeywords(lowerText, ['lead', 'leads', 'लीड', 'લીડ', 'prospect', 'customer'])) {
      return {
        intent: 'OPEN_LEADS',
        confidence: 0.8,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['payment', 'पेमेंट', 'પેમેન્ટ', 'money', 'due', 'outstanding'])) {
      return {
        intent: 'OPEN_PAYMENTS', 
        confidence: 0.8,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['customer', 'ग्राहक', 'ગ્રાહક', 'client', 'customers'])) {
      return {
        intent: 'OPEN_CUSTOMERS',
        confidence: 0.8, 
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['inventory', 'stock', 'स्टॉक', 'સ્ટોક', 'material', 'fabric'])) {
      return {
        intent: 'OPEN_INVENTORY',
        confidence: 0.8,
        originalText: text, 
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['order', 'orders', 'ऑर्डर', 'ઓર્ડર', 'sales', 'booking'])) {
      return {
        intent: 'OPEN_ORDERS',
        confidence: 0.8,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['analytics', 'report', 'रिपोर्ट', 'રિપોર્ટ', 'performance', 'data'])) {
      return {
        intent: 'OPEN_ANALYTICS', 
        confidence: 0.8,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    if (this.containsKeywords(lowerText, ['attention', 'priority', 'urgent', 'important'])) {
      return {
        intent: 'SHOW_PRIORITIES',
        confidence: 0.7,
        originalText: text,
        language: this.detectLanguage(text) 
      };
    }
    
    if (this.containsKeywords(lowerText, ['overview', 'dashboard', 'summary', 'status'])) {
      return {
        intent: 'SHOW_BUSINESS_OVERVIEW',
        confidence: 0.7,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }

    return {
      intent: 'UNKNOWN_INTENT',
      confidence: 0.0,
      originalText: text,
      language: this.detectLanguage(text)
    };
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
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