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
  businessProfileId?: string; // Links to company when BusinessProfile created
  
  // Company Information (will migrate to BusinessProfile)
  companyName: string;
  location: string;
  business: string;
  
  // Contact Information (Individual Level)
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
  
  // Enhanced Conversion Status
  conversionStatus: 'active_lead' | 'quote_sent' | 'verbally_approved' | 'profile_pending' | 'proforma_sent' | 'awaiting_payment' | 'converted_to_customer';
  convertedToCustomerDate?: string;
}

export interface Quote {
  id: string;
  leadId: string;
  businessProfileId?: string; // Links to company BusinessProfile
  companyName: string;
  location: string;
  quoteDate: string;
  validUntil: string;
  items: string;
  totalAmount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired' | 
          'proforma_sent' | 'advance_requested' | 'advance_overdue' | 
          'advance_received' | 'order_created';
  statusMessage: string;
  approvalDate?: string;
  proformaInvoiceId?: string;
  advancePaymentRequired?: number;
  advancePaymentStatus?: 'not_requested' | 'awaiting' | 'overdue' | 'received';
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
  proformaInvoiceId: string;
  quoteId: string;
  leadId: string;
  businessProfileId: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'received' | 'partial';
  receivedDate?: string;
  receivedAmount?: number;
  bankReference?: string;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cash' | 'Cheque' | 'UPI';
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
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  branch: string;
}

export interface SalesOrder {
  id: string;
  quoteId: string;
  businessProfileId: string; // Changed from customerId
  advancePaymentId: string; // Links to advance payment that created this order
  orderDate: string;
  deliveryDate: string;
  items: string;
  totalAmount: number;
  status: 'order_confirmed' | 'production_planning' | 'pending_materials' | 'production_started' | 'quality_check' | 'production_completed' | 'ready_to_ship' | 'shipped' | 'in_transit' | 'delivered' | 'completed';
  statusMessage: string;
  paymentStatus: 'pending' | 'advance_received' | 'partial' | 'completed' | 'overdue';
  productionStatus: string;
  balancePaymentDue?: number; // Remaining balance after advance
}

// Customer data moved to customerMockData.ts - import from there for customer-related functionality



export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  branch: string;
}

export interface ProformaItem {
  description: string;
  fabricType: string;
  gsm: number;
  width: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Duplicate ProformaInvoice interface removed - using the one defined above






// Duplicate AdvancePayment interface removed - using the one defined earlier

// Final GST Invoices - Module 10: Post-delivery billing
export interface FinalInvoice {
  id: string;
  salesOrderId: string;
  businessProfileId: string; // Updated to use unified businessProfileId
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  advanceAdjusted: number;
  balanceAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  paymentReceivedDate?: string;
  notes: string;
}

// Final Payment Records - Module 10: Payment closure tracking
export interface FinalPayment {
  id: string;
  finalInvoiceId: string;
  businessProfileId: string; // Updated to use unified businessProfileId
  amount: number;
  paymentDate: string;
  paymentMethod: 'RTGS' | 'NEFT' | 'Cash' | 'Cheque' | 'UPI';
  transactionReference: string;
  status: 'received' | 'verified' | 'reconciled';
  notes: string;
}

// Customer Feedback and Loyalty interfaces moved to customerMockData.ts

// Mock Data
// mockBusinessProfiles moved to customerMockData.ts - import from there for customer data

export const mockLeads: Lead[] = [
  // ACTIVE LEADS - Currently in lead management process (no BusinessProfile yet)
  {
    id: 'lead-001',
    companyName: 'Mumbai Cotton Mills',
    location: 'Mumbai',
    business: 'Cotton fabric manufacturing, 300+ employees',
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
    companyName: 'Surat Fashion House',
    location: 'Surat',
    business: 'Fashion garments, mid-scale operation',
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
    companyName: 'Gujarat Garments',
    location: 'Surat',
    business: 'Garment Manufacturing & Trading',
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
    lastContact: 'Converted to customer on March 15, 2025',
    notes: 'Successfully converted to customer. First order completed successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'March 15, 2025'
  },
  {
    id: 'baroda-004',
    businessProfileId: 'bp-baroda-fashion',
    companyName: 'Baroda Fashion House',
    location: 'Vadodara',
    business: 'Fashion House & Seasonal Collections',
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
    lastContact: 'Converted to customer on April 02, 2025',
    notes: 'Excellent payment behavior - completed first order successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'April 02, 2025'
  },
  {
    id: 'lead-003',
    companyName: 'Baroda Textiles Co',
    contactPerson: 'Ashok Shah',
    location: 'Vadodara',
    contact: '+91 97654 33333 | ashok@barodatextiles.com',
    business: 'Textile trading company, 50+ employees',
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
    companyName: 'Rajesh Textiles',
    contactPerson: 'Rajesh Shah', 
    location: 'Ahmedabad',
    contact: '+91 98765 43210 | rajesh@rateshtextiles.com',
    business: 'Cotton fabric manufacturing, 500+ employees',
    inquiry: 'High-grade cotton fabric for export - 10,000 yards',
    budget: '₹18-22 lakhs',
    timeline: '30 days',
    lastContact: 'Today 2:30 PM - "Will pay advance by tomorrow"',
    priority: 'hot',
    notes: 'Quote approved. Proforma invoice sent. Advance payment expected tomorrow.',
    conversionStatus: 'proforma_sent'
  },
  // CONVERTED LEADS - Examples of successful conversions
  {
    id: 'lead-005',
    companyName: 'Gujarat Fabrics Ltd',
    contactPerson: 'Kiran Desai',
    location: 'Ahmedabad', 
    contact: '+91 98765 55555 | kiran@gujaratfabrics.com',
    business: 'Premium fabric manufacturing, 800+ employees',
    inquiry: 'Premium cotton blend - 8,000 yards',
    budget: '₹15-18 lakhs',
    timeline: '25 days',
    lastContact: 'Converted to customer on March 31, 2025',
    priority: 'hot',
    notes: 'Successfully converted to customer. First order completed successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'March 31, 2025',
    businessProfileId: 'bp-gujarat-garments'
  }
];

export const mockQuotes: Quote[] = [
  // Quotes for active leads (no BusinessProfile yet)
  {
    id: 'QT-001',
    leadId: 'lead-001',
    companyName: 'Mumbai Cotton Mills',
    location: 'Mumbai',
    quoteDate: 'March 15, 2025',
    validUntil: 'March 30, 2025',
    items: 'Industrial cotton fabric - 8,000 yards @ ₹185/yard',
    totalAmount: 1480000,
    status: 'under_review',
    statusMessage: 'Customer is reviewing quote - Expecting response by end of week',
    advancePaymentRequired: 740000, // 50% advance
    advancePaymentStatus: 'not_requested'
  },
  {
    id: 'QT-002',
    leadId: 'lead-002',
    companyName: 'Surat Fashion House',
    location: 'Surat',
    quoteDate: 'March 18, 2025',
    validUntil: 'April 5, 2025',
    items: 'Mixed fabric for seasonal wear - 6,000 yards @ ₹220/yard',
    totalAmount: 1320000,
    status: 'proforma_sent',
    statusMessage: 'Proforma invoice sent - Advance payment requested',
    advancePaymentRequired: 660000, // 50% advance
    advancePaymentStatus: 'awaiting'
  },
  // Quotes for converted customers (linked to BusinessProfile)
  {
    id: 'QT-GJ-002',
    leadId: 'gujarat-002',
    businessProfileId: 'bp-gujarat-garments',
    companyName: 'Gujarat Garments',
    location: 'Surat',
    quoteDate: 'March 10, 2025',
    validUntil: 'March 25, 2025',
    items: 'Export quality cotton fabric - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'order_created',
    statusMessage: 'Order created successfully - Quote completed',
    approvalDate: 'March 12, 2025',
    proformaInvoiceId: 'PI-GJ-002',
    advancePaymentRequired: 487500, // 50% advance
    advancePaymentStatus: 'received' // This triggered customer creation
  },
  {
    id: 'QT-BR-004',
    leadId: 'baroda-004',
    businessProfileId: 'bp-baroda-fashion',
    companyName: 'Baroda Fashion House',
    location: 'Vadodara',
    quoteDate: 'March 28, 2025',
    validUntil: 'April 15, 2025',
    items: 'Premium fashion fabric - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'approved',
    statusMessage: 'Quote approved - Advance payment received, customer created',
    approvalDate: 'March 30, 2025',
    proformaInvoiceId: 'PI-BR-004',
    advancePaymentRequired: 367500, // 50% advance
    advancePaymentStatus: 'received' // This triggered customer creation
  },
  {
    id: 'QT-GUJ-001',
    leadId: 'gujarat-002',
    businessProfileId: 'bp-gujarat-garments',
    companyName: 'Gujarat Garments',
    location: 'Surat',
    quoteDate: 'March 10, 2025',
    validUntil: 'March 25, 2025',
    items: 'Mixed fabric for casual wear - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'approved',
    statusMessage: 'Quote approved - Advance payment received, auto-converting to customer',
    proformaInvoiceId: 'PI-002',
    advancePaymentRequired: 487500, // 50% advance
    advancePaymentStatus: 'received' // This triggered customer conversion
  },
  {
    id: 'QT-002B',
    leadId: 'gujarat-002',
    companyName: 'Gujarat Garments',
    location: 'Surat',
    quoteDate: 'March 12, 2025',
    validUntil: 'March 30, 2025',
    items: 'Budget fabric option - 6,000 yards @ ₹165/yard',
    totalAmount: 990000,
    status: 'rejected',
    statusMessage: 'Lead rejected budget option, went with main quote QT-002',
    proformaInvoiceId: undefined,
    advancePaymentRequired: 495000, // 50% advance
    advancePaymentStatus: 'not_requested'
  },
  {
    id: 'QT-003',
    leadId: 'baroda-003',
    companyName: 'Baroda Fashion House',
    location: 'Vadodara',
    quoteDate: 'February 20, 2025',
    validUntil: 'March 5, 2025',
    items: 'Seasonal fabric collection - 3,000 yards @ ₹220/yard',
    totalAmount: 660000,
    status: 'expired',
    statusMessage: 'Quote expired - Lead requested extension, new quote being prepared',
    proformaInvoiceId: 'PI-003',
    advancePaymentRequired: 330000, // 50% advance
    advancePaymentStatus: 'overdue'
  },
  {
    id: 'QT-004',
    leadId: 'baroda-003',
    companyName: 'Baroda Fashion House',
    location: 'Vadodara',
    quoteDate: 'March 8, 2025',
    validUntil: 'March 25, 2025',
    items: 'Updated seasonal collection - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'approved',
    statusMessage: 'New quote approved - Advance payment received, converting to customer',
    proformaInvoiceId: 'PI-004',
    advancePaymentRequired: 367500, // 50% advance
    advancePaymentStatus: 'received' // This triggered customer conversion
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
    items: 'Premium Cotton Fabric - 1,500 meters @ ₹185/meter',
    totalAmount: 277500,
    status: 'order_confirmed' as const,
    statusMessage: 'Advance payment received - Ready for production planning',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Materials reserved - Ready to start',
    balancePaymentDue: 194250
  },
  // SO-002: Order with mixed materials (some available, some shortage)
  {
    id: 'SO-002',
    quoteId: 'QT-GUJ-001',
    businessProfileId: 'bp-gujarat-garments',
    advancePaymentId: 'ADV-QT-002-001',
    orderDate: 'October 20, 2025',
    deliveryDate: 'November 20, 2025',
    items: 'Mixed fabric for casual wear - 2,500 meters @ ₹195/meter',
    totalAmount: 487500,
    status: 'pending_materials' as const,
    statusMessage: 'Material shortage - Procurement in progress',
    paymentStatus: 'advance_received' as const,
    productionStatus: 'Waiting for material availability',
    balancePaymentDue: 341250
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
    balancePaymentDue: 231000
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
    balancePaymentDue: 0
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
    balancePaymentDue: 367500
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
    balancePaymentDue: 292600
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
    leadId: 'L-001',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'October 10, 2025',
    dueDate: 'October 25, 2025',  // Future: 8 days from today (pending)
    subtotal: 1850000,
    gstAmount: 92500,
    totalAmount: 1942500,
    advanceAmount: 971250,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: 'Please pay 50% advance (₹9,71,250) within 15 days to confirm order'
  },
  {
    id: 'PI-2025-002',
    quoteId: 'QT-004',
    leadId: 'L-004', 
    businessProfileId: 'bp-baroda-fashion',
    issueDate: 'October 12, 2025',
    dueDate: 'October 27, 2025',  // Future: 10 days from today (pending)
    subtotal: 825000,
    gstAmount: 41250,
    totalAmount: 866250,
    advanceAmount: 259875,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: '30% advance payment (₹2,59,875) required for new customer'
  },
  {
    id: 'PI-2025-003',
    quoteId: 'QT-005',
    leadId: 'L-005',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'October 8, 2025',
    dueDate: 'October 23, 2025',  // Future: 6 days from today (pending)
    subtotal: 9175000,
    gstAmount: 458750,
    totalAmount: 9633750,
    advanceAmount: 3853500,
    bankDetails: companyBankDetails,
    status: 'pending',
    paymentInstructions: '40% advance payment (₹38,53,500) required for export orders with LC/Bank guarantee'
  },
  {
    id: 'PI-2025-004',
    quoteId: 'QT-003',
    leadId: 'L-003',
    businessProfileId: 'bp-baroda-fashion',
    issueDate: 'September 28, 2025',
    dueDate: 'October 8, 2025',  // Past: 9 days ago (expired - overdue proforma)
    subtotal: 650000,
    gstAmount: 32500,
    totalAmount: 682500,
    advanceAmount: 204750,
    bankDetails: companyBankDetails,
    status: 'expired',
    paymentInstructions: '30% advance payment (₹2,04,750) required - payment overdue, order may be cancelled'
  },
  {
    id: 'PI-2025-005',
    quoteId: 'QT-002',
    leadId: 'L-002',
    businessProfileId: 'bp-gujarat-garments',
    issueDate: 'September 30, 2025',
    dueDate: 'October 12, 2025',  // Past: 5 days ago (payment received)
    subtotal: 1200000,
    gstAmount: 60000,
    totalAmount: 1260000,
    advanceAmount: 630000,
    bankDetails: companyBankDetails,
    status: 'payment_received',
    paymentInstructions: '50% advance payment (₹6,30,000) received on October 10, 2025 - order confirmed'
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
    quoteId: 'QT-001',
    leadId: 'L-001',
    businessProfileId: 'bp-gujarat-garments',
    amount: 971250,
    dueDate: 'April 2, 2025',
    status: 'received',
    receivedDate: 'March 19, 2025',
    receivedAmount: 971250,
    bankReference: 'HDFC240319RT12345',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2025-002',
    proformaInvoiceId: 'PI-2025-002',
    quoteId: 'QT-004',
    leadId: 'L-004',
    businessProfileId: 'bp-baroda-fashion',
    amount: 259875,
    dueDate: 'April 10, 2025',
    status: 'received',
    receivedDate: 'March 28, 2025',
    receivedAmount: 259875,
    bankReference: 'SBI240328NF67890',
    paymentMethod: 'NEFT'
  },
  {
    id: 'AP-2025-003',
    proformaInvoiceId: 'PI-2025-003',
    quoteId: 'QT-005',
    leadId: 'L-005',
    businessProfileId: 'bp-gujarat-garments',
    amount: 3853500,
    dueDate: 'April 15, 2025',
    status: 'pending',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2025-004',
    proformaInvoiceId: 'PI-2025-004',
    quoteId: 'QT-006',
    leadId: 'L-006',
    businessProfileId: 'bp-baroda-fashion',
    amount: 750000,
    dueDate: 'April 20, 2025',
    status: 'received',
    receivedDate: 'March 31, 2025',
    receivedAmount: 750000,
    bankReference: 'ICICI240331RT13579',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2025-005',
    proformaInvoiceId: 'PI-2025-005',
    quoteId: 'QT-002',
    leadId: 'L-002',
    businessProfileId: 'bp-gujarat-garments',
    amount: 630000,
    dueDate: 'October 12, 2025',
    status: 'received',
    receivedDate: 'October 10, 2025',
    receivedAmount: 630000,
    bankReference: 'HDFC251010RT24681',
    paymentMethod: 'RTGS'
  }
];

// Final GST Invoices Data - Post-delivery billing
export const mockFinalInvoices: FinalInvoice[] = [
  {
    id: 'INV-2025-001',
    salesOrderId: 'SO-004',
    businessProfileId: 'bp-baroda-fashion',
    invoiceDate: 'September 28, 2025',
    dueDate: 'October 13, 2025',  // Past: 4 days ago (paid early)
    subtotal: 1500000,
    gstRate: 5,
    gstAmount: 75000,
    totalAmount: 1575000,
    advanceAdjusted: 750000,
    balanceAmount: 825000,
    status: 'paid',
    paymentReceivedDate: 'October 10, 2025',  // Paid 3 days before due date
    notes: 'Premium customer - paid before due date. Excellent relationship.'
  },
  {
    id: 'INV-2025-002',
    salesOrderId: 'SO-002',
    businessProfileId: 'bp-gujarat-garments',
    invoiceDate: 'September 25, 2025',
    dueDate: 'October 10, 2025',  // Past: 7 days ago (paid early)
    subtotal: 1100000,
    gstRate: 5,
    gstAmount: 55000,
    totalAmount: 1155000,
    advanceAdjusted: 550000,
    balanceAmount: 605000,
    status: 'paid',
    paymentReceivedDate: 'October 8, 2025',  // Paid 2 days before due date
    notes: 'Regular customer - standard payment terms honored.'
  },
  {
    id: 'INV-2025-003',
    salesOrderId: 'SO-001',
    businessProfileId: 'bp-gujarat-garments',
    invoiceDate: 'September 20, 2025',
    dueDate: 'October 10, 2025',  // Past: 7 days ago (overdue)
    subtotal: 1850000,
    gstRate: 5,
    gstAmount: 92500,
    totalAmount: 1942500,
    advanceAdjusted: 971250,
    balanceAmount: 971250,
    status: 'overdue',
    notes: 'Balance payment overdue by 7 days. Follow-up required.'
  },
  {
    id: 'INV-2025-004',
    salesOrderId: 'SO-003',
    businessProfileId: 'bp-baroda-fashion',
    invoiceDate: 'October 5, 2025',
    dueDate: 'October 30, 2025',  // Future: 13 days from today (pending)
    subtotal: 825000,
    gstRate: 5,
    gstAmount: 41250,
    totalAmount: 866250,
    advanceAdjusted: 259875,
    balanceAmount: 606375,
    status: 'pending',
    notes: 'New customer - first invoice. Payment terms: 15 days.'
  }
];

// Final Payment Records Data - Payment closure tracking
export const mockFinalPayments: FinalPayment[] = [
  {
    id: 'FP-2025-001',
    finalInvoiceId: 'INV-2025-001',
    businessProfileId: 'bp-baroda-fashion',
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
    businessProfileId: 'bp-gujarat-garments',
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

export const getAdvancePaymentsByCustomerId = (customerId: string): AdvancePayment[] => {
  return mockAdvancePayments.filter(ap => ap.businessProfileId === customerId);
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

