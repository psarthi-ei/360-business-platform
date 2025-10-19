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

export interface Communication {
  date: string;
  time: string;
  type: string;
  message: string;
}


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

export interface FabricSpecification {
  type: string;
  category: 'Cotton' | 'Synthetic' | 'Silk' | 'Traditional' | 'Blended';
  gsm: number;
  width: string;
  composition: string;
  finish: string;
  pricePerYard: number;
  minimumOrder: number;
  leadTime: string;
}

// Work Order System - Module 5: Production authorization from sales orders
export interface WorkOrder {
  id: string;
  salesOrderId: string;
  businessProfileId: string; // Updated to use unified businessProfileId
  fabricType: string;
  quantity: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: 'pending' | 'materials_allocated' | 'in_progress' | 'completed';
  statusMessage: string;
  materialRequirements: string[];
  priority: 'low' | 'medium' | 'high';
  assignedOperator: string;
  notes: string;
}

// Vendor/Supplier System - Module 6: Raw material procurement
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  gstNumber: string;
  materials: string[];
  paymentTerms: string;
  creditLimit: number;
  rating: number; // 1-5 stars
  isActive: boolean;
  notes: string;
}

// Raw Material Inventory - Module 7: Three-tier inventory management
export interface RawMaterial {
  id: string;
  name: string;
  category: 'Yarn' | 'Dye' | 'Chemical' | 'Packaging';
  currentStock: number;
  unit: string;
  reorderLevel: number;
  maxStockLevel: number;
  pricePerUnit: number;
  vendorId: string;
  lastUpdated: string;
  location: string;
}

// Production Records - Module 8: Daily production tracking with quality
export interface ProductionRecord {
  id: string;
  workOrderId: string;
  date: string;
  shift: 'Morning' | 'Evening' | 'Night';
  operator: string;
  machine: string;
  quantityProduced: number;
  qualityGradeA: number;
  qualityGradeB: number;
  rejectedQuantity: number;
  notes: string;
  efficiency: number; // percentage
}

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
    lastContact: 'Converted to customer on March 15, 2024',
    notes: 'Successfully converted to customer. First order completed successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'March 15, 2024'
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
    lastContact: 'Converted to customer on April 02, 2024',
    notes: 'Excellent payment behavior - completed first order successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'April 02, 2024'
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
    lastContact: 'Converted to customer on March 31, 2024',
    priority: 'hot',
    notes: 'Successfully converted to customer. First order completed successfully.',
    conversionStatus: 'converted_to_customer',
    convertedToCustomerDate: 'March 31, 2024',
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
    quoteDate: 'March 15, 2024',
    validUntil: 'March 30, 2024',
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
    quoteDate: 'March 18, 2024',
    validUntil: 'April 5, 2024',
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
    quoteDate: 'March 10, 2024',
    validUntil: 'March 25, 2024',
    items: 'Export quality cotton fabric - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'order_created',
    statusMessage: 'Order created successfully - Quote completed',
    approvalDate: 'March 12, 2024',
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
    quoteDate: 'March 28, 2024',
    validUntil: 'April 15, 2024',
    items: 'Premium fashion fabric - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'approved',
    statusMessage: 'Quote approved - Advance payment received, customer created',
    approvalDate: 'March 30, 2024',
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
    quoteDate: 'March 10, 2024',
    validUntil: 'March 25, 2024',
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
    quoteDate: 'March 12, 2024',
    validUntil: 'March 30, 2024',
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
    quoteDate: 'February 20, 2024',
    validUntil: 'March 5, 2024',
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
    quoteDate: 'March 8, 2024',
    validUntil: 'March 25, 2024',
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
  // SO-002: Created when QT-002 advance payment was received, triggering customer conversion
  {
    id: 'SO-002',
    quoteId: 'QT-GUJ-001',
    businessProfileId: 'bp-gujarat-garments',
    advancePaymentId: 'ADV-QT-002-001',
    orderDate: 'March 15, 2024',
    deliveryDate: 'April 10, 2024',
    items: 'Mixed fabric for casual wear - 5,000 yards @ ₹195/yard',
    totalAmount: 975000,
    status: 'ready_to_ship' as const,
    statusMessage: 'Production completed - Ready for dispatch to customer',
    paymentStatus: 'partial' as const,
    productionStatus: 'In production - 60% completed',
    balancePaymentDue: 487500
  },
  // SO-004: Created when QT-004 advance payment was received, triggering customer conversion
  {
    id: 'SO-004',
    quoteId: 'QT-004',
    businessProfileId: 'bp-baroda-fashion',
    advancePaymentId: 'ADV-QT-004-001',
    orderDate: 'March 10, 2024',
    deliveryDate: 'April 5, 2024',
    items: 'Updated seasonal collection - 3,500 yards @ ₹210/yard',
    totalAmount: 735000,
    status: 'completed' as const,
    statusMessage: 'Auto-created after advance payment - Order completed successfully',
    paymentStatus: 'completed' as const,
    productionStatus: 'Completed and delivered',
    balancePaymentDue: 0
  }
];

// Customer data moved to customerMockData.ts

export const mockCommunications: Communication[] = [
  {
    date: 'March 22, 2024',
    time: '2:30 PM',
    type: '📱 WhatsApp Message',
    message: 'Payment reminder sent: "Dear Rajesh ji, your advance payment of ₹9,25,000 for order SO-001 is pending. Please complete payment to start production. Bank details: HDFC Bank A/c: 1234567890"'
  },
  {
    date: 'March 20, 2024',
    time: '11:00 AM',
    type: '📞 Phone Call',
    message: 'Order confirmation call: Discussed delivery timeline, payment terms, and quality specifications. Customer confirmed order and requested fabric sample for final approval.'
  },
  {
    date: 'March 15, 2024',
    time: '4:15 PM',
    type: '💬 WhatsApp Business',
    message: 'Quote sent and approved: "Thank you for the quick quote! The quality looks perfect. Please convert this to order. We\'ll arrange payment within 2 days."'
  }
];

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
    id: 'PI-2024-001',
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
    id: 'PI-2024-002',
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
    id: 'PI-2024-003',
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
    id: 'PI-2024-004',
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
    id: 'PI-2024-005',
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
export const mockFabricSpecifications: FabricSpecification[] = [
  {
    type: 'High-Grade Cotton',
    category: 'Cotton',
    gsm: 180,
    width: '44 inches',
    composition: '100% Cotton',
    finish: 'Mercerized',
    pricePerYard: 185,
    minimumOrder: 1000,
    leadTime: '15-20 days'
  },
  {
    type: 'Art Silk Premium',
    category: 'Synthetic',
    gsm: 120,
    width: '44 inches',
    composition: '100% Viscose',
    finish: 'Lustrous',
    pricePerYard: 225,
    minimumOrder: 500,
    leadTime: '12-15 days'
  },
  {
    type: 'Traditional Bandhani Base',
    category: 'Traditional',
    gsm: 140,
    width: '36 inches',
    composition: '100% Cotton',
    finish: 'Soft finish',
    pricePerYard: 165,
    minimumOrder: 200,
    leadTime: '20-25 days'
  },
  {
    type: 'Polyester Georgette',
    category: 'Synthetic',
    gsm: 60,
    width: '44 inches',
    composition: '100% Polyester',
    finish: 'Crinkle texture',
    pricePerYard: 145,
    minimumOrder: 300,
    leadTime: '10-12 days'
  },
  {
    type: 'Canvas Industrial',
    category: 'Cotton',
    gsm: 220,
    width: '58 inches',
    composition: '100% Cotton',
    finish: 'Heavy duty',
    pricePerYard: 165,
    minimumOrder: 2000,
    leadTime: '18-22 days'
  },
  {
    type: 'Kutch Handloom',
    category: 'Traditional',
    gsm: 160,
    width: '36 inches',
    composition: '100% Cotton',
    finish: 'Handwoven texture',
    pricePerYard: 280,
    minimumOrder: 100,
    leadTime: '25-30 days'
  },
  {
    type: 'Export Cotton Premium',
    category: 'Cotton',
    gsm: 150,
    width: '44 inches',
    composition: '100% Organic Cotton',
    finish: 'Export grade',
    pricePerYard: 220,
    minimumOrder: 5000,
    leadTime: '20-25 days'
  }
];

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

// getLeadsByCustomerId moved to customerMockData.ts

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

// Fabric Specification Functions
export const getFabricSpecByType = (type: string): FabricSpecification | undefined => {
  return mockFabricSpecifications.find(spec => spec.type === type);
};

export const getFabricsByCategory = (category: 'Cotton' | 'Synthetic' | 'Silk' | 'Traditional' | 'Blended'): FabricSpecification[] => {
  return mockFabricSpecifications.filter(spec => spec.category === category);
};

export const getFabricsByGSMRange = (minGSM: number, maxGSM: number): FabricSpecification[] => {
  return mockFabricSpecifications.filter(spec => spec.gsm >= minGSM && spec.gsm <= maxGSM);
};

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
export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-2024-001',
    salesOrderId: 'SO-001',
    businessProfileId: 'bp-gujarat-garments',
    fabricType: 'High-grade Export Cotton Fabric',
    quantity: 10000,
    unit: 'yards',
    startDate: 'March 20, 2024',
    targetDate: 'April 15, 2024',
    status: 'in_progress',
    statusMessage: 'Production started - 60% completed',
    materialRequirements: ['Cotton Yarn 40s - 1200kg', 'Reactive Blue Dye - 25kg', 'Finishing Chemicals - 15kg'],
    priority: 'high',
    assignedOperator: 'Ramesh Patel',
    notes: 'Export quality - zero defect tolerance. Customer sample approved.'
  },
  {
    id: 'WO-2024-002',
    salesOrderId: 'SO-002',
    businessProfileId: 'bp-gujarat-garments',
    fabricType: 'Standard Cotton Fabric',
    quantity: 5000,
    unit: 'yards',
    startDate: 'March 25, 2024',
    targetDate: 'April 10, 2024',
    status: 'materials_allocated',
    statusMessage: 'Materials allocated - ready to start production',
    materialRequirements: ['Cotton Yarn 30s - 600kg', 'Direct Red Dye - 12kg', 'Softener - 8kg'],
    priority: 'medium',
    assignedOperator: 'Suresh Shah',
    notes: 'Standard quality for domestic market. Regular customer.'
  },
  {
    id: 'WO-2024-003',
    salesOrderId: 'SO-003',
    businessProfileId: 'bp-baroda-fashion',
    fabricType: 'Industrial Cotton Canvas',
    quantity: 5000,
    unit: 'yards',
    startDate: 'March 30, 2024',
    targetDate: 'April 20, 2024',
    status: 'pending',
    statusMessage: 'Waiting for advance payment confirmation',
    materialRequirements: ['Cotton Yarn 20s - 800kg', 'Khaki Dye - 18kg', 'Starch - 20kg'],
    priority: 'medium',
    assignedOperator: 'Dinesh Kumar',
    notes: 'New customer - first order. Quality inspection welcome.'
  },
  {
    id: 'WO-2024-004',
    salesOrderId: 'SO-004',
    businessProfileId: 'bp-baroda-fashion',
    fabricType: 'Premium Cotton Blend',
    quantity: 8000,
    unit: 'yards',
    startDate: 'April 1, 2024',
    targetDate: 'April 25, 2024',
    status: 'completed',
    statusMessage: 'Production completed - quality approved',
    materialRequirements: ['Cotton Yarn 40s - 700kg', 'Polyester Yarn - 200kg', 'Navy Blue Dye - 22kg'],
    priority: 'high',
    assignedOperator: 'Mahesh Desai',
    notes: 'Premium customer - repeat order. Customer satisfied with quality.'
  },
  {
    id: 'WO-2024-005',
    salesOrderId: 'SO-005',
    businessProfileId: 'bp-gujarat-garments',
    fabricType: 'Cotton-Silk Blend Fabric',
    quantity: 3000,
    unit: 'yards',
    startDate: 'April 5, 2024',
    targetDate: 'April 30, 2024',
    status: 'pending',
    statusMessage: 'Quote approved - awaiting work order confirmation',
    materialRequirements: ['Cotton Yarn 60s - 300kg', 'Silk Yarn - 100kg', 'Golden Yellow Dye - 10kg'],
    priority: 'medium',
    assignedOperator: 'Kiran Joshi',
    notes: 'Luxury blend fabric for premium market segment.'
  }
];

// Vendors Data - Gujarat textile suppliers for raw material procurement
export const mockVendors: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'Surat Yarn Suppliers',
    contactPerson: 'Prakash Patel',
    phone: '+91 98765 12345',
    email: 'prakash@suratyarn.com',
    location: 'Surat, Gujarat',
    gstNumber: '24ABCDE1234F1Z5',
    materials: ['Cotton Yarn 20s', 'Cotton Yarn 30s', 'Cotton Yarn 40s', 'Cotton Yarn 60s'],
    paymentTerms: '30 days credit',
    creditLimit: 500000,
    rating: 4.5,
    isActive: true,
    notes: 'Reliable supplier since 2020. Consistent quality and timely delivery.'
  },
  {
    id: 'vendor-002',
    name: 'Gujarat Chemical Industries',
    contactPerson: 'Nilesh Shah',
    phone: '+91 98765 67890',
    email: 'nilesh@gujaratchem.com',
    location: 'Ahmedabad, Gujarat',
    gstNumber: '24FGHIJ5678K2Z5',
    materials: ['Reactive Blue Dye', 'Direct Red Dye', 'Khaki Dye', 'Navy Blue Dye', 'Golden Yellow Dye'],
    paymentTerms: '15 days credit',
    creditLimit: 300000,
    rating: 4.2,
    isActive: true,
    notes: 'Quality dye manufacturer. Good for export quality requirements.'
  },
  {
    id: 'vendor-003',
    name: 'Vadodara Chemicals Ltd',
    contactPerson: 'Ravi Kumar',
    phone: '+91 98765 54321',
    email: 'ravi@vadodarachem.com',
    location: 'Vadodara, Gujarat',
    gstNumber: '24LMNOP9012Q3Z5',
    materials: ['Finishing Chemicals', 'Softener', 'Starch', 'Bleaching Powder', 'Caustic Soda'],
    paymentTerms: '20 days credit',
    creditLimit: 200000,
    rating: 4.0,
    isActive: true,
    notes: 'Finishing chemicals specialist. Competitive pricing for bulk orders.'
  },
  {
    id: 'vendor-004',
    name: 'Rajkot Packaging Solutions',
    contactPerson: 'Amit Joshi',
    phone: '+91 98765 98765',
    email: 'amit@rajkotpack.com',
    location: 'Rajkot, Gujarat',
    gstNumber: '24RSTUV3456W4Z5',
    materials: ['Packaging Bags', 'Labels', 'Tags', 'Cartons', 'Plastic Covers'],
    paymentTerms: '7 days credit',
    creditLimit: 100000,
    rating: 4.3,
    isActive: true,
    notes: 'Quality packaging materials. Quick turnaround for urgent requirements.'
  }
];

// Raw Material Inventory Data - Three-tier inventory management
export const mockRawMaterials: RawMaterial[] = [
  {
    id: 'rm-001',
    name: 'Cotton Yarn 20s',
    category: 'Yarn',
    currentStock: 2500,
    unit: 'kg',
    reorderLevel: 500,
    maxStockLevel: 5000,
    pricePerUnit: 280,
    vendorId: 'vendor-001',
    lastUpdated: 'April 8, 2024',
    location: 'Warehouse A - Section 1'
  },
  {
    id: 'rm-002',
    name: 'Cotton Yarn 30s',
    category: 'Yarn',
    currentStock: 1800,
    unit: 'kg',
    reorderLevel: 400,
    maxStockLevel: 3000,
    pricePerUnit: 320,
    vendorId: 'vendor-001',
    lastUpdated: 'April 8, 2024',
    location: 'Warehouse A - Section 2'
  },
  {
    id: 'rm-003',
    name: 'Cotton Yarn 40s',
    category: 'Yarn',
    currentStock: 950,
    unit: 'kg',
    reorderLevel: 300,
    maxStockLevel: 2000,
    pricePerUnit: 380,
    vendorId: 'vendor-001',
    lastUpdated: 'April 8, 2024',
    location: 'Warehouse A - Section 3'
  },
  {
    id: 'rm-004',
    name: 'Reactive Blue Dye',
    category: 'Dye',
    currentStock: 150,
    unit: 'kg',
    reorderLevel: 30,
    maxStockLevel: 300,
    pricePerUnit: 850,
    vendorId: 'vendor-002',
    lastUpdated: 'April 7, 2024',
    location: 'Chemical Storage - Section A'
  },
  {
    id: 'rm-005',
    name: 'Direct Red Dye',
    category: 'Dye',
    currentStock: 120,
    unit: 'kg',
    reorderLevel: 25,
    maxStockLevel: 250,
    pricePerUnit: 780,
    vendorId: 'vendor-002',
    lastUpdated: 'April 7, 2024',
    location: 'Chemical Storage - Section B'
  },
  {
    id: 'rm-006',
    name: 'Finishing Chemicals',
    category: 'Chemical',
    currentStock: 200,
    unit: 'kg',
    reorderLevel: 50,
    maxStockLevel: 400,
    pricePerUnit: 450,
    vendorId: 'vendor-003',
    lastUpdated: 'April 6, 2024',
    location: 'Chemical Storage - Section C'
  },
  {
    id: 'rm-007',
    name: 'Packaging Bags',
    category: 'Packaging',
    currentStock: 5000,
    unit: 'pieces',
    reorderLevel: 1000,
    maxStockLevel: 10000,
    pricePerUnit: 12,
    vendorId: 'vendor-004',
    lastUpdated: 'April 5, 2024',
    location: 'Packaging Store'
  },
  {
    id: 'rm-008',
    name: 'Cotton Yarn 60s',
    category: 'Yarn',
    currentStock: 500,
    unit: 'kg',
    reorderLevel: 100,
    maxStockLevel: 1000,
    pricePerUnit: 450,
    vendorId: 'vendor-001',
    lastUpdated: 'April 8, 2024',
    location: 'Warehouse A - Section 4'
  }
];

// Production Records Data - Daily production tracking with quality
export const mockProductionRecords: ProductionRecord[] = [
  {
    id: 'PR-2024-001',
    workOrderId: 'WO-2024-001',
    date: 'April 8, 2024',
    shift: 'Morning',
    operator: 'Ramesh Patel',
    machine: 'Loom-A1',
    quantityProduced: 800,
    qualityGradeA: 720,
    qualityGradeB: 70,
    rejectedQuantity: 10,
    notes: 'Good production day. Minor thread breaks resolved quickly.',
    efficiency: 90
  },
  {
    id: 'PR-2024-002',
    workOrderId: 'WO-2024-001',
    date: 'April 7, 2024',
    shift: 'Morning',
    operator: 'Ramesh Patel',
    machine: 'Loom-A1',
    quantityProduced: 750,
    qualityGradeA: 650,
    qualityGradeB: 85,
    rejectedQuantity: 15,
    notes: 'Some dye variation in morning batch. Adjusted recipe.',
    efficiency: 85
  },
  {
    id: 'PR-2024-003',
    workOrderId: 'WO-2024-002',
    date: 'April 6, 2024',
    shift: 'Evening',
    operator: 'Suresh Shah',
    machine: 'Loom-B2',
    quantityProduced: 600,
    qualityGradeA: 570,
    qualityGradeB: 25,
    rejectedQuantity: 5,
    notes: 'Smooth production. Standard domestic quality achieved.',
    efficiency: 95
  },
  {
    id: 'PR-2024-004',
    workOrderId: 'WO-2024-004',
    date: 'April 5, 2024',
    shift: 'Morning',
    operator: 'Mahesh Desai',
    machine: 'Loom-C3',
    quantityProduced: 900,
    qualityGradeA: 855,
    qualityGradeB: 40,
    rejectedQuantity: 5,
    notes: 'Excellent production. Premium customer quality standards met.',
    efficiency: 92
  },
  {
    id: 'PR-2024-005',
    workOrderId: 'WO-2024-004',
    date: 'April 4, 2024',
    shift: 'Evening',
    operator: 'Mahesh Desai',
    machine: 'Loom-C3',
    quantityProduced: 850,
    qualityGradeA: 800,
    qualityGradeB: 45,
    rejectedQuantity: 5,
    notes: 'Consistent quality maintained. Customer sample approved.',
    efficiency: 88
  }
];

// Advance Payment Records Data - Actual payments against proforma invoices
export const mockAdvancePayments: AdvancePayment[] = [
  {
    id: 'AP-2024-001',
    proformaInvoiceId: 'PI-2024-001',
    quoteId: 'QT-001',
    leadId: 'L-001',
    businessProfileId: 'bp-gujarat-garments',
    amount: 971250,
    dueDate: 'April 2, 2024',
    status: 'received',
    receivedDate: 'March 19, 2024',
    receivedAmount: 971250,
    bankReference: 'HDFC240319RT12345',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2024-002',
    proformaInvoiceId: 'PI-2024-002',
    quoteId: 'QT-004',
    leadId: 'L-004',
    businessProfileId: 'bp-baroda-fashion',
    amount: 259875,
    dueDate: 'April 10, 2024',
    status: 'received',
    receivedDate: 'March 28, 2024',
    receivedAmount: 259875,
    bankReference: 'SBI240328NF67890',
    paymentMethod: 'NEFT'
  },
  {
    id: 'AP-2024-003',
    proformaInvoiceId: 'PI-2024-003',
    quoteId: 'QT-005',
    leadId: 'L-005',
    businessProfileId: 'bp-gujarat-garments',
    amount: 3853500,
    dueDate: 'April 15, 2024',
    status: 'pending',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2024-004',
    proformaInvoiceId: 'PI-2024-004',
    quoteId: 'QT-006',
    leadId: 'L-006',
    businessProfileId: 'bp-baroda-fashion',
    amount: 750000,
    dueDate: 'April 20, 2024',
    status: 'received',
    receivedDate: 'March 31, 2024',
    receivedAmount: 750000,
    bankReference: 'ICICI240331RT13579',
    paymentMethod: 'RTGS'
  },
  {
    id: 'AP-2024-005',
    proformaInvoiceId: 'PI-2024-005',
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
    id: 'INV-2024-001',
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
    id: 'INV-2024-002',
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
    id: 'INV-2024-003',
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
    id: 'INV-2024-004',
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
    id: 'FP-2024-001',
    finalInvoiceId: 'INV-2024-001',
    businessProfileId: 'bp-baroda-fashion',
    amount: 825000,
    paymentDate: 'October 10, 2025',  // Matches paymentReceivedDate in invoice
    paymentMethod: 'RTGS',
    transactionReference: 'ICICI251010RT97531',
    status: 'reconciled',
    notes: 'Final payment received on time. Order closed successfully.'
  },
  {
    id: 'FP-2024-002',
    finalInvoiceId: 'INV-2024-002',
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

// Work Order Management Functions
export const getWorkOrderById = (id: string): WorkOrder | undefined => {
  return mockWorkOrders.find(wo => wo.id === id);
};

export const getWorkOrdersBySalesOrderId = (salesOrderId: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.salesOrderId === salesOrderId);
};

export const getWorkOrdersByStatus = (status: 'pending' | 'materials_allocated' | 'in_progress' | 'completed'): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.status === status);
};

// Vendor Management Functions  
export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find(vendor => vendor.id === id);
};

export const getVendorsByMaterial = (material: string): Vendor[] => {
  return mockVendors.filter(vendor => 
    vendor.materials.some(m => m.toLowerCase().includes(material.toLowerCase()))
  );
};

export const getActiveVendors = (): Vendor[] => {
  return mockVendors.filter(vendor => vendor.isActive);
};

// Raw Material Inventory Functions
export const getRawMaterialById = (id: string): RawMaterial | undefined => {
  return mockRawMaterials.find(rm => rm.id === id);
};

export const getRawMaterialsByCategory = (category: 'Yarn' | 'Dye' | 'Chemical' | 'Packaging'): RawMaterial[] => {
  return mockRawMaterials.filter(rm => rm.category === category);
};

export const getLowStockMaterials = (): RawMaterial[] => {
  return mockRawMaterials.filter(rm => rm.currentStock <= rm.reorderLevel);
};

// Production Management Functions
export const getProductionRecordsByWorkOrderId = (workOrderId: string): ProductionRecord[] => {
  return mockProductionRecords.filter(pr => pr.workOrderId === workOrderId);
};

export const getProductionRecordsByDate = (date: string): ProductionRecord[] => {
  return mockProductionRecords.filter(pr => pr.date === date);
};

export const getProductionRecordsByOperator = (operator: string): ProductionRecord[] => {
  return mockProductionRecords.filter(pr => pr.operator === operator);
};

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

export const getProductionEfficiency = (): number => {
  if (mockProductionRecords.length === 0) return 0;
  const totalEfficiency = mockProductionRecords.reduce((sum, record) => sum + record.efficiency, 0);
  return Math.round(totalEfficiency / mockProductionRecords.length);
};

// getCustomerSatisfactionScore moved to customerMockData.ts

// Order Fulfillment Functions
// getOrderFulfillmentStatus function moved to customerMockData.ts (depends on customer feedback)

// getTopPerformingCustomers moved to customerMockData.ts

// Material Requirements Planning
export const calculateMaterialRequirements = (workOrderId: string): string[] => {
  const workOrder = getWorkOrderById(workOrderId);
  if (!workOrder) return [];
  return workOrder.materialRequirements;
};

export const checkMaterialAvailability = (materialName: string, requiredQuantity: number): {
  available: boolean;
  currentStock: number;
  shortfall: number;
} => {
  const material = mockRawMaterials.find(rm => 
    rm.name.toLowerCase().includes(materialName.toLowerCase())
  );
  
  if (!material) {
    return { available: false, currentStock: 0, shortfall: requiredQuantity };
  }
  
  const shortfall = Math.max(0, requiredQuantity - material.currentStock);
  return {
    available: material.currentStock >= requiredQuantity,
    currentStock: material.currentStock,
    shortfall
  };
};