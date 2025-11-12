// Regional terminology configuration types for MVP Simplification
// Core system maintains manufacturing standards, UI displays regional terms

export interface TerminologyConfig {
  // Core business entities
  customer: string;
  customers: string;
  
  // Business module names
  salesModule: string;
  procurementModule: string;
  productionModule: string;
  
  // Sales process
  lead: string;
  leads: string;
  quote: string;
  quotes: string;
  invoice: string;
  invoices: string;
  order: string;
  orders: string;
  
  // Production process
  workOrder: string;
  workOrders: string;
  productionOrder: string;
  productionOrders: string;
  
  // Procurement process
  goodsReceiptNote: string;
  inventory: string;
  
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
    
    // Business module names - Surat specific terminology
    salesModule: 'Job Work',
    procurementModule: 'Materials',
    productionModule: 'Process',
    
    // Sales process - Local terms
    lead: 'Inquiry',
    leads: 'Inquiries',
    quote: 'Rate',
    quotes: 'Rates',
    invoice: 'Job Bill',
    invoices: 'Job Bills',
    order: 'Job Order',
    orders: 'Job Orders',
    
    // Production process - Shop floor terms
    workOrder: 'Lot',
    workOrders: 'Lots',
    productionOrder: 'Job Card',
    productionOrders: 'Job Cards',
    
    // Procurement process - Industry terms
    goodsReceiptNote: 'Inward',
    inventory: 'Stock',
    
    // Actions - Local terminology
    generateQuote: 'Send Rate',
    generateInvoice: 'Generate Job Bill', 
    addCustomer: 'Add Party'
  },
  
  'mumbai-trading': {
    // Core entities - Corporate terminology
    customer: 'Customer',
    customers: 'Customers',
    
    // Business module names - Corporate terminology
    salesModule: 'Sales',
    procurementModule: 'Procurement',
    productionModule: 'Production',
    
    // Sales process - Formal terms
    lead: 'Lead',
    leads: 'Leads',
    quote: 'Quote',
    quotes: 'Quotes',
    invoice: 'Invoice',
    invoices: 'Invoices',
    order: 'Order',
    orders: 'Orders',
    
    // Production process - Standard terms
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    productionOrder: 'Job Card',
    productionOrders: 'Job Cards',
    
    // Procurement process - Standard terms
    goodsReceiptNote: 'GRN',
    inventory: 'Inventory',
    
    // Actions - Formal terminology
    generateQuote: 'Generate Quote',
    generateInvoice: 'Generate Invoice',
    addCustomer: 'Add Customer'
  },
  
  'chennai-manufacturing': {
    // Core entities - Manufacturing terminology
    customer: 'Customer',
    customers: 'Customers',
    
    // Business module names - Manufacturing terminology
    salesModule: 'Sales',
    procurementModule: 'Procurement',
    productionModule: 'Manufacturing',
    
    // Sales process - Manufacturing terms
    lead: 'RFQ',
    leads: 'RFQs',
    quote: 'Quotation',
    quotes: 'Quotations',
    invoice: 'Invoice', 
    invoices: 'Invoices',
    order: 'Order',
    orders: 'Orders',
    
    // Production process - Manufacturing terms
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    productionOrder: 'Job Card',
    productionOrders: 'Job Cards',
    
    // Procurement process - Manufacturing terms
    goodsReceiptNote: 'Goods Receipt',
    inventory: 'Inventory',
    
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