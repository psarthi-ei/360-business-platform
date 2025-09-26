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

    // Business intelligence responses with real data
    if (intentType === 'SHOW_PRIORITIES' && businessContext) {
      if (language === 'hi') {
        return `आज के प्राथमिकताएं: ${businessContext.hotLeads} हॉट लीड्स, ${businessContext.overduePayments} बकाया पेमेंट्स, ${businessContext.readyToShip} शिपमेंट तैयार`;
      }
      if (language === 'gu') {
        return `આજની પ્રાથમિકતાઓ: ${businessContext.hotLeads} હૉટ લીડ્સ, ${businessContext.overduePayments} બાકી પેમેન્ટ્સ, ${businessContext.readyToShip} શિપમેન્ટ તૈયાર`;
      }
      return `Today's priorities: ${businessContext.hotLeads} hot leads need calls, ${businessContext.overduePayments} overdue payments, ${businessContext.readyToShip} orders ready to ship`;
    }

    // Navigation responses by language
    const responses = {
      'OPEN_LEADS': {
        'en': 'Opening Lead Management',
        'hi': 'लीड मैनेजमेंट खोल रहे हैं',
        'gu': 'લીડ મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'OPEN_PAYMENTS': {
        'en': 'Opening Payment Management', 
        'hi': 'पेमेंट मैनेजमेंट खोल रहे हैं',
        'gu': 'પેમેન્ટ મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'OPEN_CUSTOMERS': {
        'en': 'Opening Customer Management',
        'hi': 'ग्राहक मैनेजमेंट खोल रहे हैं', 
        'gu': 'કસ્ટમર મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'OPEN_INVENTORY': {
        'en': 'Opening Inventory Management',
        'hi': 'इन्वेंटरी मैनेजमेंट खोल रहे हैं',
        'gu': 'ઇન્વેન્ટરી મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'OPEN_ORDERS': {
        'en': 'Opening Order Management',
        'hi': 'ऑर्डर मैनेजमेंट खोल रहे हैं',
        'gu': 'ઓર્ડર મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'OPEN_ANALYTICS': {
        'en': 'Opening Business Analytics',
        'hi': 'बिजनेस एनालिटिक्स खोल रहे हैं',
        'gu': 'બિઝનેસ એનાલિટિક્સ ખોલી રહ્યા છીએ'
      },
      'OPEN_PRODUCTION': {
        'en': 'Opening Production Management',
        'hi': 'प्रोडक्शन मैनेजमेंट खोल रहे हैं',
        'gu': 'પ્રોડક્શન મેનેજમેન્ટ ખોલી રહ્યા છીએ'
      },
      'SHOW_BUSINESS_OVERVIEW': {
        'en': 'Showing Business Overview',
        'hi': 'बिजनेस ओवरव्यू दिखा रहे हैं',
        'gu': 'બિઝનેસ ઓવરવ્યુ બતાવી રહ્યા છીએ'
      },
      'HELP_COMMAND': {
        'en': 'Available commands: Show leads, Open payments, Customer list, Inventory check, Order status, Business analytics',
        'hi': 'उपलब्ध कमांड्स: लीड्स दिखाएं, पेमेंट्स खोलें, ग्राहक सूची, स्टॉक चेक, ऑर्डर स्टेटस, बिजनेस एनालिटिक्स',
        'gu': 'ઉપલબ્ધ કમાન્ડ્સ: લીડ્સ બતાવો, પેમેન્ટ્સ ખોલો, કસ્ટમર લિસ્ટ, સ્ટોક ચેક, ઓર્ડર સ્ટેટસ, બિઝનેસ એનાલિટિક્સ'
      },
      'UNKNOWN_INTENT': {
        'en': this.getContextualSuggestions(currentStage || 'dashboard', 'en'),
        'hi': this.getContextualSuggestions(currentStage || 'dashboard', 'hi'), 
        'gu': this.getContextualSuggestions(currentStage || 'dashboard', 'gu')
      }
    };

    const intentResponses = responses[intentType as keyof typeof responses];
    if (intentResponses) {
      const languageResponse = intentResponses[language as keyof typeof intentResponses] || intentResponses['en'];
      return languageResponse || 'Processing your request...';
    }
    return 'Processing your request...';
  }

  private getContextualSuggestions(stage: string, language: 'en' | 'hi' | 'gu'): string {
    const suggestions = {
      'dashboard': {
        'en': "I didn't catch that. Try: 'Show business overview', 'Search for company name', or 'Find pending orders'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'बिजनेस ओवरव्यू दिखाएं', 'कंपनी नाम खोजें', या 'pending orders ढूंढें'",
        'gu': "મને સમજાયું નહીં। પ્રયાસ કરો: 'બિઝનેસ ઓવરવ્યુ બતાવો', 'કંપની નામ શોધો', અથવા 'પેન્ડિંગ ઓર્ડર્સ શોધો'"
      },
      'leads': {
        'en': "I didn't catch that. On this page you can say: 'Show hot leads', 'Search for lead', or 'Find prospects'",
        'hi': "मैं समझ नहीं पाया। इस page पर आप कह सकते हैं: 'हॉट लीड्स दिखाएं', 'लीड खोजें', या 'prospects ढूंढें'",
        'gu': "મને સમજાયું નહીં. આ પેજ પર તમે કહી શકો: 'હૉટ લીડ્સ બતાવો', 'લીડ શોધો', અથવા 'પ્રોસ્પેક્ટ્સ શોધો'"
      },
      'payments': {
        'en': "I didn't catch that. Try: 'Outstanding payments', 'Record payment', or 'Payment status'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'बकाया payments', 'payment record करें', या 'payment status'",
        'gu': "મને સમજાયું નહીં। પ્રયાસ કરો: 'બાકી પેમેન્ટ્સ', 'પેમેન્ટ રેકૉર્ડ કરો', અથવા 'પેમેન્ટ સ્ટેટસ'"
      },
      'customers': {
        'en': "I didn't catch that. Try: 'Search for customer', 'Find VIP clients', or 'Customer profile'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'customer खोजें', 'VIP clients ढूंढें', या 'customer profile'",
        'gu': "મને સમજાયું નહીં। પ્રયાસ કરો: 'કસ્ટમર શોધો', 'VIP ક્લાઇન્ટ્સ શોધો', અથવા 'કસ્ટમર પ્રોફાઇલ'"
      },
      'inventory': {
        'en': "I didn't catch that. Try: 'Stock check', 'Material order', or 'Stock status'", 
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'stock check', 'material order', या 'stock status'",
        'gu': "મને સમજાયું નહીં। પ્રયાસ કરો: 'સ્ટોક ચેક', 'મટીરિયલ ઓર્ડર', અથવા 'સ્ટોક સ્ટેટસ'"
      },
      'quotes': {
        'en': "I didn't catch that. Try: 'Create quote', 'Show pending quotes', or 'Quote approval status'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'quote बनाएं', 'pending quotes दिखाएं', या 'quote approval status'",
        'gu': "મને સમજાયું નહીં. પ્રયાસ કરો: 'ક્વોટ બનાવો', 'પેન્ડિંગ ક્વોટ્સ બતાવો', અથવા 'ક્વોટ એપ્રૂવલ સ્ટેટસ'"
      },
      'production': {
        'en': "I didn't catch that. Try: 'Production status', 'Start production', or 'Quality check'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'production status', 'production शुरू करें', या 'quality check'",
        'gu': "મને સમજાયું નહીં. પ્રયાસ કરો: 'પ્રોડક્શન સ્ટેટસ', 'પ્રોડક્શન શરૂ કરો', અથવા 'ક્વોલિટી ચેક'"
      },
      'analytics': {
        'en': "I didn't catch that. Try: 'Business performance', 'Monthly sales', or 'Show KPIs'",
        'hi': "मैं समझ नहीं पाया। कोशिश करें: 'business performance', 'monthly sales', या 'KPIs दिखाएं'",
        'gu': "મને સમજાયું નહીં. પ્રયાસ કરો: 'બિઝનેસ પર્ફોર્મન્સ', 'માસિક સેલ્સ', અથવા 'KPIs બતાવો'"
      }
    };
    
    return suggestions[stage as keyof typeof suggestions]?.[language] || suggestions.dashboard[language];
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

  // Add custom business commands
  addCustomCommand(intent: string, keywords: string[], actions: string[]): void {
    this.processor.addLocalPattern(intent, keywords, actions);
    
    if (this.isDebugMode) {
      // Custom command added
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