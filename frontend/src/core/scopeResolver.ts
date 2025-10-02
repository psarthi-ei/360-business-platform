/**
 * Scope Resolution Utilities
 * Converts configuration into actual behavior
 */

import { platformConfig, GLOBAL_SCOPE, DataScope } from '../config/platformConfig';

/**
 * Get search scope based on configuration and current page
 */
export function getSearchScope(currentPage: string): DataScope[] {
  if (platformConfig.search === 'global') {
    return [...GLOBAL_SCOPE];  // Search across all data types
  } else {
    // Component-specific: search only data relevant to current page
    const pageScope = getPageScope(currentPage);
    return pageScope.length > 0 ? pageScope : [...GLOBAL_SCOPE];
  }
}

/**
 * Get voice scope based on configuration and current page
 */
export function getVoiceScope(currentPage: string): DataScope[] {
  if (platformConfig.voice === 'global') {
    return [...GLOBAL_SCOPE];  // Voice commands for all functionality
  } else {
    // Component-specific: voice commands only for current page
    const pageScope = getPageScope(currentPage);
    return pageScope.length > 0 ? pageScope : [...GLOBAL_SCOPE];
  }
}

/**
 * Map page names to their relevant data scopes
 */
function getPageScope(currentPage: string): DataScope[] {
  const pageScopeMap: Record<string, DataScope[]> = {
    'dashboard': ['leads', 'quotes', 'orders', 'customers'], // Dashboard shows business data
    'leads': ['leads'],
    'quotations': ['quotes'],
    'salesorders': ['orders'],
    'customerlist': ['customers'],
    'customerprofile': ['customers'],
    'inventory': ['inventory'],
    'analytics': ['analytics'],
    'advancepayment': ['payments'],
    'invoices': ['invoices']
  };
  
  return pageScopeMap[currentPage] || [];
}

/**
 * Get available voice commands based on scope
 */
export function getAvailableCommands(voiceScope: DataScope[]): string[] {
  const commandMap: Record<DataScope, string[]> = {
    leads: [
      'add new lead', 'show hot leads', 'show warm leads', 'show cold leads',
      'mark as priority', 'convert to quote', 'search leads'
    ],
    quotes: [
      'create quote', 'approve quote', 'send profile link', 'generate proforma',
      'show pending quotes', 'show approved quotes', 'search quotes'
    ],
    orders: [
      'create order', 'update status', 'track shipment', 'show active orders',
      'show completed orders', 'payment reminder', 'search orders'
    ],
    customers: [
      'show customer profile', 'update customer info', 'customer history',
      'show all customers', 'search customers'
    ],
    inventory: [
      'check stock', 'update inventory', 'low stock alert', 'reorder items',
      'inventory report', 'search inventory'
    ],
    analytics: [
      'show dashboard', 'generate report', 'export data', 'business insights',
      'performance metrics', 'search analytics'
    ],
    payments: [
      'record payment', 'send reminder', 'payment status', 'overdue payments',
      'payment history', 'search payments'
    ],
    invoices: [
      'generate invoice', 'send invoice', 'invoice status', 'pending invoices',
      'paid invoices', 'search invoices'
    ]
  };
  
  return voiceScope.flatMap(scope => commandMap[scope] || []);
}

/**
 * Check if current configuration allows global functionality
 */
export function isGlobalScope(type: 'search' | 'voice'): boolean {
  return platformConfig[type] === 'global';
}

/**
 * Get human-readable description of current configuration
 */
export function getConfigDescription(): string {
  const searchDesc = platformConfig.search === 'global' 
    ? 'Search across all data types from any page'
    : 'Search only data relevant to current page';
    
  const voiceDesc = platformConfig.voice === 'global'
    ? 'Voice commands available for all functionality from any page'
    : 'Voice commands adapt to current page context';
    
  return `Search: ${searchDesc}\nVoice: ${voiceDesc}`;
}

/**
 * Get scope for data sources used in search
 */
export function getDataSourcesForScope(scope: DataScope[]): Record<string, boolean> {
  return {
    leads: scope.includes('leads'),
    quotes: scope.includes('quotes'),
    salesOrders: scope.includes('orders'),
    customers: scope.includes('customers'),
    inventory: scope.includes('inventory'),
    analytics: scope.includes('analytics'),
    payments: scope.includes('payments'),
    invoices: scope.includes('invoices')
  };
}