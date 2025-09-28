// Universal Command Processor - Simplified Architecture
// Exact matching first, minimal fuzzy matching for clear Roman transliterations
// Clean, maintainable approach for voice command processing

import { 
  VOICE_ACTIONS, 
  BUSINESS_TARGETS, 
  getAllTargetWords,
  getAllFilterWords,
  detectPrimaryLanguage
} from './LanguageConfig';
import { VoiceIntent, VoiceCommandPayload, DebugExtractionResult } from './types';
import { PhoneticMatcher } from './PhoneticMatcher';

export class UniversalCommandProcessor {
  
  /**
   * Main method to process voice commands - simplified flow
   */
  public processCommand(text: string): VoiceIntent {
    const normalizedText = text.toLowerCase().trim();
    const language = detectPrimaryLanguage(text);
    
    // eslint-disable-next-line no-console
    console.log(`🔄 [NLP] Processing: "${text}"`);
    
    // Step 1: Detect action (exact match first, minimal fuzzy fallback)
    const action = this.detectAction(normalizedText);
    const intent = action ? `${action.toUpperCase()}_COMMAND` : 'UNKNOWN_INTENT';
    
    // Step 2: Detect business target (exact match first)
    const target = this.detectTarget(normalizedText);
    
    // Step 3: Extract clean query (remove detected action and target words)
    const query = this.extractQuery(normalizedText, action, target);
    
    // Step 4: Extract filters (exact match only)
    const filters = this.extractFilters(normalizedText);
    
    // Step 5: Calculate simple confidence score
    const confidence = this.calculateConfidence(action, target, query);
    
    const payload: VoiceCommandPayload = {
      action: action ?? undefined,
      target: target ?? undefined, 
      query: query ?? undefined,
      filters
    };

    const result: VoiceIntent = {
      intent,
      confidence,
      payload,
      originalText: text,
      language
    };
    
    // eslint-disable-next-line no-console
    console.log(`✅ [NLP] Result:`, result);
    return result;
  }

  /**
   * Detect action using exact matching first, minimal fuzzy for clear variations
   */
  private detectAction(text: string): string | null {
    // Try each action type
    for (const [actionType, actionConfig] of Object.entries(VOICE_ACTIONS)) {
      const actionWords = Object.values(actionConfig).flat();
      
      // First: Exact matching (fast and reliable)
      if (this.hasExactMatch(text, actionWords)) {
        // eslint-disable-next-line no-console
        console.log(`🎬 [ACTION] Exact match found: ${actionType.toLowerCase()}`);
        return actionType.toLowerCase();
      }
      
      // Second: Minimal fuzzy for clear Roman transliterations only
      if (this.hasMinimalFuzzyMatch(text, actionWords)) {
        // eslint-disable-next-line no-console
        console.log(`🎬 [ACTION] Fuzzy match found: ${actionType.toLowerCase()}`);
        return actionType.toLowerCase();
      }
    }
    
    // eslint-disable-next-line no-console
    console.log(`🎬 [ACTION] No action detected`);
    return null;
  }

  /**
   * Detect business target using exact matching first
   */
  private detectTarget(text: string): string | null {
    for (const [targetType, targetConfig] of Object.entries(BUSINESS_TARGETS)) {
      const targetWords = Object.values(targetConfig).flat();
      
      // Exact matching only for business targets (more precise)
      if (this.hasExactMatch(text, targetWords)) {
        // eslint-disable-next-line no-console
        console.log(`🎯 [TARGET] Found: ${targetType.toLowerCase()}`);
        return targetType.toLowerCase();
      }
    }
    
    // eslint-disable-next-line no-console
    console.log(`🎯 [TARGET] No business target detected`);
    return null;
  }

  /**
   * Extract query by removing detected action and target words
   * FIXED: Now removes both exact and fuzzy matches
   */
  private extractQuery(text: string, action: string | null, target: string | null): string | null {
    let cleanText = text;
    
    // Remove action words (including fuzzy matches like "dhundho" for "search")
    if (action) {
      cleanText = this.removeActionWords(cleanText, action);
    }
    
    // Remove target words if target was detected  
    if (target) {
      const targetWords = getAllTargetWords(target.toUpperCase() as keyof typeof BUSINESS_TARGETS);
      cleanText = this.removeExactWords(cleanText, targetWords);
    }
    
    // Remove only safe conversation fillers (very conservative)
    // Include common Hindi/Gujarati postpositions for cleaner queries
    const safeFillers = ['please', 'can', 'you', 'will', 'would', 'okay', 'ok', 'ko', 'ka', 'ki', 'ke', 'mein', 'se'];
    cleanText = this.removeExactWords(cleanText, safeFillers);
    
    const finalQuery = cleanText.trim().replace(/\s+/g, ' ');
    const result = finalQuery.length > 0 ? finalQuery : null;
    
    // eslint-disable-next-line no-console
    console.log(`🧹 [QUERY] Extracted: "${result}"`);
    return result;
  }

  /**
   * Remove action words using both exact and fuzzy matching
   * This fixes the "dhundho Mumbai" -> "Mumbai" issue
   */
  private removeActionWords(text: string, action: string): string {
    const actionWords = Object.values(VOICE_ACTIONS[action.toUpperCase() as keyof typeof VOICE_ACTIONS]).flat();
    let cleanText = text;
    
    // First remove exact matches
    cleanText = this.removeExactWords(cleanText, actionWords);
    
    // Then remove fuzzy matches (for cases like "dhundho" matching "search")
    const textWords = cleanText.match(/\b\w+\b/g) || [];
    const wordsToKeep: string[] = [];
    
    for (const textWord of textWords) {
      let shouldKeep = true;
      
      // Check if this word fuzzy matches any action word
      for (const actionWord of actionWords) {
        if (textWord.length > 4 && actionWord.length > 4) {
          const similarity = PhoneticMatcher.calculateSimilarity(textWord, actionWord);
          if (similarity >= 0.8) {
            shouldKeep = false;
            // eslint-disable-next-line no-console
            console.log(`🧹 [REMOVE] Fuzzy match "${textWord}" -> "${actionWord}" (${similarity.toFixed(3)})`);
            break;
          }
        }
      }
      
      if (shouldKeep) {
        wordsToKeep.push(textWord);
      }
    }
    
    return wordsToKeep.join(' ');
  }

  /**
   * Extract filters using exact matching only
   */
  private extractFilters(text: string): string[] {
    const filters: string[] = [];
    
    // Check each filter category
    for (const filterType of ['PRIORITY', 'STATUS', 'LOCATION'] as const) {
      const filterWords = getAllFilterWords(filterType);
      
      for (const word of filterWords) {
        if (this.hasExactMatch(text, [word])) {
          filters.push(word);
        }
      }
    }
    
    // Remove duplicates
    const uniqueFilters = [...new Set(filters)];
    // eslint-disable-next-line no-console
    console.log(`🏷️ [FILTERS] Found: [${uniqueFilters.join(', ')}]`);
    return uniqueFilters;
  }

  /**
   * Simple confidence calculation
   */
  private calculateConfidence(action: string | null, target: string | null, query: string | null): number {
    let confidence = 0.0;
    
    if (action) confidence += 0.6;        // 60% for having an action
    if (target) confidence += 0.2;        // 20% for having a target  
    if (query && query.length > 2) confidence += 0.2;  // 20% for meaningful query
    
    return Math.min(confidence, 1.0);
  }

  // ============================================================================
  // Simple Helper Methods
  // ============================================================================

  /**
   * Check for exact word matches (fast and reliable)
   */
  private hasExactMatch(text: string, words: string[]): boolean {
    for (const word of words) {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'i');
      if (regex.test(text)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Minimal fuzzy matching only for clear Roman transliteration variations
   * Higher threshold (0.8) to prevent false matches
   */
  private hasMinimalFuzzyMatch(text: string, words: string[]): boolean {
    const textWords = text.match(/\b\w+\b/g) || [];
    
    for (const textWord of textWords) {
      for (const word of words) {
        // Only use fuzzy for longer words (>4 chars) to avoid false matches
        if (textWord.length > 4 && word.length > 4) {
          const similarity = PhoneticMatcher.calculateSimilarity(textWord, word);
          if (similarity >= 0.8) {  // High threshold for precision
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Remove exact word matches from text
   */
  private removeExactWords(text: string, wordsToRemove: string[]): string {
    let result = text;
    
    for (const word of wordsToRemove) {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'gi');
      result = result.replace(regex, '');
    }
    
    return result;
  }

  /**
   * Escape special regex characters
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Debug method for development
   */
  public debugExtraction(text: string): DebugExtractionResult {
    const result = this.processCommand(text);
    return { input: text, result };
  }
}

// Export singleton instance
export const universalCommandProcessor = new UniversalCommandProcessor();