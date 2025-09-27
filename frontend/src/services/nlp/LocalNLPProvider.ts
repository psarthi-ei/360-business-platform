// Local NLP Provider - Fast, Free Pattern Matching
// Handles common voice commands without AI API calls
// Enhanced with Universal Command Processing

import { NLPProvider, VoiceIntent, LocalPattern } from './types';
import { universalCommandProcessor } from './UniversalCommandProcessor';

export class LocalNLPProvider implements NLPProvider {
  name = 'local';
  
  private patterns: LocalPattern[] = [
    // Universal Search Command Patterns
    {
      intent: 'SEARCH_COMMAND',
      keywords: ['search', 'find', 'look', 'locate', 'खोजें', 'શોધો', 'ढूंढें', 'ढूंढो', 'લોકેટ', 'पता'],
      actions: ['for', 'में', 'માં', 'करें', 'કરો'],
      phrases: ['search for', 'find company', 'look for', 'locate customer', 'खोजें कंपनी', 'શોધો કંપની', 'ढूंढें कस्टमर'],
      confidence: 0.9
    },
    
    // Universal Show/Open Command Patterns
    {
      intent: 'SHOW_COMMAND',
      keywords: ['show', 'display', 'view', 'see', 'list', 'दिखाएं', 'दिखाओ', 'બતાવો', 'बताओ'],
      actions: ['leads', 'payments', 'customers', 'orders', 'inventory', 'analytics', 'लीड्स', 'પેમેન્ટ', 'ग्राहक'],
      phrases: ['show leads', 'display payments', 'view customers', 'लीड्स दिखाएं', 'પેમેન્ટ બતાવો'],
      confidence: 0.9
    },
    
    {
      intent: 'OPEN_COMMAND', 
      keywords: ['open', 'go', 'navigate', 'goto', 'access', 'खोलो', 'खोलें', 'जाओ', 'ખોલો', 'જાઓ'],
      actions: ['to', 'leads', 'payments', 'customers', 'orders', 'में', 'પર'],
      phrases: ['open leads', 'go to payments', 'navigate customers', 'लीड्स खोलें', 'પેમેન્ટ ખોલો'],
      confidence: 0.9
    },
    
    // Universal Create/Add Command Patterns
    {
      intent: 'CREATE_COMMAND',
      keywords: ['create', 'add', 'new', 'make', 'generate', 'बनाओ', 'जोड़ो', 'नया', 'બનાવો', 'ઉમેરો', 'નવું'],
      actions: ['lead', 'customer', 'order', 'quote', 'लीड', 'ग्राहक', 'લીડ', 'ગ્રાહક'],
      phrases: ['add new lead', 'create customer', 'new order', 'नया लीड जोड़ें', 'નવો લીડ ઉમેરો'],
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