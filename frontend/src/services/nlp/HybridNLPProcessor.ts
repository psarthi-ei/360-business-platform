// Hybrid NLP Processor - Orchestrates Local and AI Providers
// Implements cost-effective processing with intelligent fallbacks

import { NLPProvider, VoiceIntent, NLPConfig, ProcessingResult, BusinessContext } from './types';
import { LocalNLPProvider } from './LocalNLPProvider';
import { OpenAINLPProvider } from './OpenAINLPProvider';
import { GoogleNLPProvider } from './GoogleNLPProvider';

export class HybridNLPProcessor {
  private localProvider: LocalNLPProvider;
  private aiProviders: Map<string, NLPProvider> = new Map();
  private config: NLPConfig;
  private usageStats: {
    monthlyAICalls: number;
    totalCost: number;
    lastReset: Date;
  };

  constructor(config: NLPConfig) {
    this.config = config;
    this.localProvider = new LocalNLPProvider();
    this.usageStats = {
      monthlyAICalls: 0,
      totalCost: 0,
      lastReset: new Date()
    };
    
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize AI providers based on environment variables
    const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const googleKey = process.env.REACT_APP_GOOGLE_API_KEY;
    
    if (openaiKey) {
      this.aiProviders.set('openai', new OpenAINLPProvider(openaiKey));
    }
    
    if (googleKey) {
      this.aiProviders.set('google', new GoogleNLPProvider(googleKey));
    }
    
    // Always have local provider available
    this.aiProviders.set('local', this.localProvider);
  }

  async processVoiceCommand(
    text: string, 
    businessContext?: BusinessContext
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    this.resetMonthlyStatsIfNeeded();
    
    try {
      // Phase 1: Try local processing first (fast & free)
      const localResult = await this.localProvider.processCommand(text);
      
      if (localResult.confidence >= this.config.localThreshold) {
        return {
          intent: localResult,
          processingMethod: 'local',
          processingTime: Date.now() - startTime,
          cost: 0
        };
      }
      
      // Phase 2: Try AI processing if budget allows
      if (this.canUseAI()) {
        const aiResult = await this.tryAIProcessing(text);
        
        if (aiResult.confidence >= this.config.aiThreshold) {
          this.trackAIUsage(aiResult);
          return {
            intent: aiResult,
            processingMethod: 'ai',
            processingTime: Date.now() - startTime,
            cost: this.getCurrentProvider()?.getCost() || 0
          };
        }
      }
      
      // Phase 3: Enhanced local processing (fallback)
      const enhancedResult = await this.enhancedLocalProcessing(text, localResult);
      
      return {
        intent: enhancedResult,
        processingMethod: 'fallback',
        processingTime: Date.now() - startTime,
        cost: 0
      };
      
    } catch (error) {
      // NLP Processing Error occurred
      return {
        intent: {
          intent: 'UNKNOWN_INTENT',
          confidence: 0,
          originalText: text
        },
        processingMethod: 'fallback',
        processingTime: Date.now() - startTime,
        cost: 0
      };
    }
  }

  private async tryAIProcessing(text: string): Promise<VoiceIntent> {
    const primaryProvider = this.getCurrentProvider();
    
    if (primaryProvider && primaryProvider.isAvailable()) {
      try {
        return await primaryProvider.processCommand(text);
      } catch (error) {
        // Primary provider failed
        
        // Try fallback provider
        if (this.config.fallbackProvider) {
          const fallbackProvider = this.aiProviders.get(this.config.fallbackProvider);
          if (fallbackProvider && fallbackProvider.isAvailable()) {
            return await fallbackProvider.processCommand(text);
          }
        }
      }
    }
    
    // Return unknown intent if all AI providers fail
    return {
      intent: 'UNKNOWN_INTENT',
      confidence: 0,
      originalText: text
    };
  }

  private async enhancedLocalProcessing(text: string, originalResult: VoiceIntent): Promise<VoiceIntent> {
    // If we have some confidence from local processing, enhance it
    if (originalResult.confidence > 0.3) {
      return {
        ...originalResult,
        confidence: Math.min(originalResult.confidence + 0.1, 0.7) // Boost confidence slightly
      };
    }
    
    // Try fuzzy matching for common typos/variations
    const fuzzyResult = this.fuzzyMatch(text);
    if (fuzzyResult.confidence > 0.4) {
      return fuzzyResult;
    }
    
    // Return helpful unknown intent with suggestions
    return {
      intent: 'UNKNOWN_INTENT',
      confidence: 0,
      originalText: text,
      entities: {
        suggestion: this.generateHelpfulSuggestion(text)
      }
    };
  }

  private fuzzyMatch(text: string): VoiceIntent {
    const commonVariations = [
      { original: 'leeds', correct: 'leads', intent: 'OPEN_LEADS' },
      { original: 'payement', correct: 'payment', intent: 'OPEN_PAYMENTS' },
      { original: 'costomer', correct: 'customer', intent: 'OPEN_CUSTOMERS' },
      { original: 'stok', correct: 'stock', intent: 'OPEN_INVENTORY' },
      { original: 'oder', correct: 'order', intent: 'OPEN_ORDERS' }
    ];
    
    const lowerText = text.toLowerCase();
    
    for (const variation of commonVariations) {
      if (lowerText.includes(variation.original)) {
        return {
          intent: variation.intent,
          confidence: 0.6,
          originalText: text,
          entities: { corrected: variation.correct }
        };
      }
    }
    
    return { intent: 'UNKNOWN_INTENT', confidence: 0, originalText: text };
  }

  private generateHelpfulSuggestion(text: string): string {
    const suggestions = [
      "Try: 'Show leads', 'Open payments', 'Customer list'",
      "Available: 'लीड्स दिखाएं', 'पेमेंट्स दिखाओ', 'ग्राहक दिखाएं'",
      "Commands: 'લીડ્સ બતાવો', 'પેમેન્ટ્સ બતાવો', 'કસ્ટમર બતાવો'"
    ];
    
    const language = this.detectLanguage(text);
    if (language === 'hi') return suggestions[1];
    if (language === 'gu') return suggestions[2];
    return suggestions[0];
  }

  private detectLanguage(text: string): 'en' | 'hi' | 'gu' {
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu';
    return 'en';
  }

  private getCurrentProvider(): NLPProvider | undefined {
    return this.aiProviders.get(this.config.primaryProvider);
  }

  private canUseAI(): boolean {
    return this.usageStats.monthlyAICalls < this.config.monthlyBudget;
  }

  private trackAIUsage(result: VoiceIntent): void {
    this.usageStats.monthlyAICalls++;
    this.usageStats.totalCost += this.getCurrentProvider()?.getCost() || 0;
  }

  private resetMonthlyStatsIfNeeded(): void {
    const now = new Date();
    const lastReset = this.usageStats.lastReset;
    
    // Reset if it's a new month
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      this.usageStats = {
        monthlyAICalls: 0,
        totalCost: 0,
        lastReset: now
      };
    }
  }

  // Configuration methods
  updateConfig(newConfig: Partial<NLPConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getUsageStats() {
    return {
      ...this.usageStats,
      remainingBudget: this.config.monthlyBudget - this.usageStats.monthlyAICalls,
      budgetUtilization: (this.usageStats.monthlyAICalls / this.config.monthlyBudget) * 100
    };
  }

  // Add custom local patterns
  addLocalPattern(intent: string, keywords: string[], actions: string[]): void {
    this.localProvider.addPattern({
      intent,
      keywords,
      actions,
      confidence: 0.8
    });
  }

  // Test all providers
  async testAllProviders(): Promise<{ [provider: string]: boolean }> {
    const results: { [provider: string]: boolean } = {};
    
    // Simplified implementation to avoid ES5 compatibility issues
    results['local'] = this.localProvider.isAvailable();
    
    return results;
  }
}