// NLP Service Types and Interfaces
// Provides abstraction layer for multiple AI providers

// Enhanced Voice Command Payload Structure
export interface VoiceCommandPayload {
  action?: string;          // Extracted action: 'search', 'show', 'open', etc.
  target?: string;          // Business target: 'leads', 'customers', 'payments', etc.
  query?: string;           // Search/filter query: 'Mumbai', 'Cotton Mills', etc.
  filters?: string[];       // Additional filters: ['hot', 'pending', 'gujarat']
  leadId?: string;          // Lead ID for priority changes (UC-L05)
  priority?: 'hot' | 'warm' | 'cold'; // Priority level for lead changes (UC-L05)
  parameters?: { [key: string]: string }; // Extra structured data
}

export interface VoiceIntent {
  intent: string;
  confidence: number;
  payload?: VoiceCommandPayload; // NEW: Structured command data
  entities?: { [key: string]: string }; // Legacy support
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

// NLP Service Result Interface
export interface NLPResult {
  intent: BusinessIntent;
  response: string;
  confidence: number;
  processingMethod: string;
  cost: number;
  payload?: VoiceCommandPayload;
  originalText?: string;
  language?: string;
}

// Business Intent Types (Universal Command System)
export type BusinessIntent = 
  | 'SEARCH_COMMAND'        // Universal search: "search Mumbai", "find cotton"
  | 'SHOW_COMMAND'          // Universal show: "show leads", "display payments"
  | 'OPEN_COMMAND'          // Universal open: "open customers", "navigate to orders"
  | 'CREATE_COMMAND'        // Universal create: "create lead", "add customer" 
  | 'CHECK_COMMAND'         // Universal check: "check status", "verify payment"
  | 'SET_PRIORITY_COMMAND'  // UC-L05: Set lead priority: "इस लीड को hot बनाएं"
  | 'UNKNOWN_INTENT'        // Fallback for unrecognized commands
  | 'HELP_COMMAND';         // Help and assistance requests

export interface BusinessContext {
  hotLeads: number;
  overduePayments: number;
  readyToShip: number;
  totalCustomers: number;
  currentModule?: string;
}

// Language Configuration Interfaces (Simple structure for existing config)
export interface SimpleLanguageConfig {
  en: string[];
  hi: string[];
  gu: string[];
}

export interface DebugExtractionResult {
  input: string;
  result: VoiceIntent;
}

// NLP Service Configuration Interface
export interface NLPServiceConfig {
  usageStats: {
    monthlyAICalls: number;
    totalCost: number;
    lastReset: Date;
    remainingBudget: number;
    budgetUtilization: number;
  };
  debugMode: boolean;
}