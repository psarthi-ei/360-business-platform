// Sales Mock Data for 360° Business Platform
// This file contains sales-related sample data: leads, quotes, orders, invoices, payments, and fabric specifications

export interface FabricRequirements {
  fabricType: string; // Cotton, Silk, Polyester, etc.
  gsm?: number; // Grams per Square Meter
  width?: string; // Fabric width (44", 58", etc.)
  weaveType?: string; // Plain, Twill, Satin, etc.
  quantity?: number; // Required quantity
  unit?: 'meters' | 'yards'; // Unit of measurement
  colors?: string; // Color specifications
  qualityGrade?: 'A-Grade' | 'B-Grade' | 'Export-Grade' | 'Industrial'; // Quality requirement
  specialProcessing?: string; // Dyeing, printing, finishing requirements
  deliveryTimeline?: string; // When fabric is needed
}

export interface Lead {
  id: string;
  businessProfileId: string; // Required - Links to BusinessProfile (single source of truth)
  
  // Contact Information (Individual Level - Lead-specific person)
  contactPerson: string;
  designation?: string;
  department?: string;
  contact: string; // phone/email combined
  phone?: string;
  email?: string;
  
  // Project Information (Specific to this lead)
  inquiry: string;
  budget: string;
  timeline: string;
  priority: 'hot' | 'warm' | 'cold';
  
  // UC-L04: Structured Fabric Requirements
  fabricRequirements?: FabricRequirements;
  
  // Relationship Tracking
  lastContact: string;
  notes: string;
  
  // Enhanced Conversion Status - Sales Process Stages
  conversionStatus: 'active_lead' | 'quote_sent' | 'verbally_approved' | 'proforma_sent' | 'awaiting_payment' | 'converted_to_order';
  convertedToOrderDate?: string;
}

// Base item interface - foundation for all commercial documents
export interface QuoteItem {
  itemCode: string;        // "TEX-PREM-001"
  description: string;     // "Premium Cotton Fabric"
  hsnCode: string;         // "5208" (HSN code for textiles)
  quantity: number;        // 1500
  unit: string;           // "meters", "kg", "pieces"
  rate: number;           // 185 (per unit price)
  discount: number;       // 0 (percentage discount) - made required for compatibility
  taxableAmount: number;  // 277500 (quantity * rate - discount)
}

export interface Quote {
  id: string;
  leadId: string;
  businessProfileId?: string; // Links to company BusinessProfile
  quoteDate: string;
  validUntil: string;
  items: string;                    // ✅ Keep existing (fallback)
  totalAmount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired' | 
          'proforma_sent' | 'advance_requested' | 'advance_overdue' | 
          'advance_received' | 'order_created';
  statusMessage: string;
  approvalDate?: string;
  proformaInvoiceId?: string;
  advancePaymentRequired?: number;
  advancePaymentStatus?: 'not_requested' | 'awaiting' | 'overdue' | 'received';
  
  // ✅ Add new structured fields (optional for zero breakage)
  itemsStructured?: QuoteItem[];    // ✅ Add new (optional)
}


export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface AdvancePayment {
  id: string;
  proformaInvoiceId: string; // Single relationship - access customer via invoice chain
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'received' | 'partial';
  receivedDate?: string;
  receivedAmount?: number;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cash' | 'Cheque' | 'UPI';
  transactionReference?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

// Proforma Invoice items - extends QuoteItem with tax calculations
export interface ProformaItem extends QuoteItem {
  cgstRate: number;       // 9% (Central GST rate)
  sgstRate: number;       // 9% (State GST rate)
  cgstAmount: number;     // 24975 (9% of taxable amount)
  sgstAmount: number;     // 24975 (9% of taxable amount)
  totalWithTax: number;   // 327450 (taxable amount + taxes)
}

export interface ProformaInvoice {
  id: string;
  quoteId: string;
  leadId: string;
  businessProfileId: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  advanceAmount: number;
  bankDetails: BankDetails;
  status: 'pending' | 'sent' | 'payment_received' | 'expired';
  paymentInstructions: string;
  
  // ✅ Add items support (missing in current interface)
  items?: string;                      // For existing records
  itemsStructured?: ProformaItem[];    // New structure
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  branch: string;
}

// Sales Order items - extends QuoteItem (production tracking moved to WorkOrders)
export interface OrderItem extends QuoteItem {
  // ❌ NO STATUS fields at item level - status is always SO-level
  // productionStatus?: string;     // ❌ Remove - use SalesOrder.status/productionStatus
  // materialStatus?: string;       // ❌ Remove - use SalesOrder.materialStatus
  
  // ✅ Production tracking handled by WorkOrder system for proper domain separation
}

export interface SalesOrder {
  id: string;
  quoteId: string;
  businessProfileId: string; // Changed from customerId
  advancePaymentId: string; // Links to advance payment that created this order
  orderDate: string;
  deliveryDate: string;
  items: string;                    // ✅ Keep existing (fallback)
  totalAmount: number;
  status: 'order_confirmed' | 'production_planning' | 'pending_materials' | 'production_started' | 'quality_check' | 'production_completed' | 'ready_to_ship' | 'shipped' | 'in_transit' | 'delivered' | 'completed';
  statusMessage: string;
  paymentStatus: 'pending' | 'advance_received' | 'partial' | 'completed' | 'overdue' | 'fully_paid';
  productionStatus: string;
  balancePaymentDue?: number; // Remaining balance after advance
  
  // Enhanced fields for Customer 360° view modal display
  quantity?: string; // Product quantity for display (e.g., "500 pieces")
  fabricType?: string; // Type of fabric (Cotton, Silk, etc.)
  productDescription?: string; // Detailed product description
  urgency?: 'normal' | 'urgent' | 'critical'; // Order urgency level
  customerNotes?: string; // Special customer instructions
  expectedDeliveryDate?: string; // Expected delivery date
  actualDeliveryDate?: string; // Actual delivery date when completed
  orderValue?: number; // For display formatting (same as totalAmount)
  progressPercentage?: number; // Production progress (0-100)
  
  // ✅ Add new structured fields (optional for zero breakage)
  itemsStructured?: OrderItem[];    // ✅ Add new (optional)
}

// Customer data moved to customerMockData.ts - import from there for customer-related functionality



export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  branch: string;
}

// Legacy ProformaItem interface removed - using new enhanced ProformaItem that extends QuoteItem

// Duplicate ProformaInvoice interface removed - using the one defined above






// Duplicate AdvancePayment interface removed - using the one defined earlier

// Supporting interfaces for comprehensive GST invoice
export interface CompanyDetails {
  name: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  stateCode: string;
  phone: string;
  email: string;
}

export interface CustomerDetails {
  name: string;
  billingAddress: string;
  gstNumber?: string;
  panNumber?: string;
  stateCode: string;
  phone: string;
}

export interface InvoiceItem {
  itemCode: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxableAmount: number;
}

export interface TaxDetails {
  isInterstate: boolean; // true for IGST, false for CGST+SGST
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
}

export interface PaymentDetails {
  advanceReceived: number;
  balanceDue: number;
  paymentTerms: string;
}

// Final GST Invoices - Module 10: Post-delivery billing
export interface FinalInvoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  businessProfileId: string;
  invoiceDate: string;
  dueDate: string;
  
  // Company and Customer Details
  company: CompanyDetails;
  customer: CustomerDetails;
  
  // Invoice Items
  items: InvoiceItem[];
  
  // Tax Calculations
  taxDetails: TaxDetails;
  
  // Payment Information
  paymentDetails: PaymentDetails;
  
  // Totals
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  totalAmount: number;
  
  // Status and Notes
  status: 'pending' | 'paid' | 'overdue';
  paymentReceivedDate?: string;
  notes: string;
  
  // Legacy fields for backward compatibility
  gstRate: number;
  gstAmount: number;
  advanceAdjusted: number;
  balanceAmount: number;
}

// Final Payment Records - Module 10: Payment closure tracking
export interface FinalPayment {
  id: string;
  finalInvoiceId: string; // Single relationship - access customer via invoice chain
  amount: number;
  paymentDate: string;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cash' | 'Cheque' | 'UPI';
  transactionReference: string;
  status: 'received' | 'verified' | 'reconciled';
  notes: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  reconciliationDate?: string;
  reconciliationNotes?: string;
  relatedAdvancePaymentId?: string; // Link to original advance payment
}

// Customer Feedback and Loyalty interfaces moved to customerMockData.ts

// Mock Data
// mockBusinessProfiles moved to customerMockData.ts - import from there for customer data

export const mockLeads: Lead[] = [
  // ACTIVE LEADS - Currently in lead management process (no BusinessProfile yet)
  {
    id: 'lead-001',
    businessProfileId: 'bp-mumbai-cotton-mills', // New prospect BusinessProfile
    contactPerson: 'Pradeep Kumar',
    designation: 'Purchase Manager',
    department: 'Procurement',
    contact: '+91 98765 11111 | pradeep@mumbaicomills.com',
    phone: '+91 98765 11111',
    email: 'pradeep@mumbaicomills.com',
    inquiry: 'Industrial cotton fabric - 8,000 yards',
    budget: '₹12-15 lakhs',
    timeline: '45 days',
    priority: 'hot',
    fabricRequirements: {
      fabricType: 'Cotton',
      gsm: 180,
      width: '44 inches',
      weaveType: 'Plain',
      quantity: 8000,
      unit: 'yards',
      colors: 'Natural white, dye-ready',
      qualityGrade: 'Industrial',
      specialProcessing: 'Pre-shrunk, ready for industrial use',
      deliveryTimeline: '45 days'
    },
    lastContact: 'Today 10:30 AM - "Very interested, send samples"',
    notes: 'New potential customer. Quick decision maker. Needs samples by Friday.',
    conversionStatus: 'active_lead'
  },
  {
    id: 'lead-002',
    businessProfileId: 'bp-surat-fashion-house', // New prospect BusinessProfile
    contactPerson: 'Meera Patel',
    designation: 'Production Head',
    department: 'Production',
    contact: '+91 99887 22222 | meera@suratfashion.com',
    phone: '+91 99887 22222',
    email: 'meera@suratfashion.com',
    inquiry: 'Mixed fabric for seasonal wear - 6,000 yards',
    budget: '₹10-14 lakhs',
    timeline: '60 days',
    priority: 'warm',
    fabricRequirements: {
      fabricType: 'Cotton Blend',
      gsm: 150,
      width: '44 inches',
      weaveType: 'Twill',
      quantity: 6000,
      unit: 'yards',
      colors: 'Navy blue, forest green, burgundy',
      qualityGrade: 'A-Grade',
      specialProcessing: 'Soft finish, color-fast dyeing',
      deliveryTimeline: '60 days'
    },
    lastContact: 'Yesterday - "Comparing suppliers, will decide soon"',
    notes: 'Price-sensitive buyer. Interested in long-term partnership.',
    conversionStatus: 'quote_sent'
  },
  // CONVERTED LEADS - Linked to existing customers
  {
    id: 'gujarat-002',
    businessProfileId: 'bp-gujarat-garments',
    contactPerson: 'Kiran Patel',
    designation: 'Owner',
    department: 'Management',
    contact: '+91 99884 55667 | kiran@gujaratgarments.com',
    phone: '+91 99884 55667',
    email: 'kiran@gujaratgarments.com',
    inquiry: 'Export quality cotton fabric - 5,000 yards',
    budget: '₹8-10 lakhs',
    timeline: '30 days',
    priority: 'hot',
    lastContact: 'Converted to order on March 15, 2025',
    notes: 'Successfully converted to order. First order completed successfully.',
    conversionStatus: 'converted_to_order',
    convertedToOrderDate: 'March 15, 2025'
  },
  {
    id: 'baroda-004',
    businessProfileId: 'bp-baroda-fashion',
    contactPerson: 'Rajesh Mehta',
    designation: 'Creative Director',
    department: 'Design',
    contact: '+91 98765 43210 | rajesh@barodafashion.com',
    phone: '+91 98765 43210',
    email: 'rajesh@barodafashion.com',
    inquiry: 'Premium fashion fabric - 3,500 yards',
    budget: '₹6-8 lakhs',
    timeline: '20 days',
    priority: 'warm',
    lastContact: 'Converted to order on April 02, 2025',
    notes: 'Excellent payment behavior - completed first order successfully.',
    conversionStatus: 'converted_to_order',
    convertedToOrderDate: 'April 02, 2025'
  },
  {
    id: 'lead-003',
    businessProfileId: 'bp-baroda-textiles', // New prospect BusinessProfile
    contactPerson: 'Ashok Shah',
    contact: '+91 97654 33333 | ashok@barodatextiles.com',
    phone: '+91 97654 33333',
    email: 'ashok@barodatextiles.com',
    inquiry: 'Cotton fabric for retail - 4,000 yards',
    budget: '₹6-9 lakhs',
    timeline: '90 days',
    lastContact: 'Last week - "Need more time to decide"',
    priority: 'cold',
    notes: 'New prospect - slow decision process. Follow up in 2 weeks.',
    conversionStatus: 'active_lead'
  },
  // LEADS WITH PENDING PAYMENTS - These will convert to customers once payment received
  {
    id: 'lead-004',
    businessProfileId: 'bp-rajesh-textiles', // New prospect BusinessProfile
    contactPerson: 'Rajesh Shah', 
    contact: '+91 98765 43210 | rajesh@rateshtextiles.com',
    inquiry: 'High-grade cotton fabric for export - 10,000 yards',
    budget: '₹18-22 lakhs',
    timeline: '30 days',
    lastContact: 'Today 2:30 PM - "Will pay advance by tomorrow"',
    priority: 'hot',
    notes: 'Quote approved. Proforma invoice sent. Advance payment expected tomorrow.',
    conversionStatus: 'proforma_sent'
  },
  
  // CONVERTED LEADS - Kept for historical tracking but filtered from active display
  {
    id: 'lead-005',
    businessProfileId: 'bp-gujarat-garments',
    contactPerson: 'Kiran Desai',
    contact: '+91 98765 55555 | kiran@gujaratfabrics.com',
    phone: '+91 98765 55555',
    email: 'kiran@gujaratfabrics.com',
    inquiry: 'Premium cotton blend - 8,000 yards',
    budget: '₹15-18 lakhs',
    timeline: '25 days',
    lastContact: 'Converted to customer on March 31, 2025',
    priority: 'hot',
    notes: 'Successfully converted to customer. First order completed successfully.',
    conversionStatus: 'converted_to_order',
    convertedToOrderDate: 'March 31, 2025'
  },
  
  // ========================================
  // LEADS FOR EXISTING CUSTOMERS - ONGOING BUSINESS RELATIONSHIPS
  // ========================================
  
  // Repeat Business Lead for Gujarat Garments (existing customer)
  {
    id: 'lead-cust-001',
    businessProfileId: 'bp-gujarat-garments', // EXISTING CUSTOMER
    contactPerson: 'Kiran Patel',
    designation: 'Owner',
    department: 'Management',
    contact: '+91 99884 55667 | kiran@gujaratgarments.com',
    phone: '+91 99884 55667',
    email: 'kiran@gujaratgarments.com',
    inquiry: 'Seasonal collection fabric - 6,000 yards for winter collection',
    budget: '₹12-15 lakhs',
    timeline: '35 days',
    priority: 'hot',
    fabricRequirements: {
      fabricType: 'Cotton Blend',
      gsm: 160,
      width: '44 inches',
      weaveType: 'Twill',
      quantity: 6000,
      unit: 'yards',
      colors: 'Autumn colors - rust, burgundy, forest green',
      qualityGrade: 'A-Grade',
      specialProcessing: 'Water-resistant finish for winter wear',
      deliveryTimeline: '35 days'
    },
    lastContact: 'Today 11:00 AM - "Need winter collection ready by December"',
    notes: 'Existing customer - excellent payment history. Looking for repeat order with new specifications.',
    conversionStatus: 'quote_sent'
  },
  
  // Repeat Business Lead for Baroda Fashion House (existing customer)
  {
    id: 'lead-cust-002',
    businessProfileId: 'bp-baroda-fashion', // EXISTING CUSTOMER
    contactPerson: 'Rajesh Mehta',
    designation: 'Creative Director',
    department: 'Design',
    contact: '+91 98765 43210 | rajesh@barodafashion.com',
    phone: '+91 98765 43210',
    email: 'rajesh@barodafashion.com',
    inquiry: 'Premium fashion fabric expansion - 8,000 yards',
    budget: '₹18-22 lakhs',
    timeline: '40 days',
    priority: 'warm',
    fabricRequirements: {
      fabricType: 'Silk Blend',
      gsm: 140,
      width: '58 inches',
      weaveType: 'Satin',
      quantity: 8000,
      unit: 'yards',
      colors: 'Pastel spring collection - mint, lavender, peach',
      qualityGrade: 'Export-Grade',
      specialProcessing: 'Anti-wrinkle treatment, luxury finish',
      deliveryTimeline: '40 days'
    },
    lastContact: 'Yesterday - "Expanding our premium line, need your quality"',
    notes: 'Trusted repeat customer. Previous orders always on-time payment. Premium pricing acceptable.',
    conversionStatus: 'verbally_approved'
  },
  
  // New Business Lead for Surat Wholesale Market (existing customer)
  {
    id: 'lead-cust-003',
    businessProfileId: 'bp-surat-wholesale', // EXISTING CUSTOMER
    contactPerson: 'Mehul Shah',
    designation: 'Purchase Manager',
    department: 'Procurement',
    contact: '+91 98765 43203 | mehul@suratwholesale.com',
    phone: '+91 98765 43203',
    email: 'mehul@suratwholesale.com',
    inquiry: 'Bulk wholesale fabric order - 15,000 yards',
    budget: '₹25-30 lakhs',
    timeline: '50 days',
    priority: 'hot',
    fabricRequirements: {
      fabricType: 'Mixed Cotton',
      gsm: 130,
      width: '44 inches',
      weaveType: 'Plain',
      quantity: 15000,
      unit: 'yards',
      colors: 'Mixed assortment - 10 different colors',
      qualityGrade: 'B-Grade',
      specialProcessing: 'Bulk packaging, wholesale ready',
      deliveryTimeline: '50 days'
    },
    lastContact: 'This morning - "Biggest order this year, need best pricing"',
    notes: 'Large wholesale customer. Volume discount expected. Fast payment on delivery.',
    conversionStatus: 'active_lead'
  }
];

export const mockQuotes: Quote[] = [
  // ========================================
  // LEAD-QUOTE DATA RELATIONSHIP DOCUMENTATION
  // ========================================
  
  // BUSINESS WORKFLOW: Lead Conversion Status → Quote Status Alignment
  // 1. 'active_lead' → Quote status: 'pending' (quote prepared but not sent)
  // 2. 'quote_sent' → Quote status: 'under_review' (quote sent, awaiting response)  
  // 3. 'verbally_approved' → Quote status: 'approved' (customer agreed verbally)
  // 4. 'proforma_sent' → Quote status: 'proforma_sent' (proforma invoice sent)
  // 5. 'awaiting_payment' → Quote status: 'advance_requested' (payment pending)
  // 6. 'converted_to_order' → Quote status: 'order_created' (payment received, customer created)
  
  // DATA INTEGRITY RULES:
  // - Every lead with 'quote_sent'+ status MUST have at least one quote
  // - Every lead with 'proforma_sent'+ status MUST have quote with proforma details
  // - Every lead with 'converted_to_order' status MUST have received advance payment
  // - Quote leadId MUST reference valid lead in mockLeads array
  // - Quote businessProfileId MUST reference valid profile for converted customers
  
  // Quotes for active leads (no BusinessProfile yet)
  {
    id: 'QT-001',
    leadId: 'lead-001',
    quoteDate: 'March 15, 2025',
    validUntil: 'March 30, 2025',
    items: 'Industrial cotton fabric - 8,000 yards @ ₹185/yard',
    totalAmount: 1480000,
    status: 'under_review',
    statusMessage: 'Customer is reviewing quote - Expecting response by end of week',
    advancePaymentRequired: 740000, // 50% advance
    advancePaymentStatus: 'not_requested',
    // ✅ Enhanced with structured items for professional presentation
    itemsStructured: [
      {
        itemCode: "TEX-IND-001",
        description: "Industrial Cotton Fabric",
        hsnCode: "5208",
        quantity: 8000,
        unit: "yards",
        rate: 185,
        discount: 0,
        taxableAmount: 1480000
      }
    ]
  },
  {
    id: 'QT-002',
    leadId: 'lead-002', // Lead status: 'quote_sent' - ALIGNED
    quoteDate: 'March 18, 2025',
    validUntil: 'April 5, 2025',
    items: 'Mixed fabric for seasonal wear - 6,000 yards @ ₹220/yard',
    totalAmount: 1320000,
    status: 'under_review', // ALIGNED: quote_sent → under_review status
    statusMessage: 'Quote sent to customer - Awaiting response from production head',
    advancePaymentRequired: 660000, // 50% advance
    advancePaymentStatus: 'not_requested', // No payment request yet until quote approved
    // ✅ Enhanced with structured items - multiple items example
    itemsStructured: [
      {
        itemCode: "TEX-SEAS-001",
        description: "Cotton Seasonal Fabric - Light Weight",
        hsnCode: "5208",
        quantity: 3000,
        unit: "yards", 
        rate: 210,
        discount: 0,
        taxableAmount: 630000
      },
      {
        itemCode: "TEX-SEAS-002", 
        description: "Polyester Blend Fabric - Seasonal Collection",
        hsnCode: "5407",
        quantity: 3000,
        unit: "yards",
        rate: 230,
        discount: 0,
        taxableAmount: 690000
      }
    ]
  },
  // Quotes for converted customers (linked to BusinessProfile)
  {
    id: 'QT-GJ-002',
    leadId: 'gujarat-002',
    businessProfileId: 'bp-gujarat-garments',
    quoteDate: 'March 10, 2025',
    validUntil: 'March 25, 2025',
    items: 'Export quality cotton fabric - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'order_created',
    statusMessage: 'Order created successfully - Quote completed',
    approvalDate: 'March 12, 2025',
    proformaInvoiceId: 'PI-GJ-002',
    advancePaymentRequired: 487500, // 50% advance
    advancePaymentStatus: 'received', // This triggered customer creation
    // ✅ Enhanced with single premium item
    itemsStructured: [
      {
        itemCode: "TEX-EXP-001",
        description: "Export Quality Cotton Fabric - Premium Grade",
        hsnCode: "5208",
        quantity: 5000,
        unit: "yards",
        rate: 195,
        discount: 0,
        taxableAmount: 975000
      }
    ]
  },
  {
    id: 'QT-BR-004',
    leadId: 'baroda-004',
    businessProfileId: 'bp-baroda-fashion',
    quoteDate: 'March 28, 2025',
    validUntil: 'April 15, 2025',
    items: 'Premium fashion fabric - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'approved',
    statusMessage: 'Quote approved - Advance payment received, customer created',
    approvalDate: 'March 30, 2025',
    proformaInvoiceId: 'PI-BR-004',
    advancePaymentRequired: 367500, // 50% advance
    advancePaymentStatus: 'received', // This triggered customer creation
    // ✅ Enhanced with multiple fashion items and discount
    itemsStructured: [
      {
        itemCode: "TEX-FASH-001",
        description: "Premium Silk Blend Fabric - Designer Collection",
        hsnCode: "5007",
        quantity: 2000,
        unit: "yards",
        rate: 250,
        discount: 5, // 5% bulk discount
        taxableAmount: 475000
      },
      {
        itemCode: "TEX-FASH-002", 
        description: "Cotton-Linen Fashion Fabric - Summer Collection",
        hsnCode: "5208",
        quantity: 1500,
        unit: "yards",
        rate: 180,
        discount: 0,
        taxableAmount: 270000
      },
      {
        itemCode: "SVC-DYE-001",
        description: "Custom Color Matching Service",
        hsnCode: "9983",
        quantity: 3500,
        unit: "yards",
        rate: 15,
        discount: 0,
        taxableAmount: 52500
      }
    ]
  },
  {
    id: 'QT-GUJ-001',
    leadId: 'gujarat-002',
    businessProfileId: 'bp-gujarat-garments',
    quoteDate: 'March 10, 2025',
    validUntil: 'March 25, 2025',
    items: 'Mixed fabric for casual wear - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'approved',
    statusMessage: 'Quote approved - Advance payment received, auto-converting to customer',
    proformaInvoiceId: 'PI-002',
    advancePaymentRequired: 487500, // 50% advance
    advancePaymentStatus: 'received', // This triggered customer conversion
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-CAS-001",
        description: "Mixed Cotton Fabric for Casual Wear",
        hsnCode: "5208",
        quantity: 5000,
        unit: "yards",
        rate: 195,
        discount: 0,
        taxableAmount: 975000
      }
    ]
  },
  {
    id: 'QT-002B',
    leadId: 'gujarat-002',
    quoteDate: 'March 12, 2025',
    validUntil: 'March 30, 2025',
    items: 'Budget fabric option - 6,000 yards @ ₹165/yard',
    totalAmount: 990000,
    status: 'rejected',
    statusMessage: 'Lead rejected budget option, went with main quote QT-002',
    proformaInvoiceId: undefined,
    advancePaymentRequired: 495000, // 50% advance
    advancePaymentStatus: 'not_requested',
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-BUD-001",
        description: "Budget Cotton Fabric Option",
        hsnCode: "5208",
        quantity: 6000,
        unit: "yards",
        rate: 165,
        discount: 0,
        taxableAmount: 990000
      }
    ]
  },
  {
    id: 'QT-003',
    leadId: 'baroda-004',
    quoteDate: 'February 20, 2025',
    validUntil: 'March 5, 2025',
    items: 'Seasonal fabric collection - 3,000 yards @ ₹220/yard',
    totalAmount: 660000,
    status: 'expired',
    statusMessage: 'Quote expired - Lead requested extension, new quote being prepared',
    proformaInvoiceId: 'PI-003',
    advancePaymentRequired: 330000, // 50% advance
    advancePaymentStatus: 'overdue',
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-SEA-002",
        description: "Seasonal Fashion Fabric Collection",
        hsnCode: "5209",
        quantity: 3000,
        unit: "yards",
        rate: 220,
        discount: 10000, // Small discount applied
        taxableAmount: 650000
      }
    ]
  },
  {
    id: 'QT-004',
    leadId: 'baroda-004',
    quoteDate: 'March 8, 2025',
    validUntil: 'March 25, 2025',
    items: 'Updated seasonal collection - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'approved',
    statusMessage: 'New quote approved - Advance payment received, converting to customer',
    proformaInvoiceId: 'PI-004',
    advancePaymentRequired: 367500, // 50% advance
    advancePaymentStatus: 'received', // This triggered customer conversion
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-SEA-001",
        description: "Seasonal Fashion Fabric Collection",
        hsnCode: "5209",
        quantity: 3500,
        unit: "yards",
        rate: 210,
        discount: 0,
        taxableAmount: 735000
      }
    ]
  },
  
  // CRITICAL FIX: Missing quote for lead-004 (proforma_sent status)
  {
    id: 'QT-L004-001',
    leadId: 'lead-004', // Links to lead with conversionStatus: 'proforma_sent'
    businessProfileId: 'bp-rajesh-textiles',
    quoteDate: 'October 15, 2025',
    validUntil: 'November 5, 2025',
    items: 'High-grade cotton fabric for export - 10,000 yards @ ₹200/yard',
    totalAmount: 2000000,
    status: 'proforma_sent', // Aligns with lead conversionStatus
    statusMessage: 'Proforma invoice sent - Advance payment requested (₹10,00,000)',
    proformaInvoiceId: 'PI-L004-001',
    advancePaymentRequired: 1000000, // 50% advance for export quality
    advancePaymentStatus: 'awaiting', // Waiting for payment to convert lead to customer
    // ✅ Enhanced with comprehensive export order (4 items with discounts)
    itemsStructured: [
      {
        itemCode: "TEX-EXP-002",
        description: "Export Grade Cotton Fabric - A+ Quality",
        hsnCode: "5208",
        quantity: 6000,
        unit: "yards",
        rate: 220,
        discount: 10, // 10% bulk discount
        taxableAmount: 1188000
      },
      {
        itemCode: "TEX-EXP-003",
        description: "Premium Cotton Muslin - Export Quality",
        hsnCode: "5208",
        quantity: 2000,
        unit: "yards",
        rate: 180,
        discount: 5, // 5% discount
        taxableAmount: 342000
      },
      {
        itemCode: "SVC-EXP-001",
        description: "Export Quality Certification & Testing",
        hsnCode: "9983",
        quantity: 8000,
        unit: "yards",
        rate: 12,
        discount: 0,
        taxableAmount: 96000
      },
      {
        itemCode: "SVC-PKG-001", 
        description: "Export Packaging & Documentation",
        hsnCode: "9983",
        quantity: 1,
        unit: "order",
        rate: 85000,
        discount: 15, // 15% special discount
        taxableAmount: 72250
      }
    ]
  },
  
  // WORKFLOW COMPLETION: Missing quote for lead-003 (active lead stage)
  {
    id: 'QT-L003-001',
    leadId: 'lead-003', // Links to lead with conversionStatus: 'active_lead'
    businessProfileId: 'bp-baroda-textiles',
    quoteDate: 'October 10, 2025',
    validUntil: 'October 30, 2025',
    items: 'Cotton fabric for retail - 4,000 yards @ ₹175/yard',
    totalAmount: 700000,
    status: 'pending', // Active lead stage - quote prepared but not yet sent
    statusMessage: 'Quote prepared - Ready to send to prospect',
    advancePaymentRequired: 350000, // 50% advance
    advancePaymentStatus: 'not_requested', // No payment request yet in active lead stage
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-RET-001",
        description: "Cotton Fabric for Retail Applications",
        hsnCode: "5208",
        quantity: 4000,
        unit: "yards",
        rate: 175,
        discount: 0,
        taxableAmount: 700000
      }
    ]
  },
  
  // ========================================
  // QUOTES FOR EXISTING CUSTOMER LEADS - REPEAT BUSINESS
  // ========================================
  
  // Quote for existing customer Gujarat Garments (lead-cust-001: quote_sent status)
  {
    id: 'QT-CUST-001',
    leadId: 'lead-cust-001', // EXISTING CUSTOMER repeat business
    businessProfileId: 'bp-gujarat-garments',
    quoteDate: 'October 20, 2025',
    validUntil: 'November 10, 2025',
    items: 'Seasonal collection fabric - 6,000 yards @ ₹225/yard (winter premium)',
    totalAmount: 1350000,
    status: 'under_review', // ALIGNED: quote_sent → under_review status
    statusMessage: 'Quote sent to valued customer - Awaiting approval for winter collection',
    advancePaymentRequired: 675000, // 50% advance
    advancePaymentStatus: 'not_requested', // Quote sent, awaiting customer response
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-SEA-002",
        description: "Seasonal Winter Collection Fabric",
        hsnCode: "5209",
        quantity: 6000,
        unit: "yards",
        rate: 225,
        discount: 0,
        taxableAmount: 1350000
      }
    ]
  },
  
  // Quote for existing customer Baroda Fashion (lead-cust-002: verbally_approved status)
  {
    id: 'QT-CUST-002',
    leadId: 'lead-cust-002', // EXISTING CUSTOMER repeat business
    businessProfileId: 'bp-baroda-fashion',
    quoteDate: 'October 18, 2025',
    validUntil: 'November 8, 2025',
    items: 'Premium fashion fabric expansion - 8,000 yards @ ₹275/yard (export grade)',
    totalAmount: 2200000,
    status: 'approved', // ALIGNED: verbally_approved → approved status
    statusMessage: 'Quote verbally approved by Creative Director - Preparing proforma invoice',
    proformaInvoiceId: 'PI-CUST-002',
    advancePaymentRequired: 1100000, // 50% advance for premium order
    advancePaymentStatus: 'not_requested', // Moving to proforma stage
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-EXP-001",
        description: "Premium Fashion Fabric - Export Grade",
        hsnCode: "5208",
        quantity: 8000,
        unit: "yards",
        rate: 275,
        discount: 0,
        taxableAmount: 2200000
      }
    ]
  },
  
  // Quote for existing customer Surat Wholesale (lead-cust-003: active_lead status)
  {
    id: 'QT-CUST-003',
    leadId: 'lead-cust-003', // EXISTING CUSTOMER new inquiry
    businessProfileId: 'bp-surat-wholesale',
    quoteDate: 'October 22, 2025',
    validUntil: 'November 12, 2025',
    items: 'Bulk wholesale fabric order - 15,000 yards @ ₹180/yard (volume pricing)',
    totalAmount: 2700000,
    status: 'pending', // ALIGNED: active_lead → pending status
    statusMessage: 'Large volume quote prepared - Reviewing final pricing with management',
    advancePaymentRequired: 1350000, // 50% advance for bulk order
    advancePaymentStatus: 'not_requested', // Quote being finalized
    // ✅ Enhanced with structured items for professional display
    itemsStructured: [
      {
        itemCode: "TEX-WHD-001",
        description: "Bulk Wholesale Cotton Fabric",
        hsnCode: "5208",
        quantity: 15000,
        unit: "yards",
        rate: 180,
        discount: 0,
        taxableAmount: 2700000
      }
    ]
  },
  
  // QT-005: Bulk order quote (later converted to SO-005)
  {
    id: 'QT-005',
    leadId: 'lead-005',
    quoteDate: 'March 10, 2025',
    validUntil: 'March 25, 2025',
    items: 'Cotton fabric bulk order - 3,000 meters @ ₹175/meter',
    totalAmount: 525000,
    status: 'approved',
    statusMessage: 'Bulk quote approved - Advance payment received',
    advancePaymentRequired: 157500, // 30% advance
    advancePaymentStatus: 'received',
    // ✅ Enhanced with structured items for professional presentation
    itemsStructured: [
      {
        itemCode: "TEX-BULK-001",
        description: "Cotton Fabric Bulk Order - Premium Quality",
        hsnCode: "5208",
        quantity: 2000,
        unit: "meters",
        rate: 175,
        discount: 0,
        taxableAmount: 350000
      },
      {
        itemCode: "TEX-BULK-002", 
        description: "Cotton Canvas Fabric - Industrial Grade",
        hsnCode: "5208",
        quantity: 1000,
        unit: "meters",
        rate: 180,
        discount: 5, // Bulk discount
        taxableAmount: 171000
      },
      {
        itemCode: "SVC-QC-001",
        description: "Quality Control & Testing Service",
        hsnCode: "9983",
        quantity: 3000,
        unit: "meters",
        rate: 1.33,
        discount: 0,
        taxableAmount: 4000
      }
    ]
  }
];

export const mockSalesOrders: SalesOrder[] = [
  // SO-001: Premium customer with soft reservation (ready for production)
  {
    id: 'SO-001',
    quoteId: 'QT-001',
    businessProfileId: 'bp-gujarat-garments',
    advancePaymentId: 'ADV-QT-001-001',
    orderDate: 'October 20, 2025',
    deliveryDate: 'November 15, 2025',
    items: 'Industrial Cotton Fabric - 8,000 yards @ ₹185/yard', // ✅ Consistent with Quote QT-001
    totalAmount: 1480000, // ✅ Consistent: 8000 * 185 = 1,480,000
    status: 'order_confirmed' as const,
    statusMessage: 'Advance payment received - Ready for production planning',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Materials reserved - Ready to start',
    balancePaymentDue: 1036000, // ✅ 70% of 1,480,000 (after 30% advance)
    // ✅ Enhanced with structured items for production tracking - Consistent with QT-001
    itemsStructured: [
      {
        itemCode: "TEX-IND-001",
        description: "Industrial Cotton Fabric",
        hsnCode: "5208",
        quantity: 8000,
        unit: "yards",
        rate: 185,
        discount: 0,
        taxableAmount: 1480000
      }
    ],
    
    // Enhanced fields for Customer 360° view
    quantity: '8,000 yards', // ✅ Consistent with structured items
    fabricType: 'Industrial Cotton', // ✅ Consistent with structured items
    productDescription: 'High-quality cotton fabric for saree production, 44" width, 120 GSM',
    urgency: 'normal' as const,
    customerNotes: 'Quality to match previous order sample. Pack in waterproof covers.',
    expectedDeliveryDate: 'November 15, 2025',
    orderValue: 277500,
    progressPercentage: 15
  },
  // SO-002: Order with mixed materials (some available, some shortage)
  {
    id: 'SO-002',
    quoteId: 'QT-002',
    businessProfileId: 'bp-baroda-fashion',
    advancePaymentId: 'ADV-QT-002-001',
    orderDate: 'October 20, 2025',
    deliveryDate: 'November 20, 2025',
    items: 'Mixed fabric for seasonal wear - 6,000 yards @ ₹220/yard',
    totalAmount: 1320000,
    status: 'pending_materials' as const,
    statusMessage: 'Material shortage - Procurement in progress',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Waiting for material availability',
    balancePaymentDue: 924000, // ✅ 70% of 1,320,000 (after 30% advance)
    // ✅ Enhanced with structured items for production tracking - Consistent with QT-002
    itemsStructured: [
      {
        itemCode: "TEX-SEAS-001",
        description: "Cotton Seasonal Fabric - Light Weight",
        hsnCode: "5208",
        quantity: 3000,
        unit: "yards",
        rate: 210,
        discount: 0,
        taxableAmount: 630000
      },
      {
        itemCode: "TEX-SEAS-002",
        description: "Polyester Blend Fabric - Seasonal Collection",
        hsnCode: "5407",
        quantity: 3000,
        unit: "yards",
        rate: 230,
        discount: 0,
        taxableAmount: 690000
      }
    ]
  },
  // SO-003: Order in production (hard reservation)
  {
    id: 'SO-003',
    quoteId: 'QT-003',
    businessProfileId: 'bp-baroda-fashion',
    advancePaymentId: 'ADV-QT-003-001',
    orderDate: 'October 19, 2025',
    deliveryDate: 'November 10, 2025',
    items: 'Polyester blend fabric - 2,000 meters @ ₹165/meter',
    totalAmount: 330000,
    status: 'production_started' as const,
    statusMessage: 'Production in progress - 60% completed',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Work Order WO-2025-003A active',
    balancePaymentDue: 231000,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-POL-001",
        description: "Polyester Blend Fabric - Premium Grade",
        hsnCode: "5407",
        quantity: 2000,
        unit: "meters",
        rate: 165,
        discount: 0,
        taxableAmount: 330000
      }
    ],
    progressPercentage: 60 // Production in progress - 60% completed
  },
  // SO-004: Completed order
  {
    id: 'SO-004',
    quoteId: 'QT-004',
    businessProfileId: 'bp-baroda-fashion',
    advancePaymentId: 'ADV-QT-004-001',
    orderDate: 'October 18, 2025',
    deliveryDate: 'November 5, 2025',
    items: 'Seasonal collection fabric - 1,800 meters @ ₹210/meter',
    totalAmount: 378000,
    status: 'completed' as const,
    statusMessage: 'Order completed and delivered successfully',
    paymentStatus: 'completed' as const,
    productionStatus: 'Completed and delivered',
    balancePaymentDue: 0,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-SEAS-001",
        description: "Seasonal Collection Fabric - Premium Cotton Blend",
        hsnCode: "5208",
        quantity: 1800,
        unit: "meters",
        rate: 210,
        discount: 0,
        taxableAmount: 378000
      }
    ],
    progressPercentage: 100 // Fully completed
  },
  // SO-005: Order with soft reservation (competing for materials)
  {
    id: 'SO-005',
    quoteId: 'QT-005',
    businessProfileId: 'bp-gujarat-garments',
    advancePaymentId: 'ADV-QT-005-001',
    orderDate: 'October 21, 2025',
    deliveryDate: 'November 25, 2025',
    items: 'Cotton fabric bulk order - 3,000 meters @ ₹175/meter',
    totalAmount: 525000,
    status: 'order_confirmed' as const,
    statusMessage: 'Advance payment received - Ready for production',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Ready for material allocation',
    balancePaymentDue: 367500,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-BULK-001",
        description: "Cotton Fabric Bulk Order - Premium Quality",
        hsnCode: "5208",
        quantity: 2000,
        unit: "meters",
        rate: 175,
        discount: 0,
        taxableAmount: 350000
      },
      {
        itemCode: "TEX-BULK-002", 
        description: "Cotton Canvas Fabric - Industrial Grade",
        hsnCode: "5208",
        quantity: 1000,
        unit: "meters",
        rate: 180,
        discount: 5, // Bulk discount
        taxableAmount: 171000
      },
      {
        itemCode: "SVC-QC-001",
        description: "Quality Control & Testing Service",
        hsnCode: "9983",
        quantity: 3000,
        unit: "meters",
        rate: 1.33,
        discount: 0,
        taxableAmount: 4000
      }
    ]
  },
  // SO-006: Order that would show shortage due to material conflicts
  {
    id: 'SO-006',
    quoteId: 'QT-006',
    businessProfileId: 'bp-baroda-fashion',
    advancePaymentId: 'ADV-QT-006-001',
    orderDate: 'October 21, 2025',
    deliveryDate: 'November 30, 2025',
    items: 'Cotton yarn fabric - 2,200 meters @ ₹190/meter',
    totalAmount: 418000,
    status: 'order_confirmed' as const,
    statusMessage: 'Advance payment received - Checking material availability',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Pending material availability check',
    balancePaymentDue: 292600,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-YARN-001",
        description: "Cotton Yarn Fabric - High Quality Weave",
        hsnCode: "5205",
        quantity: 2200,
        unit: "meters",
        rate: 190,
        discount: 0,
        taxableAmount: 418000
      }
    ]
  },
  
  // Phase 3 New Customer Orders
  {
    id: 'SO-008',
    quoteId: 'QT-030',
    businessProfileId: 'bp-ahmedabad-fashion',
    advancePaymentId: 'AP-2025-009',
    orderDate: 'September 15, 2025',
    deliveryDate: 'October 30, 2025',
    items: 'Premium Export Fashion Fabric - 2,000 meters @ ₹787.50/meter',
    totalAmount: 1575000,
    status: 'delivered' as const,
    statusMessage: 'Order completed and delivered - Invoice paid',
    paymentStatus: 'fully_paid' as const,
    productionStatus: 'Delivered and completed',
    balancePaymentDue: 0,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-EXP-FASH-001",
        description: "Premium Export Fashion Fabric - Designer Grade",
        hsnCode: "5208",
        quantity: 2000,
        unit: "meters",
        rate: 787.50,
        discount: 0,
        taxableAmount: 1575000
      }
    ],
    progressPercentage: 100 // Fully completed
  },
  {
    id: 'SO-009',
    quoteId: 'QT-031',
    businessProfileId: 'bp-bhavnagar-marine',
    advancePaymentId: 'AP-2025-010',
    orderDate: 'August 20, 2025',
    deliveryDate: 'September 30, 2025',
    items: 'Marine-grade Industrial Fabric - 1,200 meters @ ₹812.50/meter',
    totalAmount: 975000,
    status: 'delivered' as const,
    statusMessage: 'Order delivered and paid - Excellent marine quality',
    paymentStatus: 'fully_paid' as const,
    productionStatus: 'Delivered and completed',
    balancePaymentDue: 0,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-MAR-001",
        description: "Marine-Grade Industrial Fabric - High Durability",
        hsnCode: "5906",
        quantity: 1200,
        unit: "meters",
        rate: 812.50,
        discount: 0,
        taxableAmount: 975000
      }
    ],
    progressPercentage: 100 // Fully completed
  },
  {
    id: 'SO-010',
    quoteId: 'QT-032',
    businessProfileId: 'bp-vadodara-crafts',
    advancePaymentId: 'AP-2025-011',
    orderDate: 'July 10, 2025',
    deliveryDate: 'August 15, 2025',
    items: 'Traditional Handloom Fabric - 600 meters @ ₹625/meter',
    totalAmount: 375000,
    status: 'production_completed' as const,
    statusMessage: 'Production completed - Ready for delivery',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Quality check completed - Ready for dispatch',
    balancePaymentDue: 0,
    // ✅ Enhanced with structured items for production tracking
    itemsStructured: [
      {
        itemCode: "TEX-HAND-001",
        description: "Traditional Handloom Fabric - Artisan Crafted",
        hsnCode: "5208",
        quantity: 600,
        unit: "meters",
        rate: 625,
        discount: 0,
        taxableAmount: 375000
      }
    ],
    progressPercentage: 95 // Production completed - ready for delivery
  }
];

// Customer data moved to customerMockData.ts


// Standard Bank Details for Proforma Invoices
export const companyBankDetails: BankDetails = {
  bankName: 'State Bank of India',
  accountNumber: '38472951627',
  ifscCode: 'SBIN0001234',
  accountName: 'ElevateIdea Technologies Private Limited',
  branch: 'Surat Main Branch, Gujarat'
};

// Proforma Invoice Data for Advance Payment Workflows
export const mockProformaInvoices: ProformaInvoice[] = [
  {
    id: 'PI-2025-001',
    quoteId: 'QT-001',
    leadId: 'lead-001',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'October 10, 2025',
    dueDate: 'October 25, 2025',  // Future: 8 days from today (pending)
    subtotal: 1850000,
    gstAmount: 92500,
    totalAmount: 1942500,
    advanceAmount: 971250,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: 'Please pay 50% advance (₹9,71,250) within 15 days to confirm order',
    // ✅ Enhanced with structured items from corresponding quote QT-001
    items: 'Industrial cotton fabric - 8,000 yards @ ₹185/yard', // Legacy field
    itemsStructured: [
      {
        itemCode: "TEX-IND-001",
        description: "Industrial Cotton Fabric",
        hsnCode: "5208",
        quantity: 8000,
        unit: "yards",
        rate: 185,
        discount: 0,
        taxableAmount: 1480000,
        cgstRate: 9,
        sgstRate: 9,
        cgstAmount: 133200, // 9% of 1480000
        sgstAmount: 133200, // 9% of 1480000
        totalWithTax: 1746400 // 1480000 + 266400 tax
      }
    ]
  },
  {
    id: 'PI-2025-002',
    quoteId: 'QT-004',
    leadId: 'lead-004',
    businessProfileId: 'bp-baroda-fashion',
    issueDate: 'October 12, 2025',
    dueDate: 'October 27, 2025',  // Future: 10 days from today (pending)
    subtotal: 825000,
    gstAmount: 41250,
    totalAmount: 866250,
    advanceAmount: 259875,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: '30% advance payment (₹2,59,875) required for new customer',
    // ✅ Enhanced with structured items for professional GST display
    items: 'Seasonal fabric collection - 3,500 yards @ ₹210/yard', // Legacy field
    itemsStructured: [
      {
        itemCode: "TEX-SEA-001",
        description: "Seasonal Fashion Fabric Collection",
        hsnCode: "5209",
        quantity: 3500,
        unit: "yards",
        rate: 210,
        discount: 0,
        taxableAmount: 735000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 18375, // 2.5% of 735000
        sgstAmount: 18375, // 2.5% of 735000
        totalWithTax: 771750 // 735000 + 36750 tax
      }
    ]
  },
  {
    id: 'PI-2025-003',
    quoteId: 'QT-005',
    leadId: 'lead-005',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'October 8, 2025',
    dueDate: 'October 23, 2025',  // Future: 6 days from today (pending)
    subtotal: 9175000,
    gstAmount: 458750,
    totalAmount: 9633750,
    advanceAmount: 3853500,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: '40% advance payment (₹38,53,500) required for export orders with LC/Bank guarantee',
    // ✅ Enhanced with structured items for professional GST display - Export order
    items: 'Premium export fabric collection - 50,000 yards @ ₹183.5/yard', // Legacy field
    itemsStructured: [
      {
        itemCode: "TEX-EXP-001",
        description: "Premium Export Cotton Fabric",
        hsnCode: "5208",
        quantity: 25000,
        unit: "yards",
        rate: 183,
        discount: 0,
        taxableAmount: 4575000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 114375, // 2.5% of 4575000
        sgstAmount: 114375, // 2.5% of 4575000
        totalWithTax: 4803750 // 4575000 + 228750 tax
      },
      {
        itemCode: "TEX-EXP-002", 
        description: "Premium Export Blended Fabric",
        hsnCode: "5212",
        quantity: 25000,
        unit: "yards",
        rate: 184,
        discount: 0,
        taxableAmount: 4600000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 115000, // 2.5% of 4600000
        sgstAmount: 115000, // 2.5% of 4600000
        totalWithTax: 4830000 // 4600000 + 230000 tax
      }
    ]
  },
  {
    id: 'PI-2025-004',
    quoteId: 'QT-003',
    leadId: 'lead-003',
    businessProfileId: 'bp-baroda-fashion',
    issueDate: 'September 28, 2025',
    dueDate: 'October 8, 2025',  // Past: 9 days ago (expired - overdue proforma)
    subtotal: 650000,
    gstAmount: 32500,
    totalAmount: 682500,
    advanceAmount: 204750,
    bankDetails: companyBankDetails,
    status: 'expired',
    paymentInstructions: '30% advance payment (₹2,04,750) required - payment overdue, order may be cancelled',
    // ✅ Enhanced with structured items for professional GST display
    items: 'Seasonal fabric collection - 3,000 yards @ ₹220/yard', // Legacy field
    itemsStructured: [
      {
        itemCode: "TEX-SEA-002",
        description: "Seasonal Fashion Fabric Collection",
        hsnCode: "5209",
        quantity: 3000,
        unit: "yards", 
        rate: 220,
        discount: 10000, // Small discount applied
        taxableAmount: 650000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 16250, // 2.5% of 650000
        sgstAmount: 16250, // 2.5% of 650000
        totalWithTax: 682500 // 650000 + 32500 tax
      }
    ]
  },
  {
    id: 'PI-2025-005',
    quoteId: 'QT-002',
    leadId: 'lead-002',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'September 30, 2025',
    dueDate: 'October 12, 2025',  // Past: 5 days ago (payment received)
    subtotal: 1200000,
    gstAmount: 60000,
    totalAmount: 1260000,
    advanceAmount: 630000,
    bankDetails: companyBankDetails,
    status: 'payment_received',
    paymentInstructions: '50% advance payment (₹6,30,000) received on October 10, 2025 - order confirmed',
    // ✅ Enhanced with structured items for professional GST display
    items: 'Mixed fabric for seasonal wear - 6,000 yards @ ₹220/yard', // Legacy field
    itemsStructured: [
      {
        itemCode: "TEX-MIX-001",
        description: "Mixed Cotton Fabric for Seasonal Wear",
        hsnCode: "5208",
        quantity: 3000,
        unit: "yards",
        rate: 200,
        discount: 0,
        taxableAmount: 600000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 15000, // 2.5% of 600000
        sgstAmount: 15000, // 2.5% of 600000
        totalWithTax: 630000 // 600000 + 30000 tax
      },
      {
        itemCode: "TEX-MIX-002",
        description: "Mixed Blended Fabric for Seasonal Wear",
        hsnCode: "5212",
        quantity: 3000,
        unit: "yards",
        rate: 200,
        discount: 0,
        taxableAmount: 600000,
        cgstRate: 2.5,
        sgstRate: 2.5,
        cgstAmount: 15000, // 2.5% of 600000
        sgstAmount: 15000, // 2.5% of 600000
        totalWithTax: 630000 // 600000 + 30000 tax
      }
    ]
  }
];

// Realistic Gujarat Textile Fabric Specifications

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount).replace('₹', '₹');
};

export const getLeadById = (id: string): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id);
};

export const getSalesOrderById = (id: string): SalesOrder | undefined => {
  return mockSalesOrders.find(order => order.id === id);
};

// Customer lookup functions moved to customerMockData.ts

// getQuotesByCustomerId moved to customerMockData.ts

export const getSalesOrdersByCustomerId = (customerId: string): SalesOrder[] => {
  return mockSalesOrders.filter(order => order.businessProfileId === customerId);
};

// Customer-sales relationship functions moved back to customerMockData.ts to avoid circular dependencies

// New Helper Functions for Comprehensive Mock Data

// Proforma Invoice Functions
export const getProformaInvoiceById = (id: string): ProformaInvoice | undefined => {
  return mockProformaInvoices.find(pi => pi.id === id);
};

export const getProformaInvoicesByCustomerId = (customerId: string): ProformaInvoice[] => {
  return mockProformaInvoices.filter(pi => pi.businessProfileId === customerId);
};

export const getProformaInvoiceByQuoteId = (quoteId: string): ProformaInvoice | undefined => {
  return mockProformaInvoices.find(pi => pi.quoteId === quoteId);
};

// Customer loyalty functions moved to customerMockData.ts


// Business analytics functions that depend on customer data moved to customerMockData.ts

// Gujarat-specific customer functions moved to customerMockData.ts

// Advanced Payment Functions
export const calculateAdvanceAmount = (totalAmount: number, percentage: number): number => {
  return Math.round(totalAmount * (percentage / 100));
};

export const generateGSTAmount = (amount: number, gstRate: number = 5): number => {
  return Math.round(amount * (gstRate / 100));
};

export const calculateTotalWithGST = (amount: number, gstRate: number = 5): number => {
  return amount + generateGSTAmount(amount, gstRate);
};

// Loyalty tier calculation functions moved to customerMockData.ts

// Work Orders Data - Production authorization from sales orders

// Vendors Data - Gujarat textile suppliers for raw material procurement


// Production Records Data - Daily production tracking with quality

// Advance Payment Records Data - Actual payments against proforma invoices
export const mockAdvancePayments: AdvancePayment[] = [
  {
    id: 'AP-2025-001',
    proformaInvoiceId: 'PI-2025-001',
    amount: 971250,
    dueDate: 'April 2, 2025',
    status: 'received',
    receivedDate: 'March 19, 2025',
    receivedAmount: 971250,
    paymentMethod: 'RTGS',
    transactionReference: 'HDFC240319RT12345'
  },
  {
    id: 'AP-2025-002',
    proformaInvoiceId: 'PI-2025-002',
    amount: 259875,
    dueDate: 'April 10, 2025',
    status: 'received',
    receivedDate: 'March 28, 2025',
    receivedAmount: 259875,
    paymentMethod: 'NEFT',
    transactionReference: 'SBI240328NF67890'
  },
  {
    id: 'AP-2025-003',
    proformaInvoiceId: 'PI-2025-003',
    amount: 3853500,
    dueDate: 'April 15, 2025',
    status: 'pending',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2025-004',
    proformaInvoiceId: 'PI-2025-004',
    amount: 750000,
    dueDate: 'April 20, 2025',
    status: 'received',
    receivedDate: 'March 31, 2025',
    receivedAmount: 750000,
    paymentMethod: 'RTGS',
    transactionReference: 'ICICI240331RT13579'
  },
  {
    id: 'AP-2025-005',
    proformaInvoiceId: 'PI-2025-005',
    amount: 630000,
    dueDate: 'October 12, 2025',
    status: 'received',
    receivedDate: 'October 10, 2025',
    receivedAmount: 630000,
    paymentMethod: 'RTGS',
    transactionReference: 'HDFC251010RT24681'
  },
  
  // New Advance Payments - Converting Prospects to Customers
  {
    id: 'AP-2025-007',
    proformaInvoiceId: 'PI-2025-007',
    amount: 1800000,
    dueDate: 'November 15, 2025',
    status: 'received',
    receivedDate: 'October 25, 2025',
    receivedAmount: 1800000,
    paymentMethod: 'NEFT',
    transactionReference: 'SBI251025NF98765'
  },
  {
    id: 'AP-2025-008',
    proformaInvoiceId: 'PI-2025-008',
    amount: 2250000,
    dueDate: 'November 20, 2025',
    status: 'received',
    receivedDate: 'October 28, 2025',
    receivedAmount: 2250000,
    paymentMethod: 'RTGS',
    transactionReference: 'HDFC251028SW13579'
  },
  
  // Phase 3 New Customers - Advanced Payments
  {
    id: 'AP-2025-009',
    proformaInvoiceId: 'PI-2025-009',
    amount: 1575000,
    dueDate: 'September 25, 2025',
    status: 'received',
    receivedDate: 'September 15, 2025',
    receivedAmount: 1575000,
    paymentMethod: 'RTGS',
    transactionReference: 'ICICI250915SW24680'
  },
  {
    id: 'AP-2025-010',
    proformaInvoiceId: 'PI-2025-010',
    amount: 975000,
    dueDate: 'August 30, 2025',
    status: 'received',
    receivedDate: 'August 20, 2025',
    receivedAmount: 975000,
    paymentMethod: 'RTGS',
    transactionReference: 'CANARA250820RT13591'
  },
  {
    id: 'AP-2025-011',
    proformaInvoiceId: 'PI-2025-011',
    amount: 375000,
    dueDate: 'July 20, 2025',
    status: 'received',
    receivedDate: 'July 10, 2025',
    receivedAmount: 375000,
    paymentMethod: 'NEFT',
    transactionReference: 'BOB250710NF97531'
  }
];

// Final GST Invoices Data - Post-delivery billing
export const mockFinalInvoices: FinalInvoice[] = [
  {
    id: 'INV-2025-001',
    invoiceNumber: 'INV-2025-001',
    salesOrderId: 'SO-004',
    businessProfileId: 'bp-baroda-fashion',
    invoiceDate: 'September 28, 2025',
    dueDate: 'October 13, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Baroda Fashion House',
      billingAddress: 'Shop No. 12, Fashion Plaza, Vadodara - 390001, Gujarat',
      gstNumber: '24FGHIJ5678K1L9',
      panNumber: 'FGHIJ5678K',
      stateCode: '24',
      phone: '+91 98765 43201'
    },
    
    items: [
      {
        itemCode: 'TEX-SEAS-001',
        description: 'Seasonal collection fabric - Premium Cotton Blend',
        hsnCode: '5208',
        quantity: 1800,
        unit: 'Meters',
        rate: 833.33,
        discount: 0,
        taxableAmount: 1500000
      }
    ],
    
    taxDetails: {
      isInterstate: false, // Gujarat to Gujarat (intrastate)
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 37500,
      sgstAmount: 37500,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 750000,
      balanceDue: 825000,
      paymentTerms: 'Net 15 days'
    },
    
    subtotal: 1500000,
    totalDiscount: 0,
    taxableAmount: 1500000,
    totalTax: 75000,
    totalAmount: 1575000,
    
    status: 'paid',
    paymentReceivedDate: 'October 10, 2025',
    notes: 'Premium customer - paid before due date. Excellent relationship.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 75000,
    advanceAdjusted: 750000,
    balanceAmount: 825000
  },
  {
    id: 'INV-2025-002',
    invoiceNumber: 'INV-2025-002',
    salesOrderId: 'SO-002',
    businessProfileId: 'bp-gujarat-garments',
    invoiceDate: 'September 25, 2025',
    dueDate: 'October 10, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Gujarat Garments Co',
      billingAddress: 'Block A-12, Textile Market, Ahmedabad - 380001, Gujarat',
      gstNumber: '24LMNOP9876Q2R3',
      panNumber: 'LMNOP9876Q',
      stateCode: '24',
      phone: '+91 98765 43202'
    },
    
    items: [
      {
        itemCode: 'TEX-PREM-002',
        description: 'Premium Designer Collection - Silk Blend Fabric',
        hsnCode: '5007',
        quantity: 1200,
        unit: 'Meters',
        rate: 916.67,
        discount: 0,
        taxableAmount: 1100000
      }
    ],
    
    taxDetails: {
      isInterstate: false,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 27500,
      sgstAmount: 27500,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 550000,
      balanceDue: 605000,
      paymentTerms: 'Net 15 days'
    },
    
    subtotal: 1100000,
    totalDiscount: 0,
    taxableAmount: 1100000,
    totalTax: 55000,
    totalAmount: 1155000,
    
    status: 'paid',
    paymentReceivedDate: 'October 8, 2025',
    notes: 'Regular customer - standard payment terms honored.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 55000,
    advanceAdjusted: 550000,
    balanceAmount: 605000
  },
  {
    id: 'INV-2025-003',
    invoiceNumber: 'INV-2025-003',
    salesOrderId: 'SO-001',
    businessProfileId: 'bp-gujarat-garments',
    invoiceDate: 'September 20, 2025',
    dueDate: 'October 10, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Gujarat Garments Co',
      billingAddress: 'Block A-12, Textile Market, Ahmedabad - 380001, Gujarat',
      gstNumber: '24LMNOP9876Q2R3',
      panNumber: 'LMNOP9876Q',
      stateCode: '24',
      phone: '+91 98765 43202'
    },
    
    items: [
      {
        itemCode: 'TEX-BULK-003',
        description: 'Bulk Order - Cotton Canvas Material',
        hsnCode: '5208',
        quantity: 2500,
        unit: 'Meters',
        rate: 740.00,
        discount: 0,
        taxableAmount: 1850000
      }
    ],
    
    taxDetails: {
      isInterstate: false,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 46250,
      sgstAmount: 46250,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 971250,
      balanceDue: 971250,
      paymentTerms: 'Net 15 days'
    },
    
    subtotal: 1850000,
    totalDiscount: 0,
    taxableAmount: 1850000,
    totalTax: 92500,
    totalAmount: 1942500,
    
    status: 'overdue',
    paymentReceivedDate: '',
    notes: 'Balance payment overdue by 7 days. Follow-up required.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 92500,
    advanceAdjusted: 971250,
    balanceAmount: 971250
  },
  {
    id: 'INV-2025-004',
    invoiceNumber: 'INV-2025-004',
    salesOrderId: 'SO-003',
    businessProfileId: 'bp-baroda-fashion',
    invoiceDate: 'October 5, 2025',
    dueDate: 'October 30, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Baroda Fashion House',
      billingAddress: 'Shop No. 12, Fashion Plaza, Vadodara - 390001, Gujarat',
      gstNumber: '24FGHIJ5678K1L9',
      panNumber: 'FGHIJ5678K',
      stateCode: '24',
      phone: '+91 98765 43201'
    },
    
    items: [
      {
        itemCode: 'TEX-FASH-004',
        description: 'Fashion Collection - Designer Print Fabric',
        hsnCode: '5208',
        quantity: 1100,
        unit: 'Meters',
        rate: 750.00,
        discount: 0,
        taxableAmount: 825000
      }
    ],
    
    taxDetails: {
      isInterstate: false,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 20625,
      sgstAmount: 20625,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 259875,
      balanceDue: 606375,
      paymentTerms: 'Net 15 days'
    },
    
    subtotal: 825000,
    totalDiscount: 0,
    taxableAmount: 825000,
    totalTax: 41250,
    totalAmount: 866250,
    
    status: 'pending',
    paymentReceivedDate: '',
    notes: 'New customer - first invoice. Payment terms: 15 days.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 41250,
    advanceAdjusted: 259875,
    balanceAmount: 606375
  },
  {
    id: 'INV-2025-005',
    invoiceNumber: 'INV-2025-005',
    salesOrderId: 'SO-005',
    businessProfileId: 'bp-surat-wholesale',
    invoiceDate: 'October 8, 2025',
    dueDate: 'October 25, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Surat Wholesale Market',
      billingAddress: 'Shop No. 45, Wholesale Complex, Surat - 394210, Gujarat',
      gstNumber: '24STUVW1234X5Y6',
      panNumber: 'STUVW1234X',
      stateCode: '24',
      phone: '+91 98765 43203'
    },
    
    items: [
      {
        itemCode: 'TEX-WHSL-005',
        description: 'Wholesale Collection - Mixed Fabric Bundle',
        hsnCode: '5208',
        quantity: 1500,
        unit: 'Meters',
        rate: 666.67,
        discount: 0,
        taxableAmount: 1000000
      }
    ],
    
    taxDetails: {
      isInterstate: false,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 25000,
      sgstAmount: 25000,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 300000,
      balanceDue: 750000,
      paymentTerms: 'Net 10 days'
    },
    
    subtotal: 1000000,
    totalDiscount: 0,
    taxableAmount: 1000000,
    totalTax: 50000,
    totalAmount: 1050000,
    
    status: 'pending',
    paymentReceivedDate: '',
    notes: 'Wholesale order - fast delivery required.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 50000,
    advanceAdjusted: 300000,
    balanceAmount: 750000
  },
  {
    id: 'INV-2025-006',
    invoiceNumber: 'INV-2025-006',
    salesOrderId: 'SO-006',
    businessProfileId: 'bp-rajkot-mills',
    invoiceDate: 'October 12, 2025',
    dueDate: 'November 2, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Rajkot Cotton Mills',
      billingAddress: 'Industrial Area Phase-2, Rajkot - 360003, Gujarat',
      gstNumber: '24DEFGH5678I9J0',
      panNumber: 'DEFGH5678I',
      stateCode: '24',
      phone: '+91 98765 43204'
    },
    
    items: [
      {
        itemCode: 'TEX-COTT-006',
        description: 'Cotton Processing Material - Raw Blend',
        hsnCode: '5201',
        quantity: 2000,
        unit: 'Kg',
        rate: 450.00,
        discount: 0,
        taxableAmount: 900000
      }
    ],
    
    taxDetails: {
      isInterstate: false,
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cgstAmount: 22500,
      sgstAmount: 22500,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 450000,
      balanceDue: 495000,
      paymentTerms: 'Net 21 days'
    },
    
    subtotal: 900000,
    totalDiscount: 0,
    taxableAmount: 900000,
    totalTax: 45000,
    totalAmount: 945000,
    
    status: 'pending',
    paymentReceivedDate: '',
    notes: 'Cotton processing order - quality inspection required.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 45000,
    advanceAdjusted: 450000,
    balanceAmount: 495000
  },
  {
    id: 'INV-2025-007',
    invoiceNumber: 'INV-2025-007',
    salesOrderId: 'SO-007',
    businessProfileId: 'bp-mumbai-exports',
    invoiceDate: 'October 15, 2025',
    dueDate: 'November 5, 2025',
    
    company: {
      name: 'Surat Textile Mills Pvt Ltd',
      address: 'Plot No. 45, Industrial Estate, Surat - 394210, Gujarat',
      gstNumber: '24ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      stateCode: '24',
      phone: '+91 98765 43210',
      email: 'accounts@surattextiles.com'
    },
    
    customer: {
      name: 'Mumbai Export House',
      billingAddress: 'Trade Center, Nariman Point, Mumbai - 400021, Maharashtra',
      gstNumber: '27KLMNO3456P7Q8',
      panNumber: 'KLMNO3456P',
      stateCode: '27',
      phone: '+91 98765 43205'
    },
    
    items: [
      {
        itemCode: 'TEX-EXPR-007',
        description: 'Export Quality Fabric - Premium Finish',
        hsnCode: '5208',
        quantity: 800,
        unit: 'Meters',
        rate: 1250.00,
        discount: 0,
        taxableAmount: 1000000
      }
    ],
    
    taxDetails: {
      isInterstate: true, // Gujarat to Maharashtra
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 5,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 50000
    },
    
    paymentDetails: {
      advanceReceived: 500000,
      balanceDue: 550000,
      paymentTerms: 'Net 21 days'
    },
    
    subtotal: 1000000,
    totalDiscount: 0,
    taxableAmount: 1000000,
    totalTax: 50000,
    totalAmount: 1050000,
    
    status: 'pending',
    paymentReceivedDate: '',
    notes: 'Export order - documentation and compliance required.',
    
    // Legacy fields for backward compatibility
    gstRate: 5,
    gstAmount: 50000,
    advanceAdjusted: 500000,
    balanceAmount: 550000
  }
];

// Final Payment Records Data - Payment closure tracking
export const mockFinalPayments: FinalPayment[] = [
  {
    id: 'FP-2025-001',
    finalInvoiceId: 'INV-2025-001',
    amount: 825000,
    paymentDate: 'October 10, 2025',  // Matches paymentReceivedDate in invoice
    paymentMethod: 'RTGS',
    transactionReference: 'ICICI251010RT97531',
    status: 'reconciled',
    notes: 'Final payment received on time. Order closed successfully.'
  },
  {
    id: 'FP-2025-002',
    finalInvoiceId: 'INV-2025-002',
    amount: 605000,
    paymentDate: 'October 8, 2025',  // Matches paymentReceivedDate in invoice
    paymentMethod: 'RTGS',
    transactionReference: 'BOB251008RT86420',
    status: 'reconciled',
    notes: 'Regular customer - prompt payment as usual. Order completed.'
  }
];

// Customer feedback data moved to customerMockData.ts

// Loyalty transactions data moved to customerMockData.ts

// ========================================
// HOLISTIC BUSINESS RELATIONSHIP FUNCTIONS
// ========================================




// Financial Management Functions
export const getAdvancePaymentByProformaId = (proformaId: string): AdvancePayment | undefined => {
  return mockAdvancePayments.find(ap => ap.proformaInvoiceId === proformaId);
};

// Helper functions for invoice-based payment architecture

// Get advance payment with full details (payment + invoice + quote + lead + customer)
export const getAdvancePaymentWithDetails = (paymentId: string) => {
  const payment = mockAdvancePayments.find(ap => ap.id === paymentId);
  if (!payment) return null;
  
  const invoice = mockProformaInvoices.find(pi => pi.id === payment.proformaInvoiceId);
  if (!invoice) return { payment, invoice: null, quote: null, lead: null };
  
  const quote = mockQuotes.find(q => q.id === invoice.quoteId);
  const lead = quote ? mockLeads.find(l => l.id === quote.leadId) : null;
  
  return { payment, invoice, quote, lead };
};

// Get final payment with full details (payment + invoice + order + quote + lead + customer)
export const getFinalPaymentWithDetails = (paymentId: string) => {
  const payment = mockFinalPayments.find(fp => fp.id === paymentId);
  if (!payment) return null;
  
  const invoice = mockFinalInvoices.find(fi => fi.id === payment.finalInvoiceId);
  if (!invoice) return { payment, invoice: null, order: null, quote: null, lead: null };
  
  const order = mockSalesOrders.find(so => so.id === invoice.salesOrderId);
  const quote = order ? mockQuotes.find(q => q.id === order.quoteId) : null;
  const lead = quote ? mockLeads.find(l => l.id === quote.leadId) : null;
  
  return { payment, invoice, order, quote, lead };
};

// Get all advance payments for a customer by traversing invoice relationships
export const getAdvancePaymentsByCustomerId = (customerId: string): AdvancePayment[] => {
  const customerInvoices = mockProformaInvoices.filter(pi => pi.businessProfileId === customerId);
  const invoiceIds = customerInvoices.map(pi => pi.id);
  return mockAdvancePayments.filter(ap => invoiceIds.includes(ap.proformaInvoiceId));
};

// Get all final payments for a customer by traversing invoice relationships
export const getFinalPaymentsByCustomerId = (customerId: string): FinalPayment[] => {
  const customerInvoices = mockFinalInvoices.filter(fi => fi.businessProfileId === customerId);
  const invoiceIds = customerInvoices.map(fi => fi.id);
  return mockFinalPayments.filter(fp => invoiceIds.includes(fp.finalInvoiceId));
};

export const getFinalInvoiceById = (id: string): FinalInvoice | undefined => {
  return mockFinalInvoices.find(inv => inv.id === id);
};

export const getFinalInvoicesBySalesOrderId = (salesOrderId: string): FinalInvoice[] => {
  return mockFinalInvoices.filter(inv => inv.salesOrderId === salesOrderId);
};

// Final payments lookup functions moved to customerMockData.ts

// Customer experience functions moved to customerMockData.ts

// Loyalty program functions moved to customerMockData.ts

// Complete customer journey function moved to customerMockData.ts

// Business Analytics Functions
export const getTotalBusinessValue = (): number => {
  return mockFinalInvoices.reduce((total, invoice) => total + invoice.totalAmount, 0);
};

export const getPendingPaymentsValue = (): number => {
  return mockFinalInvoices
    .filter(inv => inv.status !== 'paid')
    .reduce((total, inv) => total + inv.balanceAmount, 0);
};

export const getAverageOrderValueFromSalesOrders = (): number => {
  if (mockSalesOrders.length === 0) return 0;
  const totalValue = mockSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  return Math.round(totalValue / mockSalesOrders.length);
};


// getCustomerSatisfactionScore moved to customerMockData.ts

// Order Fulfillment Functions
// getOrderFulfillmentStatus function moved to customerMockData.ts (depends on customer feedback)

// getTopPerformingCustomers moved to customerMockData.ts

// Material Requirements Planning

/**
 * ENHANCED COMMERCIAL DOCUMENTS - FEATURE TOGGLE SYSTEM & HELPERS
 * Phase 1: Dual support infrastructure for safe migration
 */

// Feature toggle configuration
export interface FeatureToggles {
  STRUCTURED_ITEMS_ENABLED: boolean;
  CONSOLIDATED_MR_ENABLED: boolean;
  PROFESSIONAL_INVOICING_ENABLED: boolean;
}

// Default configuration (professional display enabled by default)
export const defaultFeatureToggles: FeatureToggles = {
  STRUCTURED_ITEMS_ENABLED: true,
  CONSOLIDATED_MR_ENABLED: false,
  PROFESSIONAL_INVOICING_ENABLED: false
};

// Feature toggle state (in-memory for MVP, can be moved to localStorage/context later)
let currentFeatureToggles: FeatureToggles = { ...defaultFeatureToggles };

// Feature toggle management functions
export function getFeatureToggleState(feature: keyof FeatureToggles): boolean {
  return currentFeatureToggles[feature];
}

export function setFeatureToggle(feature: keyof FeatureToggles, enabled: boolean): void {
  currentFeatureToggles[feature] = enabled;
  // Feature toggle state updated
}

export function resetFeatureToggles(): void {
  currentFeatureToggles = { ...defaultFeatureToggles };
  // Feature toggles reset to defaults
}

// React hook for components
export function useFeatureToggle(feature: keyof FeatureToggles): boolean {
  return getFeatureToggleState(feature);
}

/**
 * BUSINESS LOGIC HELPER FUNCTIONS
 */

// Convert Quote items to ProformaInvoice items
export function convertQuoteToProformaItems(quoteItems: QuoteItem[]): ProformaItem[] {
  return quoteItems.map(item => ({
    ...item,
    cgstRate: 9,
    sgstRate: 9,
    cgstAmount: Math.round(item.taxableAmount * 0.09),
    sgstAmount: Math.round(item.taxableAmount * 0.09),
    totalWithTax: Math.round(item.taxableAmount * 1.18)
  }));
}

// Convert Quote items to SalesOrder items
export function convertQuoteToOrderItems(quoteItems: QuoteItem[]): OrderItem[] {
  return quoteItems.map(item => ({
    ...item
  }));
}

// Convert ProformaInvoice items to FinalInvoice items
export function convertProformaToInvoiceItems(proformaItems: ProformaItem[], advancePercentage: number = 0.3): InvoiceItem[] {
  return proformaItems.map(item => {
    const advanceAmount = Math.round(item.totalWithTax * advancePercentage);
    return {
      ...item,
      advanceAmount,
      balanceAmount: item.totalWithTax - advanceAmount
    };
  });
}

// Calculate totals for structured items
export function calculateItemTotals(items: QuoteItem[]): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const taxAmount = subtotal * 0.18; // 18% GST
  const total = subtotal + taxAmount;
  
  return {
    subtotal: Math.round(subtotal),
    taxAmount: Math.round(taxAmount),
    total: Math.round(total)
  };
}

// Calculate totals for ProformaInvoice structured items (with separate CGST/SGST)
export function calculateProformaItemTotals(items: ProformaItem[]): { 
  subtotal: number; 
  cgstAmount: number; 
  sgstAmount: number; 
  total: number 
} {
  const subtotal = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  const cgstAmount = items.reduce((sum, item) => sum + item.cgstAmount, 0);
  const sgstAmount = items.reduce((sum, item) => sum + item.sgstAmount, 0);
  const total = subtotal + cgstAmount + sgstAmount;
  
  return {
    subtotal: Math.round(subtotal),
    cgstAmount: Math.round(cgstAmount),
    sgstAmount: Math.round(sgstAmount),
    total: Math.round(total)
  };
}

// Calculate totals for FinalInvoice structured items (InvoiceItem[])
export function calculateInvoiceItemTotals(items: InvoiceItem[]): { 
  subtotal: number; 
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  total: number 
} {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const taxableAmount = items.reduce((sum, item) => sum + item.taxableAmount, 0);
  // For final invoices, we calculate tax differently - it's part of the taxableAmount calculation
  const totalTax = taxableAmount * 0.05; // 5% GST (could be CGST+SGST or IGST)
  const total = taxableAmount + totalTax;
  
  return {
    subtotal: Math.round(subtotal),
    totalDiscount: Math.round(totalDiscount),
    taxableAmount: Math.round(taxableAmount),
    totalTax: Math.round(totalTax),
    total: Math.round(total)
  };
}

/**
 * TYPE GUARDS FOR RUNTIME CHECKING
 */

export function hasStructuredItems<T extends { itemsStructured?: unknown[] }>(obj: T): obj is T & { itemsStructured: unknown[] } {
  return obj.itemsStructured !== undefined && obj.itemsStructured.length > 0;
}

export function isQuoteWithStructuredItems(quote: unknown): quote is Quote & { itemsStructured: QuoteItem[] } {
  return quote !== null && typeof quote === 'object' && 
         'itemsStructured' in quote && Array.isArray((quote as Quote).itemsStructured) && 
         (quote as Quote).itemsStructured!.length > 0;
}

export function isProformaWithStructuredItems(proforma: unknown): proforma is ProformaInvoice & { itemsStructured: ProformaItem[] } {
  return proforma !== null && typeof proforma === 'object' && 
         'itemsStructured' in proforma && Array.isArray((proforma as ProformaInvoice).itemsStructured) && 
         (proforma as ProformaInvoice).itemsStructured!.length > 0;
}

export function isSalesOrderWithStructuredItems(order: unknown): order is SalesOrder & { itemsStructured: OrderItem[] } {
  return order !== null && typeof order === 'object' && 
         'itemsStructured' in order && Array.isArray((order as SalesOrder).itemsStructured) && 
         (order as SalesOrder).itemsStructured!.length > 0;
}
export function isFinalInvoiceWithStructuredItems(invoice: unknown): invoice is FinalInvoice & { items: InvoiceItem[] } {
  return invoice !== null && typeof invoice === 'object' && 
         'items' in invoice && Array.isArray((invoice as FinalInvoice).items) && 
         (invoice as FinalInvoice).items!.length > 0;
}

/**
 * SAMPLE STRUCTURED ITEMS DATA (for testing and development)
 */

export const sampleQuoteItems: QuoteItem[] = [
  {
    itemCode: "TEX-IND-001", // ✅ Consistent with actual mock data
    description: "Industrial Cotton Fabric",
    hsnCode: "5208",
    quantity: 8000,
    unit: "yards",
    rate: 185,
    discount: 0,
    taxableAmount: 1480000
  },
  {
    itemCode: "TEX-SEAS-001", // ✅ Consistent with QT-002 mock data
    description: "Cotton Seasonal Fabric - Light Weight",
    hsnCode: "5208",
    quantity: 3000,
    unit: "yards",
    rate: 210,
    discount: 0,
    taxableAmount: 630000
  }
];

export const sampleProformaItems: ProformaItem[] = convertQuoteToProformaItems(sampleQuoteItems);
export const sampleOrderItems: OrderItem[] = convertQuoteToOrderItems(sampleQuoteItems);

