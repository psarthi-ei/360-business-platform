// Regional terminology configuration types for MVP Simplification
// Core system maintains manufacturing standards, UI displays regional terms

export interface TerminologyConfig {
  // Core business entities
  customer: string;
  customers: string;
  
  // Sales process
  lead: string;
  leads: string;
  quote: string;
  quotes: string;
  invoice: string;
  invoices: string;
  
  // Production process
  workOrder: string;
  workOrders: string;
  
  // Procurement process
  goodsReceiptNote: string;
  
  // Actions
  generateQuote: string;
  generateInvoice: string;
  addCustomer: string;
}

// Regional terminology configurations
export const REGIONAL_TERMINOLOGY: Record<string, TerminologyConfig> = {
  'surat-processing': {
    // Core entities - Surat processing unit terminology
    customer: 'Party',
    customers: 'Parties',
    
    // Sales process - Local terms
    lead: 'Inquiry',
    leads: 'Inquiries',
    quote: 'Rate',
    quotes: 'Rates',
    invoice: 'Job Bill',
    invoices: 'Job Bills',
    
    // Production process - Shop floor terms
    workOrder: 'Lot',
    workOrders: 'Lots',
    
    // Procurement process - Industry terms
    goodsReceiptNote: 'Inward',
    
    // Actions - Local terminology
    generateQuote: 'Send Rate',
    generateInvoice: 'Generate Job Bill', 
    addCustomer: 'Add Party'
  },
  
  'mumbai-trading': {
    // Core entities - Corporate terminology
    customer: 'Customer',
    customers: 'Customers',
    
    // Sales process - Formal terms
    lead: 'Lead',
    leads: 'Leads',
    quote: 'Quote',
    quotes: 'Quotes',
    invoice: 'Invoice',
    invoices: 'Invoices',
    
    // Production process - Standard terms
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    
    // Procurement process - Standard terms
    goodsReceiptNote: 'GRN',
    
    // Actions - Formal terminology
    generateQuote: 'Generate Quote',
    generateInvoice: 'Generate Invoice',
    addCustomer: 'Add Customer'
  },
  
  'chennai-manufacturing': {
    // Core entities - Manufacturing terminology
    customer: 'Customer',
    customers: 'Customers',
    
    // Sales process - Manufacturing terms
    lead: 'RFQ',
    leads: 'RFQs',
    quote: 'Quotation',
    quotes: 'Quotations',
    invoice: 'Invoice', 
    invoices: 'Invoices',
    
    // Production process - Manufacturing terms
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    
    // Procurement process - Manufacturing terms
    goodsReceiptNote: 'Goods Receipt',
    
    // Actions - Manufacturing terminology
    generateQuote: 'Generate Quotation',
    generateInvoice: 'Generate Invoice',
    addCustomer: 'Add Customer'
  }
};

// Default terminology for MVP (Surat processing)
export const DEFAULT_TERMINOLOGY = REGIONAL_TERMINOLOGY['surat-processing'];

// Type for supported regions
export type SupportedRegion = keyof typeof REGIONAL_TERMINOLOGY;

// Helper function to get terminology by region
export const getTerminologyByRegion = (region: SupportedRegion): TerminologyConfig => {
  return REGIONAL_TERMINOLOGY[region] || DEFAULT_TERMINOLOGY;
};