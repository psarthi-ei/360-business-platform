/**
 * ElevateBusiness 360° Platform Configuration
 * Single source of truth for voice and search behavior
 */

export type SearchBehavior = 'global' | 'component-specific';
export type VoiceBehavior = 'global' | 'component-specific';

/**
 * Platform Configuration - Change behavior here
 * 
 * global: Functionality works across all data types from any page
 * component-specific: Functionality adapts to current page context
 */
export const platformConfig = {
  search: 'global' as SearchBehavior,    // Search everything from anywhere
  voice: 'global' as VoiceBehavior       // Voice commands work everywhere
};

/**
 * Global Scope Definition - What "global" means
 * Add new data types here and they become available everywhere
 */
export const GLOBAL_SCOPE = [
  'leads',        // Lead management
  'quotes',       // Quotation management  
  'orders',       // Sales order management
  'customers',    // Customer relationship management
  'inventory',    // Inventory management
  'analytics',    // Business analytics
  'payments',     // Payment tracking
  'invoices'      // Invoice management
] as const;

// TypeScript helper types
export type DataScope = typeof GLOBAL_SCOPE[number];
export type PlatformConfig = typeof platformConfig;

/**
 * Configuration Presets for Common Use Cases
 */
export const CONFIG_PRESETS = {
  // Complete universal experience (recommended for MSME)
  full_global: {
    search: 'global' as SearchBehavior,
    voice: 'global' as VoiceBehavior
  },
  
  // Focused page-specific experience
  component_specific: {
    search: 'component-specific' as SearchBehavior,
    voice: 'component-specific' as VoiceBehavior
  },
  
  // Universal search with contextual voice
  global_search_contextual_voice: {
    search: 'global' as SearchBehavior,
    voice: 'component-specific' as VoiceBehavior
  },
  
  // Contextual search with universal voice
  contextual_search_global_voice: {
    search: 'component-specific' as SearchBehavior,
    voice: 'global' as VoiceBehavior
  }
};