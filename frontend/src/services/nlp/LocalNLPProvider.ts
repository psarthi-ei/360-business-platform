// Local NLP Provider - Fast, Free Pattern Matching
// Handles common voice commands without AI API calls
// Enhanced with Universal Command Processing

import { NLPProvider, VoiceIntent, LocalPattern } from './types';
import { universalCommandProcessor } from './UniversalCommandProcessor';

export class LocalNLPProvider implements NLPProvider {
  name = 'local';
  
  private patterns: LocalPattern[] = [
    // Lead Management Patterns
    {
      intent: 'OPEN_LEADS',
      keywords: ['lead', 'leads', 'लीड', 'લીડ', 'prospect', 'customer', 'client'],
      actions: ['show', 'open', 'display', 'view', 'see', 'manage', 'दिखाएं', 'दिखाओ', 'બતાવો'],
      phrases: ['lead management', 'customer prospects', 'show leads', 'लीड्स दिखाएं'],
      confidence: 0.9
    },
    
    // Payment Management Patterns  
    {
      intent: 'OPEN_PAYMENTS',
      keywords: ['payment', 'payments', 'money', 'due', 'outstanding', 'paid', 'पेमेंट', 'પેમેન્ટ'],
      actions: ['show', 'check', 'view', 'manage', 'track', 'दिखाएं', 'બતાવો'],
      phrases: ['payment status', 'outstanding payments', 'money due', 'पेमेंट दिखाओ'],
      confidence: 0.9
    },
    
    // Customer Management Patterns
    {
      intent: 'OPEN_CUSTOMERS', 
      keywords: ['customer', 'customers', 'client', 'clients', 'ग्राहक', 'ગ્રાહક'],
      actions: ['show', 'list', 'view', 'manage', 'see', 'दिखाएं', 'બતાવો'],
      phrases: ['customer list', 'all customers', 'customer management', 'ग्राहक दिखाएं'],
      confidence: 0.9
    },
    
    // Inventory Management Patterns
    {
      intent: 'OPEN_INVENTORY',
      keywords: ['inventory', 'stock', 'material', 'fabric', 'goods', 'स्टॉक', 'સ્ટોક'],
      actions: ['check', 'show', 'view', 'verify', 'count', 'देखें', 'બતાવો'],  
      phrases: ['stock check', 'inventory status', 'material stock', 'स्टॉक देखें'],
      confidence: 0.9
    },
    
    // Order Management Patterns
    {
      intent: 'OPEN_ORDERS',
      keywords: ['order', 'orders', 'sales', 'booking', 'ऑर्डर', 'ઓર્ડર'],
      actions: ['show', 'view', 'manage', 'check', 'list', 'दिखाएं', 'બતાવો'],
      phrases: ['sales orders', 'order management', 'pending orders', 'ऑर्डर दिखाएं'],
      confidence: 0.9  
    },
    
    // Analytics Patterns
    {
      intent: 'OPEN_ANALYTICS',
      keywords: ['analytics', 'report', 'reports', 'performance', 'data', 'रिपोर्ट', 'રિપોર્ટ'],
      actions: ['show', 'view', 'open', 'display', 'see', 'दिखाएं', 'બતાવો'],
      phrases: ['business analytics', 'performance report', 'show reports', 'रिपोर्ट दिखाएं'],
      confidence: 0.9
    },
    
    // Business Overview Patterns  
    {
      intent: 'SHOW_BUSINESS_OVERVIEW',
      keywords: ['overview', 'dashboard', 'business', 'summary', 'status'],
      actions: ['show', 'display', 'give', 'provide'],
      phrases: ['business overview', 'show dashboard', 'business status', 'company overview'],
      confidence: 0.8
    },
    
    // Priority/Attention Patterns
    {
      intent: 'SHOW_PRIORITIES',
      keywords: ['priority', 'priorities', 'attention', 'urgent', 'important'],
      actions: ['show', 'what', 'needs', 'requires'],
      phrases: ['what needs attention', 'show priorities', 'urgent items', 'क्या attention चाहिए'],
      confidence: 0.8
    },
    
    // Search Command Patterns
    {
      intent: 'SEARCH_COMMAND',
      keywords: ['search', 'find', 'look', 'locate', 'खोजें', 'શોધો', 'ढूंढें', 'ढूंढो', 'લોકેટ', 'पता'],
      actions: ['for', 'में', 'માં', 'करें', 'કરો'],
      phrases: ['search for', 'find company', 'look for', 'locate customer', 'खोजें कंपनी', 'શોધો કંપની', 'ढूंढें कस्टमर'],
      confidence: 0.9
    }
  ];

  async processCommand(text: string): Promise<VoiceIntent> {
    // Use Universal Command Processor for modern extraction
    const universalResult = universalCommandProcessor.processCommand(text);
    // eslint-disable-next-line no-console
    console.log('🌍 Universal Command Processor result:', universalResult);
    
    // If universal processor found a good match, use it
    if (universalResult.confidence >= 0.7) {
      // eslint-disable-next-line no-console
      console.log('✅ Using Universal Command Processor result (confidence >= 0.7)');
      return universalResult;
    }
    
    // Fallback to legacy pattern matching for backward compatibility
    const legacyResult = this.legacyProcessCommand(text);
    // eslint-disable-next-line no-console
    console.log('🔄 Legacy pattern matching result:', legacyResult);
    
    // Return the result with higher confidence
    const finalResult = universalResult.confidence > legacyResult.confidence ? universalResult : legacyResult;
    // eslint-disable-next-line no-console
    console.log('🎯 Final LocalNLPProvider result:', finalResult, 'chosen from universal:', universalResult.confidence, 'vs legacy:', legacyResult.confidence);
    return finalResult;
  }

  // Legacy pattern matching for backward compatibility
  private legacyProcessCommand(text: string): VoiceIntent {
    const normalizedText = text.toLowerCase().trim();
    let bestMatch: VoiceIntent | null = null;
    let highestScore = 0;

    for (const pattern of this.patterns) {
      const score = this.calculateMatchScore(normalizedText, pattern);
      
      if (score > highestScore && score >= 0.3) {
        highestScore = score;
        bestMatch = {
          intent: pattern.intent,
          confidence: Math.min(score, pattern.confidence),
          originalText: text,
          language: this.detectLanguage(text)
        };
      }
    }

    if (bestMatch) {
      return bestMatch;
    }

    // No match found
    return {
      intent: 'UNKNOWN_INTENT',
      confidence: 0.0,
      originalText: text,
      language: this.detectLanguage(text)
    };
  }

  private calculateMatchScore(text: string, pattern: LocalPattern): number {
    let score = 0;

    // Check for exact phrase matches first (highest priority)
    if (pattern.phrases) {
      for (const phrase of pattern.phrases) {
        if (text.includes(phrase.toLowerCase())) {
          return 0.95; // Very high confidence for exact phrase match
        }
      }
    }

    // Check for keyword matches (primary scoring)
    let keywordMatches = 0;
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    }
    
    // If we have keyword matches, give strong base score
    if (keywordMatches > 0) {
      // Base score: 70% for any keyword match, +10% for additional keywords
      score = 0.7 + Math.min(keywordMatches - 1, 2) * 0.1;
      
      // Bonus points for action words
      for (const action of pattern.actions) {
        if (text.includes(action.toLowerCase())) {
          score += 0.2; // Bonus for having action words
          break; // Just need one action word for bonus
        }
      }
      
      return Math.min(score, 1.0);
    }

    // No matches found
    return 0;
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
    return true; // Local processing always available
  }

  getCost(): number {
    return 0; // Free local processing
  }

  // Helper method to add new patterns dynamically
  addPattern(pattern: LocalPattern): void {
    this.patterns.push(pattern);
  }

  // Get all supported intents
  getSupportedIntents(): string[] {
    const intents = this.patterns.map(p => p.intent);
    const uniqueIntents: string[] = [];
    for (const intent of intents) {
      if (uniqueIntents.indexOf(intent) === -1) {
        uniqueIntents.push(intent);
      }
    }
    return uniqueIntents;
  }
}