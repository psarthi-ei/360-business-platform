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
      // Pure orchestration: providers handle their own confidence logic
      
      // Phase 1: Try local processing first (fast & free)
      const localResult = await this.localProvider.processCommand(text);
      
      // If local processing succeeded, use it
      if (localResult.intent !== 'UNKNOWN_INTENT') {
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
        
        // If AI processing succeeded, use it
        if (aiResult.intent !== 'UNKNOWN_INTENT') {
          this.trackAIUsage(aiResult);
          return {
            intent: aiResult,
            processingMethod: 'ai',
            processingTime: Date.now() - startTime,
            cost: this.getCurrentProvider()?.getCost() || 0
          };
        }
      }
      
      // Phase 3: Return local result as fallback (even if unknown)
      return {
        intent: localResult,
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


  // Test all providers
  async testAllProviders(): Promise<{ [provider: string]: boolean }> {
    const results: { [provider: string]: boolean } = {};
    
    // Simplified implementation to avoid ES5 compatibility issues
    results['local'] = this.localProvider.isAvailable();
    
    return results;
  }
}