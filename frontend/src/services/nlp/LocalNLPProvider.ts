// Local NLP Provider - Fast, Free Pattern Matching
// Handles common voice commands without AI API calls
// Enhanced with Universal Command Processing

import { NLPProvider, VoiceIntent } from './types';
import { universalCommandProcessor } from './UniversalCommandProcessor';

export class LocalNLPProvider implements NLPProvider {
  name = 'local';

  async processCommand(text: string): Promise<VoiceIntent> {
    // Use Universal Command Processor - now the only processing method
    const result = universalCommandProcessor.processCommand(text);
    
    // If no good match found, return unknown intent with language detection
    if (result.confidence < 0.3) {
      return {
        intent: 'UNKNOWN_INTENT',
        confidence: 0.0,
        originalText: text,
        language: this.detectLanguage(text)
      };
    }
    
    return result;
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

  // Get all supported intents from UniversalCommandProcessor
  getSupportedIntents(): string[] {
    return [
      'SEARCH_COMMAND',
      'SHOW_COMMAND', 
      'OPEN_COMMAND',
      'CREATE_COMMAND',
      'CHECK_COMMAND',
      'SET_PRIORITY_COMMAND'
    ];
  }
}