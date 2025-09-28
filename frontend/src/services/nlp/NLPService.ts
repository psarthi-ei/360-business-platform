// NLP Service - Main Interface for Voice Command Processing
// Integrates hybrid NLP processor with existing voice assistant

import { HybridNLPProcessor } from './HybridNLPProcessor';
import { NLPConfig, BusinessContext, BusinessIntent, VoiceIntent, NLPResult, NLPServiceConfig } from './types';

export class NLPService {
  private static instance: NLPService;
  private processor: HybridNLPProcessor;
  private isDebugMode: boolean = false;

  private constructor() {
    // Default configuration - can be overridden
    const defaultConfig: NLPConfig = {
      primaryProvider: 'local', // Start with local, can upgrade to AI
      fallbackProvider: 'openai',
      localThreshold: 0.7, // Use local if confidence >= 70%
      aiThreshold: 0.6, // Accept AI results if confidence >= 60%
      monthlyBudget: 1000, // Max 1000 AI API calls per month
      enableDebug: process.env.NODE_ENV === 'development'
    };

    this.processor = new HybridNLPProcessor(defaultConfig);
    this.isDebugMode = defaultConfig.enableDebug;
  }

  static getInstance(): NLPService {
    if (!NLPService.instance) {
      NLPService.instance = new NLPService();
    }
    return NLPService.instance;
  }

  // Main method to process voice commands
  async processVoiceCommand(
    transcript: string, 
    businessContext?: BusinessContext,
    currentStage?: string
  ): Promise<NLPResult> {
    // Processing start time for performance tracking
    // eslint-disable-next-line no-console
    console.log('🚀 NLPService.processVoiceCommand called with:', transcript);
    
    try {
      // Process the command using hybrid NLP
      const result = await this.processor.processVoiceCommand(transcript, businessContext);
      
      // eslint-disable-next-line no-console
      console.log('🔧 HybridNLPProcessor result:', result);
      // eslint-disable-next-line no-console
      console.log('🔧 result.intent:', result.intent);
      
      // Generate user-friendly response
      const response = this.generateResponse(result.intent, businessContext, currentStage);
      
      // Debug logging
      if (this.isDebugMode) {
        // NLP Processing completed successfully
      }

      return {
        intent: result.intent.intent as BusinessIntent,
        response,
        confidence: result.intent.confidence,
        processingMethod: result.processingMethod,
        cost: result.cost,
        payload: result.intent.payload,
        originalText: result.intent.originalText,
        language: result.intent.language
      };

    } catch (error) {
      // NLP Service Error occurred
      return {
        intent: 'UNKNOWN_INTENT',
        response: 'Sorry, I couldn\'t understand that command. Please try again.',
        confidence: 0,
        processingMethod: 'error',
        cost: 0,
        payload: undefined,
        originalText: transcript,
        language: 'en'
      };
    }
  }

  private generateResponse(intent: VoiceIntent, businessContext?: BusinessContext, currentStage?: string): string {
    const intentType = intent.intent;
    const language = intent.language || 'en';


    // Only UNKNOWN_INTENT responses are actually shown to users
    if (intentType === 'UNKNOWN_INTENT') {
      return this.getContextualSuggestions(currentStage || 'dashboard', language as 'en' | 'hi' | 'gu', intent.originalText);
    }

    // All other commands (OPEN_*, SEARCH_*, etc.) are processed directly without showing response messages
    return 'Processing your request...';
  }

  private getContextualSuggestions(stage: string, language: 'en' | 'hi' | 'gu', originalText?: string): string {
    const voiceCommandText = originalText ? ` (You said: "${originalText}")` : '';
    
    // Simple universal suggestions that work across all contexts
    const suggestions = {
      'en': `I didn't catch that${voiceCommandText}. Try: 'Search for [company]', 'Show [leads/payments/orders]', or 'Add new lead'`,
      'hi': `मैं समझ नहीं पाया${voiceCommandText}। कोशिश करें: '[कंपनी] खोजें', '[लीड्स/payments/orders] दिखाएं', या 'नया लीड बनाएं'`,
      'gu': `મને સમજાયું નહીં${voiceCommandText}। પ્રયાસ કરો: '[કંપની] શોધો', '[લીડ્સ/payments/orders] બતાવો', અથવા 'નવો લીડ ઉમેરો'`
    };
    
    return suggestions[language];
  }

  // Configuration methods
  enableAI(provider: 'openai' | 'google', apiKey?: string): void {
    this.processor.updateConfig({
      primaryProvider: provider,
      fallbackProvider: 'local'
    });
    
    if (this.isDebugMode) {
      // AI Provider enabled
    }
  }

  disableAI(): void {
    this.processor.updateConfig({
      primaryProvider: 'local',
      fallbackProvider: undefined
    });
    
    if (this.isDebugMode) {
      // AI disabled, using local processing only
    }
  }


  // Get usage statistics
  getUsageStats() {
    return this.processor.getUsageStats();
  }

  // Test NLP providers
  async testProviders() {
    return await this.processor.testAllProviders();
  }

  // Enable/disable debug mode
  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
    this.processor.updateConfig({ enableDebug: enabled });
  }

  // Get current configuration
  getCurrentConfig(): NLPServiceConfig {
    return {
      usageStats: this.getUsageStats(),
      debugMode: this.isDebugMode
    };
  }
}

// Export singleton instance
export const nlpService = NLPService.getInstance();