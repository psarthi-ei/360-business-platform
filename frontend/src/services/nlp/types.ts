// NLP Service Types and Interfaces
// Provides abstraction layer for multiple AI providers

export interface VoiceIntent {
  intent: string;
  confidence: number;
  entities?: { [key: string]: string };
  originalText: string;
  language?: 'en' | 'hi' | 'gu' | 'mixed';
}

export interface NLPProvider {
  name: string;
  processCommand(text: string): Promise<VoiceIntent>;
  isAvailable(): boolean;
  getCost(): number; // cost per request in USD
}

export interface LocalPattern {
  intent: string;
  keywords: string[];
  actions: string[];
  phrases?: string[];
  confidence: number;
}

export interface NLPConfig {
  primaryProvider: 'openai' | 'google' | 'azure' | 'local';
  fallbackProvider?: 'openai' | 'google' | 'azure' | 'local';
  localThreshold: number; // confidence threshold for local processing
  aiThreshold: number; // confidence threshold for AI processing
  monthlyBudget: number; // maximum AI API calls per month
  enableDebug: boolean;
}

export interface ProcessingResult {
  intent: VoiceIntent;
  processingMethod: 'local' | 'ai' | 'fallback';
  processingTime: number;
  cost: number;
}

// Business Intent Types
export type BusinessIntent = 
  | 'OPEN_LEADS'
  | 'OPEN_PAYMENTS' 
  | 'OPEN_CUSTOMERS'
  | 'OPEN_INVENTORY'
  | 'OPEN_ORDERS'
  | 'OPEN_ANALYTICS'
  | 'OPEN_PRODUCTION'
  | 'SHOW_BUSINESS_OVERVIEW'
  | 'SHOW_PRIORITIES'
  | 'UNKNOWN_INTENT'
  | 'HELP_COMMAND';

export interface BusinessContext {
  hotLeads: number;
  overduePayments: number;
  readyToShip: number;
  totalCustomers: number;
  currentModule?: string;
}