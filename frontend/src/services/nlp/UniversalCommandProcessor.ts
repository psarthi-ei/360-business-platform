// Universal Command Processor
// Core logic for extracting structured payloads from voice commands
// Handles mixed-language commands and business context naturally

import { 
  VOICE_ACTIONS, 
  BUSINESS_TARGETS, 
  getAllActionWords,
  getAllTargetWords,
  getAllContextualMarkers,
  getAllFilterWords,
  detectPrimaryLanguage
} from './LanguageConfig';
import { VoiceIntent, VoiceCommandPayload, DebugExtractionResult } from './types';

export class UniversalCommandProcessor {
  
  /**
   * Main method to process any voice command and extract structured payload
   * Handles mixed languages naturally: "search करो Mumbai Cotton Mills"
   */
  public processCommand(text: string): VoiceIntent {
    const normalizedText = text.toLowerCase().trim();
    const language = detectPrimaryLanguage(text);
    
    // Step 1: Detect intent and action
    const { intent, action } = this.detectIntentAndAction(normalizedText);
    
    // Step 2: Extract structured payload based on intent
    const payload = this.extractPayload(normalizedText, intent, action);
    
    // Step 3: Calculate confidence score
    const confidence = this.calculateConfidence(normalizedText, intent, payload);
    
    return {
      intent,
      confidence,
      payload,
      originalText: text,
      language
    };
  }

  /**
   * Detect the primary intent and action from the command
   */
  private detectIntentAndAction(text: string): { intent: string; action: string | null } {
    // Check for search commands
    const searchWords = getAllActionWords('SEARCH');
    if (this.containsAnyWord(text, searchWords)) {
      return { intent: 'SEARCH_COMMAND', action: 'search' };
    }
    
    // Check for show commands
    const showWords = getAllActionWords('SHOW');
    if (this.containsAnyWord(text, showWords)) {
      return { intent: 'SHOW_COMMAND', action: 'show' };
    }
    
    // Check for open commands
    const openWords = getAllActionWords('OPEN');
    if (this.containsAnyWord(text, openWords)) {
      return { intent: 'OPEN_COMMAND', action: 'open' };
    }
    
    // Check for create commands
    const createWords = getAllActionWords('CREATE');
    if (this.containsAnyWord(text, createWords)) {
      return { intent: 'CREATE_COMMAND', action: 'create' };
    }
    
    // Check for check commands
    const checkWords = getAllActionWords('CHECK');
    if (this.containsAnyWord(text, checkWords)) {
      return { intent: 'CHECK_COMMAND', action: 'check' };
    }
    
    return { intent: 'UNKNOWN_INTENT', action: null };
  }

  /**
   * Extract structured payload from the command text
   */
  private extractPayload(text: string, intent: string, action: string | null): VoiceCommandPayload {
    const payload: VoiceCommandPayload = {};
    
    if (action) {
      payload.action = action;
    }
    
    // Step 1: Detect business target
    payload.target = this.detectBusinessTarget(text);
    
    // Step 2: Extract clean query (remove action words and contextual markers)
    payload.query = this.extractCleanQuery(text, action);
    
    // Step 3: Extract filters
    payload.filters = this.extractFilters(text);
    
    // Step 4: Extract additional parameters
    payload.parameters = this.extractParameters(text);
    
    return payload;
  }

  /**
   * Detect business target from the command
   */
  private detectBusinessTarget(text: string): string | undefined {
    // Check for each business target type
    for (const targetType of Object.keys(BUSINESS_TARGETS)) {
      const targetWords = getAllTargetWords(targetType as keyof typeof BUSINESS_TARGETS);
      if (this.containsAnyWord(text, targetWords)) {
        return targetType.toLowerCase();
      }
    }
    
    return undefined;
  }

  /**
   * Extract clean query by removing action words and contextual markers
   * This is the core fix for "search Mumbai" → "Mumbai"
   */
  private extractCleanQuery(text: string, action: string | null): string | undefined {
    let cleanedText = text;
    
    // Step 1: Remove action words from all languages
    if (action) {
      const actionWords = getAllActionWords(action.toUpperCase() as keyof typeof VOICE_ACTIONS);
      for (const actionWord of actionWords) {
        const regex = new RegExp(`\\b${this.escapeRegex(actionWord)}\\b`, 'gi');
        cleanedText = cleanedText.replace(regex, '');
      }
    }
    
    // Step 2: Remove contextual markers
    const contextualMarkers = getAllContextualMarkers();
    for (const marker of contextualMarkers) {
      const regex = new RegExp(`\\b${this.escapeRegex(marker)}\\b`, 'gi');
      cleanedText = cleanedText.replace(regex, '');
    }
    
    // Step 3: Remove business target words (keep the content, not the category)
    for (const targetType of Object.keys(BUSINESS_TARGETS)) {
      const targetWords = getAllTargetWords(targetType as keyof typeof BUSINESS_TARGETS);
      for (const targetWord of targetWords) {
        const regex = new RegExp(`\\b${this.escapeRegex(targetWord)}\\b`, 'gi');
        cleanedText = cleanedText.replace(regex, '');
      }
    }
    
    // Step 4: Clean up whitespace and return
    const finalQuery = cleanedText.trim().replace(/\s+/g, ' ');
    
    // Return undefined if query is empty or too short
    return finalQuery.length > 0 ? finalQuery : undefined;
  }

  /**
   * Extract filter words from the command
   */
  private extractFilters(text: string): string[] {
    const filters: string[] = [];
    
    // Check priority filters
    const priorityWords = getAllFilterWords('PRIORITY');
    for (const word of priorityWords) {
      if (text.includes(word)) {
        filters.push(word);
      }
    }
    
    // Check status filters
    const statusWords = getAllFilterWords('STATUS');
    for (const word of statusWords) {
      if (text.includes(word)) {
        filters.push(word);
      }
    }
    
    // Check location filters
    const locationWords = getAllFilterWords('LOCATION');
    for (const word of locationWords) {
      if (text.includes(word)) {
        filters.push(word);
      }
    }
    
    return filters;
  }

  /**
   * Extract additional parameters from the command
   */
  private extractParameters(text: string): { [key: string]: string } {
    const parameters: { [key: string]: string } = {};
    
    // Extract date references
    const dateMatch = text.match(/\b(today|yesterday|tomorrow|last week|this month)\b/i);
    if (dateMatch) {
      parameters.timeframe = dateMatch[1];
    }
    
    // Extract number references
    const numberMatch = text.match(/\b(\d+)\b/);
    if (numberMatch) {
      parameters.number = numberMatch[1];
    }
    
    return parameters;
  }

  /**
   * Calculate confidence score based on matches and context
   */
  private calculateConfidence(text: string, intent: string, payload: VoiceCommandPayload): number {
    let confidence = 0.0;
    
    // Base confidence for intent detection
    if (intent !== 'UNKNOWN_INTENT') {
      confidence += 0.6; // 60% base for valid intent
    }
    
    // Bonus for having clear action
    if (payload.action) {
      confidence += 0.2; // +20% for action
    }
    
    // Bonus for business target detection
    if (payload.target) {
      confidence += 0.1; // +10% for target
    }
    
    // Bonus for meaningful query
    if (payload.query && payload.query.length > 2) {
      confidence += 0.1; // +10% for query
    }
    
    // Cap confidence at 1.0
    return Math.min(confidence, 1.0);
  }

  /**
   * Helper: Check if text contains any of the given words
   */
  private containsAnyWord(text: string, words: string[]): boolean {
    return words.some(word => {
      const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, 'i');
      return regex.test(text);
    });
  }

  /**
   * Helper: Escape special regex characters
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Debug method to show extraction process (for development only)
   */
  public debugExtraction(text: string): DebugExtractionResult {
    const result = this.processCommand(text);
    return { input: text, result };
  }
}

// Export singleton instance
export const universalCommandProcessor = new UniversalCommandProcessor();