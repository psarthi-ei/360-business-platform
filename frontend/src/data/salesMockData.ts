// Sales Mock Data for 360° Business Platform
// This file contains sales-related sample data: leads, quotes, orders, invoices, payments, and fabric specifications

// Master Item Catalog integration for Phase 2 (functions imported dynamically in quote generation)

// No inventory imports - Sales module handles only customer relationships and service orders

// Universal Order Status - Comprehensive status including all current values for compatibility
export type OrderStatus = 
  // Core customer-facing states
  | 'order_confirmed'        // Order created and confirmed
  | 'payment_pending'        // Awaiting payment (advance/full)
  | 'materials_pending'      // Awaiting materials (client materials for JO, procurement for SO)
  | 'in_process'            // Being manufactured/processed
  | 'quality_check'         // Final quality verification
  | 'ready_to_ship'         // Completed, ready for delivery
  | 'shipped'               // Dispatched to customer
  | 'delivered'             // Customer received
  | 'completed'             // Order fully completed and invoiced
  | 'on_hold'               // Temporarily paused
  | 'cancelled'             // Order cancelled
  
  // Legacy SalesOrder status values (kept for compatibility)
  | 'production_planning'    // Production being planned
  | 'production_started'     // Same as in_process (alias)
  | 'production_completed'   // Production finished
  | 'in_transit'            // Same as shipped (alias)
  
  // Legacy JobOrder status values (kept for compatibility)
  | 'awaiting_client_materials'  // Awaiting client materials for job work
  | 'materials_acknowledged'     // Client materials received and acknowledged
  | 'service_completed'          // Service work completed
  | 'ready_for_invoice';         // Ready to generate final invoice

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

export interface ServiceRequirements {
  serviceType: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  materialType: string;        // "Cotton Grey Fabric" - what customer brings
  quantity: number;           // Quantity customer wants processed
  unit: 'meters' | 'yards' | 'kg' | 'pieces';
  
  // ONLY customer specifications (not production details)
  customerSpecifications: {
    colors?: string[];         // Customer wants "Red, Blue, Green"
    finishType?: string[];     // Customer wants ["Matte finish", "Anti-wrinkle"]
    printType?: string[];      // For printing services
    designComplexity?: string; // For printing services
    printQuality?: string;     // For printing services
    specialRequirements?: string[]; // Customer-specific requirements
    testingRequired?: string[]; // Required tests
    chemicalRequirements?: string[]; // For dyeing services
    processRequirements?: string[]; // Process-specific requirements
    qualityGrade?: string;     // Quality requirements
  };
  
  deliveryTimeline: string;    // Promise to customer "7 days"
  specialInstructions?: string; // Customer notes only
}

// ===== PHASE 2: ENHANCED LEAD MANAGEMENT INTERFACES =====

// Catalog-driven item selection for leads
export interface LeadRequestedItem {
  masterItemId: string;               // Reference to Master Item Catalog
  requestedQuantity: number;          // Quantity needed
  customSpecifications?: Record<string, string>; // Custom modifications
  budgetExpectation?: number;         // Expected price per unit
  priority: 'must_have' | 'preferred' | 'nice_to_have'; // Item priority
  notes?: string;                     // Additional notes
  
  // Pricing fields for quote editing (preserved from quote data)
  customPrice?: number;               // Override price when editing quotes
  discountPercentage?: number;        // Discount applied (from quote data)
  quantity?: number;                  // Actual quantity (may differ from requested)
}

// Customer material information for Job Work leads
export interface CustomerMaterialInfo {
  materialType: string;               // Type of material customer provides
  quantity: number;                   // Quantity customer will provide
  qualityGrade: string;               // Quality assessment
  deliveryDate: string;               // When customer will deliver
  specifications: Record<string, string>; // Material specifications
}

// Budget range management
export interface BudgetRange {
  minimum: number;                    // Minimum budget
  maximum: number;                    // Maximum budget
  currency: 'INR';                    // Currency
  isFlexible: boolean;                // Can budget be exceeded
}

// Custom specifications for special requirements
export interface CustomSpecification {
  specType: string;                   // Type of specification
  description: string;                // Detailed description
  isMandatory: boolean;               // Is this required
  estimatedCostImpact?: number;       // Estimated additional cost
}

// Delivery requirements and constraints
export interface DeliveryRequirements {
  preferredDate: string;              // When customer wants delivery
  isDateFlexible: boolean;            // Can date be adjusted
  deliveryLocation: string;           // Where to deliver
  specialHandling?: string[];         // Special delivery requirements
  qualityInspectionRequired?: boolean; // Need quality check before delivery
}

// Phase 2 Day 12: Quote Conversion Workflow Interfaces
// Different workflow paths for sales vs service quotes

// Sales Quote Conversion (Advance Payment Model)
export interface SalesQuoteConversion {
  step1: 'quote_created';
  step2: 'proforma_invoice_generated'; // For advance payment collection
  step3: 'advance_payment_received';   // Triggers order creation
  step4: 'sales_order_created';
  paymentType: 'advance';
  riskMitigation: 'advance_payment_covers_material_cost';
}

// Service Quote Conversion (Credit Payment Model)  
export interface ServiceQuoteConversion {
  step1: 'service_quote_created';
  step2: 'quote_acceptance';           // Direct acceptance, no payment
  step3: 'job_order_created';          // No proforma step
  step4: 'material_receipt_awaited';
  paymentType: 'credit';
  riskMitigation: 'client_owns_materials_lower_risk';
}

// Quote Conversion Workflow States
export type QuoteConversionStep = 
  | 'quote_created'
  | 'proforma_invoice_generated'
  | 'advance_payment_received'
  | 'sales_order_created'
  | 'service_quote_created'
  | 'quote_acceptance'
  | 'job_order_created'
  | 'material_receipt_awaited';

// Workflow Controller for handling different quote types
export interface QuoteWorkflowController {
  quoteId: string;
  quoteType: 'product_sale' | 'service_processing';
  currentStep: QuoteConversionStep;
  workflowType: 'sales_conversion' | 'service_conversion';
  nextStep: QuoteConversionStep | null;
  canProgress: boolean;
  progressCondition?: string; // What needs to happen to progress
}

// Lead conversation note with timestamp tracking
export interface LeadNote {
  id: string;
  content: string;
  timestamp: string; // ISO string for precise datetime
  createdBy?: string; // Future enhancement for multi-user support
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
  leadType: 'sales' | 'job_work'; // Lead type differentiation for dual business model
  
  // Catalog-driven item selection (replaces manual requirements)
  requestedItems: LeadRequestedItem[];
  
  // Business context and budget management
  budgetExpectations?: BudgetRange;
  priorityLevel: 'must_have' | 'preferred' | 'nice_to_have';
  customSpecifications?: CustomSpecification[];
  
  // Customer materials (Job Work specific)
  customerMaterials?: CustomerMaterialInfo[];
  
  // Delivery requirements
  deliveryRequirements: DeliveryRequirements;
  
  // PHASE 1.3: Enhanced Quote Tracking System
  activeQuoteId?: string;              // Current active quote for this lead
  quoteHistory?: string[];             // Array of all quote IDs (including revisions)
  lastQuoteAction?: 'generated' | 'sent' | 'approved' | 'revised'; // Last quote action taken
  lastQuoteActionDate?: string;        // When last quote action occurred
  quoteCount?: number;                 // Total number of quotes generated (including revisions)
  
  // Relationship Tracking
  notes?: string; // Initial requirements/specifications captured during lead creation
  notesHistory?: LeadNote[]; // Complete conversation history with timestamps
  
  // Enhanced Conversion Status - Complete Sales Process Stages
  conversionStatus: 'active_lead' | 'quote_sent' | 'quote_rejected' | 'quote_expired' | 'negotiation' | 'verbally_approved' | 'proforma_sent' | 'payment_failed' | 'awaiting_payment' | 'converted_to_order';
  convertedToOrderDate?: string;
}

// Enhanced item interface with catalog integration
export interface QuoteItem {
  itemCode: string;        // "TEX-PREM-001"
  description: string;     // "Premium Cotton Fabric"
  hsnCode: string;         // "5208" (HSN code for textiles)
  quantity: number;        // 1500
  unit: string;           // "meters", "kg", "pieces"
  rate: number;           // 185 (per unit price)
  discount: number;       // 0 (percentage discount) - made required for compatibility
  taxableAmount: number;  // 277500 (quantity * rate - discount)
  
  // PHASE 2: Catalog integration fields
  catalogItemId?: string;           // Reference to Master Item Catalog
  businessModelPricing?: 'sales_premium' | 'job_work_competitive';
  appliedVolumeDiscount?: {
    thresholdQuantity: number;
    discountPercentage: number;
    discountAmount: number;
  };
}

export interface Quote {
  id: string;
  leadId: string;
  businessProfileId?: string; // Links to company BusinessProfile
  quoteDate: string;
  validUntil: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'superseded' | 'pending' | 'under_review' | 'proforma_sent' | 'advance_requested' | 'advance_overdue' | 'advance_received' | 'order_created';
  statusMessage: string;
  approvalDate?: string;
  proformaInvoiceId?: string;
  advancePaymentRequired?: number;
  advancePaymentStatus?: 'not_requested' | 'awaiting' | 'overdue' | 'received';
  
  // PHASE 2: Business model integration
  businessModel?: 'sales' | 'job_work';
  businessModelTerms?: {
    paymentTerms: string;
    deliveryDays?: number;
    processingDays?: number;
    specialConditions?: string[];
  };
  pricingDifferentiation?: {
    strategy: string;
    differentiationPercentage: number;
    riskFactors: string[];
  };
  
  // Professional structured items array
  items: QuoteItem[];
  
  // PHASE 1.1: Quote Revision Tracking System (required fields)
  parentQuoteId?: string;           // Reference to original quote if this is a revision
  revisionNumber: number;           // Sequential revision number (1 = original, 2+ = revisions)
  isActive: boolean;                // Only the latest revision should be active
  lastRevisionDate?: string;        // When this quote was last revised
  revisionReason?: string;          // Why this revision was created
}

// PHASE 1.1: Quote Revision System Supporting Interfaces
export interface QuoteRevision {
  id: string;
  parentQuoteId: string;
  revisionNumber: number;
  changes: QuoteChanges;
  createdDate: string;
  createdBy: string;
  reason?: string;
}

export interface QuoteChanges {
  itemsAdded?: QuoteItem[];
  itemsRemoved?: string[];           // Item codes that were removed
  itemsModified?: {
    itemCode: string;
    oldValues: Partial<QuoteItem>;
    newValues: Partial<QuoteItem>;
  }[];
  pricingAdjustments?: {
    oldTotalAmount: number;
    newTotalAmount: number;
    adjustmentReason: string;
  };
  termsChanges?: {
    oldTerms: string;
    newTerms: string;
  };
}

export interface QuoteHistory {
  quoteId: string;
  revisions: QuoteRevision[];
  latestRevisionNumber: number;
  totalRevisions: number;
}

export interface QuoteAction {
  action: 'generate' | 'view' | 'revise' | 'send' | 'approve' | 'generate_proforma' | 'create_job_order';
  label: string;
  icon: string;
  buttonClass: string;
  condition?: (quote: Quote, lead?: Lead) => boolean;
}

export interface QuoteState {
  leadId: string;
  hasQuote: boolean;
  activeQuoteId?: string;
  latestQuoteStatus?: Quote['status'];
  revisionCount: number;
  availableActions: QuoteAction[];
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
  status: 'pending' | 'sent' | 'payment_received' | 'expired' | 'draft';
  paymentInstructions: string;
  
  // Professional structured items array
  items: ProformaItem[];
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

// Base interface for all customer orders (universal business term)
export interface SalesOrder {
  id: string;
  quoteId: string;
  businessProfileId: string; // Changed from customerId
  advancePaymentId: string; // Links to advance payment that created this order
  orderDate: string;
  deliveryDate: string;
  items: OrderItem[];               // Professional structured items array
  totalAmount: number;
  status: OrderStatus;              // Unified customer-facing status (clean architecture)
  statusMessage: string;
  paymentStatus: 'pending' | 'advance_received' | 'partial' | 'completed' | 'overdue' | 'fully_paid';
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
  progressPercentage?: number; // Production progress (0-100) - kept for component compatibility
  
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
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  paymentReceivedDate?: string;
  notes: string;
  
  // Phase 2 Day 13: Service Invoice Enhancement
  // Service-specific fields for job order invoices
  invoiceType?: 'product_invoice' | 'service_invoice';
  serviceDescription?: string;
  serviceType?: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  creditTerms?: number;
  materialOwnership?: 'company' | 'client';
  
  // Service completion tracking
  serviceCompletionDate?: string;
  materialReturnStatus?: 'processing' | 'ready_for_collection' | 'returned';
  qualityCertificateAttached?: boolean;
  
  // Enhanced payment details
  paymentType?: 'advance' | 'credit';
  
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

// ==================== JOB ORDER SYSTEM INTERFACES ====================

// Service Requirements - Parallel to FabricRequirements for job work specifications
// Clean Customer-Focused Service Requirements (NO production details)

// ❌ REMOVED: ClientMaterialInward interface - duplicated inventory functionality
// ✅ REPLACEMENT: Use inventory system as single source of truth for all materials

// Client Material Balance - Material consumption tracking during production
export interface ClientMaterialBalance {
  materialId: string;
  jobOrderId: string;
  customerId: string;
  
  // Balance tracking
  initialQuantity: number;
  allocatedToProduction: number;
  consumedInProcess: number;
  wasteGenerated: number;
  returnableBalance: number;
  finalProductDelivered: number;
  
  // Audit trail
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
  
  // Return management
  returnScheduled?: boolean;
  returnDate?: string;
  returnQuantity?: number;
}

// Job Order - Extends SalesOrder with service-focused fields and client material tracking
// JobOrder: Clean Sales-Only Interface (no production/inventory concerns)
// Job Order - Service processing with client materials
export interface JobOrder extends SalesOrder {
  // Sales differentiator fields
  orderType: 'job_order';                    // Key differentiator from regular sales
  materialOwnership: 'client';               // Business model indicator
  
  // Sales & service fields only
  serviceType: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  creditTerms: 15 | 30 | 45;                // Credit days for payment terms
  
  // Sales expectation tracking (NOT inventory management)
  expectedClientMaterialNames: string[];     // What we expect for quoting/costing
  
  // Uses inherited status field (OrderStatus) - no separate salesServiceStatus needed
  
  // Sales service requirements (for quotation and billing)
  serviceRequirements?: ServiceRequirements;
  
  // Sales credit management
  creditApprovalStatus: 'approved' | 'pending' | 'requires_review';
  creditApprovalBy?: string;
  creditHoldReason?: string;
}

// ProductOrder for product sales with company materials
// Product Order - Product sales using company materials and inventory
export interface ProductOrder extends SalesOrder {
  orderType: 'product_order';               // Differentiator field
  materialOwnership: 'company';             // Always company for product sales
}

// ==================== FINANCIAL MANAGEMENT INTERFACES ====================

// Receivables with Aging Analysis - Credit cycle management
export interface ReceivableRecord {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  companyName: string;
  
  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  originalAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  
  // Aging analysis
  daysPastDue: number;           // Calculated field
  agingCategory: 'current' | '31-60' | '61-90' | '90+';
  
  // Order context
  orderType: 'sales_order' | 'job_order';
  orderId: string;
  orderDescription: string;      // Brief description of what was sold/processed
  
  // Credit management
  creditLimit: number;
  totalOutstanding: number;      // Total across all invoices for this customer
  creditUtilization: number;     // Percentage of credit limit used
  
  // Risk assessment
  customerRisk: 'low' | 'medium' | 'high' | 'critical';
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  lastPaymentDate?: string;
  averagePaymentDays: number;    // Historical average
  
  // Collection workflow
  remindersSent: number;
  lastReminderDate?: string;
  nextActionDate?: string;
  nextActionType?: 'reminder' | 'call' | 'visit' | 'legal';
  assignedCollector?: string;
  
  // Status tracking
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue' | 'collection' | 'written_off';
  paymentPlan?: {
    planActive: boolean;
    installmentAmount: number;
    nextInstallmentDate: string;
    remainingInstallments: number;
  };
}

// Payables Management - Vendor payment scheduling and tracking
export interface PayableRecord {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorType: 'chemical_supplier' | 'utility_provider' | 'service_provider' | 'equipment_vendor';
  
  // Bill details
  billNumber: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  
  // Timing analysis
  daysToDue: number;             // Positive = upcoming, negative = overdue
  status: 'upcoming' | 'due_today' | 'due_soon' | 'overdue';
  
  // Categorization
  category: 'raw_materials' | 'chemicals' | 'utilities' | 'services' | 'equipment';
  subCategory?: string;          // "Reactive Dyes", "Electricity", "Machine Maintenance"
  
  // Payment planning
  paymentMethod: 'RTGS' | 'NEFT' | 'Cheque' | 'Cash' | 'UPI';
  scheduledPaymentDate?: string;
  approvalRequired: boolean;
  approvedBy?: string;
  
  // Vendor relationship
  vendorRating: 'excellent' | 'good' | 'fair' | 'poor';
  criticalSupplier: boolean;     // Essential for operations
  paymentTerms: string;          // "30 days", "Immediate", "45 days"
  
  // Order context
  relatedPurchaseOrder?: string;
  relatedGRN?: string;
  materialDelivered: boolean;
  
  // Cash flow impact
  priority: 'high' | 'medium' | 'low';
  earlyPaymentDiscount?: number; // Percentage discount for early payment
  latePaymentPenalty?: number;   // Penalty for late payment
}

// Mock Data
// mockBusinessProfiles moved to customerMockData.ts - import from there for customer data

// Simplified MVP Data: Exactly 5 leads
export const mockLeads: Lead[] = [

  // 4. Hot Job Work Lead - Dyeing Service
  {
    id: 'lead-004',
    businessProfileId: 'bp-surat-processors',
    contactPerson: 'Ramesh Kumar',
    designation: 'Production Manager',
    department: 'Processing',
    contact: '+91 98765 43210',
    phone: '+91 98765 43210',
    email: 'ramesh@suratprocessors.com',
    inquiry: 'Dyeing service for 2,000 meters cotton fabric - Navy blue reactive dyes',
    budget: '₹45,000-55,000',
    timeline: '7 days',
    priority: 'hot',
    leadType: 'job_work',
    requestedItems: [
      {
        masterItemId: 'dyeing-001',
        requestedQuantity: 2000,
        priority: 'must_have',
        budgetExpectation: 25,
        customSpecifications: {
          'Service Type': 'Dyeing',
          'Material Type': 'Cotton Grey Fabric',
          'Colors': 'Navy Blue',
          'Quality Grade': 'A-Grade',
          'Chemical Requirements': 'Reactive Dyes, Salt, Soda Ash'
        },
        notes: 'Urgent dyeing service for export client'
      }
    ],
    priorityLevel: 'must_have',
    deliveryRequirements: {
      preferredDate: '2025-05-22',
      isDateFlexible: false,
      deliveryLocation: 'Surat Processors Facility',
      specialHandling: ['Pre-treatment required'],
      qualityInspectionRequired: true
    },
    notes: 'Export client needs superior color fastness. Navy blue must match Pantone 19-3832. Client bringing own 100% cotton grey fabric.',
    notesHistory: [
      {
        id: 'note-1731307200000',
        content: 'Quote price too high, need to discuss alternatives',
        timestamp: '2024-11-11T10:00:00.000Z',
        createdBy: 'sales_team'
      },
      {
        id: 'note-1731220800000',
        content: 'Regular service customer. Brings own fabric. Quote rejected due to pricing.',
        timestamp: '2024-11-10T10:00:00.000Z',
        createdBy: 'sales_team'
      },
      {
        id: 'note-1731134400000',
        content: 'Customer called to discuss dyeing requirements. Needs navy blue color matching for export order.',
        timestamp: '2024-11-09T10:00:00.000Z',
        createdBy: 'sales_team'
      },
      {
        id: 'note-1731048000000',
        content: 'Initial inquiry received. Customer visited factory for quality check.',
        timestamp: '2024-11-08T10:00:00.000Z',
        createdBy: 'sales_team'
      }
    ],
    conversionStatus: 'quote_rejected',
    // Quote tracking
    activeQuoteId: 'QT-L004-001',
    quoteHistory: ['QT-L004-001'],
    lastQuoteAction: 'revised',
    lastQuoteActionDate: '2025-11-09T14:30:00.000Z',
    quoteCount: 1
  },

  // 5. Warm Job Work Lead - Finishing Service
  {
    id: 'lead-005',
    businessProfileId: 'bp-ahmedabad-finishers',
    contactPerson: 'Kiran Shah',
    designation: 'Quality Head',
    department: 'Finishing',
    contact: '+91 97654 32108',
    phone: '+91 97654 32108',
    email: 'kiran@ahmedabadfinish.com',
    inquiry: 'Softening and anti-wrinkle finishing for 1500m cotton fabric',
    budget: '₹30,000-40,000',
    timeline: '5 days',
    priority: 'warm',
    leadType: 'job_work',
    requestedItems: [
      {
        masterItemId: 'finishing-001',
        requestedQuantity: 1500,
        priority: 'preferred',
        budgetExpectation: 30,
        customSpecifications: {
          'Service Type': 'Finishing',
          'Material Type': 'Cotton Dyed Fabric',
          'Finish Type': 'Softening, Anti-wrinkle',
          'Quality Grade': 'Premium',
          'Special Requirements': 'Enzyme treatment, Silicone softening'
        },
        notes: 'Regular finishing service requirement'
      }
    ],
    priorityLevel: 'preferred',
    deliveryRequirements: {
      preferredDate: '2025-05-25',
      isDateFlexible: true,
      deliveryLocation: 'Ahmedabad Finishers Plant',
      specialHandling: ['Hand feel testing required'],
      qualityInspectionRequired: true
    },
    notes: 'Regular customer. Needs consistent soft hand feel for garment manufacturing. Premium quality required for branded clothes.',
    notesHistory: [
      {
        id: 'note-1731134400001',
        content: 'Regular finishing work, need consistent quality',
        timestamp: '2024-11-09T10:00:00.000Z',
        createdBy: 'sales_team'
      }
    ],
    conversionStatus: 'active_lead',
    // No quote tracking - demonstrates "Generate Quote" state
    // activeQuoteId: undefined,
    // quoteHistory: [],
    // lastQuoteAction: undefined,
    // lastQuoteActionDate: undefined,
    // quoteCount: 0
  },

  // 6. Hot Job Work Lead - Multi-Service Pipeline (Dyeing + Finishing)
  {
    id: 'lead-006',
    businessProfileId: 'bp-rajkot-processors',
    contactPerson: 'Ravi Patel',
    designation: 'Operations Head',
    department: 'Processing',
    contact: '+91 95123 67890',
    phone: '+91 95123 67890',
    email: 'ravi@rajkotprocessors.com',
    inquiry: 'Complete processing pipeline - dyeing and finishing for 3,000 meters cotton fabric',
    budget: '₹85,000-1,10,000',
    timeline: '10 days',
    priority: 'hot',
    leadType: 'job_work',
    requestedItems: [
      {
        masterItemId: 'dyeing-001',
        requestedQuantity: 3000,
        priority: 'must_have',
        budgetExpectation: 25,
        customSpecifications: {
          'Service Type': 'Reactive Dyeing',
          'Material Type': 'Cotton Grey Fabric',
          'Colors': 'Dark Navy Blue',
          'Quality Grade': 'Export Quality',
          'Chemical Requirements': 'Reactive Dyes, Salt, Soda Ash, Anti-migrant'
        },
        notes: 'Stage 1: Reactive dyeing with superior color fastness for export client'
      },
      {
        masterItemId: 'finishing-001',
        requestedQuantity: 3000,
        priority: 'must_have',
        budgetExpectation: 18,
        customSpecifications: {
          'Service Type': 'Premium Finishing',
          'Material Type': 'Dyed Cotton Fabric',
          'Finish Type': 'Softening, Anti-wrinkle, Water-repellent',
          'Quality Grade': 'Export Premium',
          'Special Requirements': 'OEKO-TEX certified chemicals only'
        },
        notes: 'Stage 2: Complete finishing after dyeing - full processing pipeline'
      }
    ],
    priorityLevel: 'must_have',
    deliveryRequirements: {
      preferredDate: '2025-05-28',
      isDateFlexible: false,
      deliveryLocation: 'Rajkot Processors Facility',
      specialHandling: ['Sequential processing required', 'Quality testing at each stage'],
      qualityInspectionRequired: true
    },
    notes: 'Large export order - complete processing pipeline required. Must use OEKO-TEX certified chemicals only. Quality critical.',
    notesHistory: [
      {
        id: 'note-1731393600000',
        content: 'Reviewing quote, need some modifications to pricing and delivery terms',
        timestamp: '2024-11-12T10:00:00.000Z',
        createdBy: 'sales_team'
      }
    ],
    conversionStatus: 'verbally_approved',
    // Quote tracking
    activeQuoteId: 'QT-006',
    quoteHistory: ['QT-006'],
    lastQuoteAction: 'approved',
    lastQuoteActionDate: '2025-11-09T10:00:00.000Z',
    quoteCount: 1
  },

  // 7. New Customer Lead - Job Work Service Inquiry
  {
    id: 'lead-007',
    businessProfileId: 'bp-surat-wholesale',
    contactPerson: 'Kiran Shah',
    designation: 'Production Manager',
    department: 'Production',
    contact: '+91 98765 43203',
    phone: '+91 98765 43203',
    email: 'kiran@suratmarket.com',
    inquiry: 'Dyeing and finishing services for 5,000 meters grey cotton fabric - retail quality',
    budget: '₹2,50,000-3,00,000',
    timeline: '12 days',
    priority: 'warm',
    leadType: 'job_work',
    requestedItems: [
      {
        masterItemId: 'dyeing-001',
        requestedQuantity: 5000,
        priority: 'must_have',
        budgetExpectation: 32,
        customSpecifications: {
          'Service Type': 'Reactive Dyeing',
          'Material Type': 'Cotton Grey Fabric',
          'Colors': 'Light Blue, Dark Blue, Green',
          'Quality Grade': 'Commercial Grade',
          'Chemical Requirements': 'Reactive Dyes, Basic chemicals'
        },
        notes: 'First-time job work customer. Need reliable service for retail market.'
      },
      {
        masterItemId: 'finishing-001',
        requestedQuantity: 5000,
        priority: 'nice_to_have',
        budgetExpectation: 18,
        customSpecifications: {
          'Service Type': 'Basic Finishing',
          'Material Type': 'Dyed Cotton Fabric',
          'Finish Type': 'Softening, Basic treatments',
          'Quality Grade': 'Commercial Grade',
          'Special Requirements': 'Ready for retail market'
        },
        notes: 'Optional finishing service if dyeing quality is satisfactory.'
      }
    ],
    priorityLevel: 'nice_to_have',
    deliveryRequirements: {
      preferredDate: '2025-12-01',
      isDateFlexible: true,
      deliveryLocation: 'Surat Wholesale Market - Shop No. 45',
      specialHandling: ['Client will provide grey fabric', 'Quality inspection before processing'],
      qualityInspectionRequired: true
    },
    notes: 'New job work customer inquiry. First contact with our company. Looking for reliable processing partner for retail market supply.',
    notesHistory: [
      {
        id: 'note-1731394800000',
        content: 'Initial inquiry received via phone. Customer interested in job work services for retail market supply.',
        timestamp: '2025-11-12T10:00:00.000Z',
        createdBy: 'sales_team'
      },
      {
        id: 'note-1731408400000',
        content: 'Sent service portfolio and pricing for dyeing and finishing. Customer reviewing quote requirements.',
        timestamp: '2025-11-12T14:00:00.000Z',
        createdBy: 'sales_team'
      }
    ],
    conversionStatus: 'active_lead',
    // Quote tracking
    activeQuoteId: undefined,
    quoteHistory: [],
    lastQuoteAction: undefined,
    lastQuoteActionDate: undefined,
    quoteCount: 0
  }
];

export const mockQuotes: Quote[] = [
  // ========================================
  // SIMPLIFIED QUOTES - MATCHED TO OUR 6 LEADS
  // ========================================
  
  // CLEAN QUOTE STRUCTURE - MATCHED TO 6 LEADS:
  // lead-001: NO quote (demonstrates "Generate Quote" state)
  // lead-002: Quote generated (pending state)
  // lead-003: Quote sent (under review)
  // lead-004: Quote with revision (proforma sent)
  // lead-005: Quote sent (job work)
  // lead-006: Quote approved (job work)
  

  
  // CRITICAL FIX: Missing quote for lead-004 (proforma_sent status)
  {
    id: 'QT-L004-001',
    leadId: 'lead-004', // Links to lead with conversionStatus: 'proforma_sent'
    businessProfileId: 'bp-surat-processors',
    quoteDate: 'October 15, 2025',
    validUntil: 'November 5, 2025',
    totalAmount: 102080,
    status: 'rejected', // Aligns with lead conversionStatus: 'quote_rejected'
    statusMessage: 'Quote rejected by customer - Price too high for dyeing service',
    proformaInvoiceId: '', // No proforma since quote was rejected
    advancePaymentRequired: 51040, // 50% advance for job work service
    advancePaymentStatus: 'awaiting', // Waiting for payment to convert lead to customer
    revisionNumber: 1,
    isActive: true,
    // ✅ Job Work Service - Dyeing service for customer's fabric
    items: [
      {
        itemCode: "DYE-REACTIVE-STD",
        description: "Reactive Dyeing Service - Standard Colors (Navy Blue)",
        hsnCode: "9983",
        quantity: 2000,
        unit: "meters",
        rate: 58, // Job work pricing for 2000 meters (volume tier)
        discount: 12, // Volume discount for job work
        taxableAmount: 102080,
        catalogItemId: 'dyeing-001'
      }
    ]
  },
  
  // QT-005: REMOVED to demonstrate "Generate Quote" functionality for lead-005

  // QT-006: Multi-service pipeline quote for lead-006 (Dyeing + Finishing)
  {
    id: 'QT-006',
    leadId: 'lead-006',
    businessProfileId: 'bp-rajkot-processors',
    quoteDate: 'November 8, 2025',
    validUntil: 'November 23, 2025',
    totalAmount: 129000,
    status: 'approved',
    statusMessage: 'Multi-service pipeline approved - Ready for job order creation',
    advancePaymentRequired: 0, // Job work - no advance needed
    advancePaymentStatus: 'not_requested',
    revisionNumber: 2,
    isActive: true,
    lastRevisionDate: '2025-11-09T10:00:00.000Z',
    revisionReason: 'Updated pricing for premium finishing requirements',
    // ✅ Job Work Service - Complete pipeline (Dyeing + Finishing)
    items: [
      {
        itemCode: "DYE-REACTIVE-PREM",
        description: "Reactive Dyeing Service - Premium Export Quality (Dark Navy Blue)",
        hsnCode: "9983",
        quantity: 3000,
        unit: "meters",
        rate: 28, // Premium dyeing rate
        discount: 5, // Volume discount
        taxableAmount: 79800,
        catalogItemId: 'dyeing-001'
      },
      {
        itemCode: "FIN-PREM-COMBO",
        description: "Premium Finishing Service - Softening + Anti-wrinkle + Water-repellent",
        hsnCode: "9983",
        quantity: 3000,
        unit: "meters",
        rate: 18, // Premium finishing rate
        discount: 3, // Volume discount
        taxableAmount: 52380,
        catalogItemId: 'finishing-001'
      }
    ]
  }
];

export const mockSalesOrders: SalesOrder[] = [];

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
export const mockProformaInvoices: ProformaInvoice[] = [];

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
export const mockAdvancePayments: AdvancePayment[] = [];

// Final GST Invoices Data - Post-delivery billing
export const mockFinalInvoices: FinalInvoice[] = [
  // Service Invoices for Job Orders (2024)
  {
    id: 'INV-JO-2025-001',
    invoiceNumber: 'INV-JO-2025-001',
    salesOrderId: 'JO-2025-001', // Job order reference (not regular sales order)
    businessProfileId: 'bp-surat-processors',
    invoiceDate: 'October 22, 2024',
    dueDate: 'November 21, 2024', // 30-day credit terms
    
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
      name: 'Surat Dye Works',
      billingAddress: 'Industrial Area, Surat - 394107, Gujarat',
      gstNumber: '24XYZAB9876C1D2',
      panNumber: 'XYZAB9876C',
      stateCode: '24',
      phone: '+91 98765 43202'
    },
    
    items: [
      {
        itemCode: 'SVC-DYE-001',
        description: 'Reactive Dyeing Service - Navy Blue (Premium)',
        hsnCode: '9988', // Service HSN code
        quantity: 1200,
        unit: 'Kg',
        rate: 40.00,
        discount: 0,
        taxableAmount: 48000
      }
    ],
    
    taxDetails: {
      isInterstate: false, // Gujarat to Gujarat (intrastate)
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgstAmount: 4320,
      sgstAmount: 4320,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 0, // Job orders typically don't require advance
      balanceDue: 56640,
      paymentTerms: 'Net 30 days'
    },
    
    subtotal: 48000,
    totalDiscount: 0,
    taxableAmount: 48000,
    totalTax: 8640,
    totalAmount: 56640,
    
    status: 'paid',
    paymentReceivedDate: 'November 15, 2024',
    notes: 'Service completed successfully. High-quality dyeing as per specifications.',
    
    // Phase 2 Day 13: Service Invoice Enhancement - Applied to existing service invoice
    invoiceType: 'service_invoice',
    serviceDescription: 'Reactive Dyeing Service - Navy Blue Premium Grade',
    serviceType: 'dyeing',
    creditTerms: 30,
    materialOwnership: 'client',
    serviceCompletionDate: 'November 12, 2024',
    materialReturnStatus: 'returned',
    qualityCertificateAttached: true,
    paymentType: 'credit',
    
    // Legacy fields for backward compatibility
    gstRate: 18,
    gstAmount: 8640,
    advanceAdjusted: 0,
    balanceAmount: 0
  },
  
  {
    id: 'INV-JO-2025-002',
    invoiceNumber: 'INV-JO-2025-002',
    salesOrderId: 'JO-2025-002', // Job order reference
    businessProfileId: 'bp-ahmedabad-finishers',
    invoiceDate: 'October 25, 2024',
    dueDate: 'November 9, 2024', // 15-day credit terms
    
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
      name: 'Advanced Textile Finishers',
      billingAddress: 'Factory Road, Surat - 394210, Gujarat',
      gstNumber: '24PQRST1234E5F6',
      panNumber: 'PQRST1234E',
      stateCode: '24',
      phone: '+91 98765 43203'
    },
    
    items: [
      {
        itemCode: 'SVC-FIN-001',
        description: 'Chemical Finishing Service - Softening & Anti-wrinkle',
        hsnCode: '9988', // Service HSN code
        quantity: 800,
        unit: 'Kg',
        rate: 62.50,
        discount: 0,
        taxableAmount: 50000
      }
    ],
    
    taxDetails: {
      isInterstate: false, // Gujarat to Gujarat (intrastate)
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgstAmount: 4500,
      sgstAmount: 4500,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 0, // Job orders typically don't require advance
      balanceDue: 59000,
      paymentTerms: 'Net 15 days'
    },
    
    subtotal: 50000,
    totalDiscount: 0,
    taxableAmount: 50000,
    totalTax: 9000,
    totalAmount: 59000,
    
    status: 'draft',
    paymentReceivedDate: undefined,
    notes: 'Premium finishing service completed. Payment due within 15 days.',
    
    // Legacy fields for backward compatibility
    gstRate: 18,
    gstAmount: 9000,
    advanceAdjusted: 0,
    balanceAmount: 59000
  },
  
  {
    id: 'INV-JO-2025-003',
    invoiceNumber: 'INV-JO-2025-003',
    salesOrderId: 'JO-2025-003', // Job order reference
    businessProfileId: 'bp-mumbai-printers',
    invoiceDate: 'October 28, 2024',
    dueDate: 'December 12, 2024', // 45-day credit terms
    
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
      name: 'Gujarat Print Masters',
      billingAddress: 'Printing Complex, Surat - 394230, Gujarat',
      gstNumber: '24MNOPQ6789R7S8',
      panNumber: 'MNOPQ6789R',
      stateCode: '24',
      phone: '+91 98765 43204'
    },
    
    items: [
      {
        itemCode: 'SVC-PRT-001',
        description: 'Digital Printing Service - Custom Pattern Design',
        hsnCode: '9988', // Service HSN code
        quantity: 600,
        unit: 'Meter',
        rate: 75.00,
        discount: 0,
        taxableAmount: 45000
      }
    ],
    
    taxDetails: {
      isInterstate: false, // Gujarat to Gujarat (intrastate)
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      cgstAmount: 4050,
      sgstAmount: 4050,
      igstAmount: 0
    },
    
    paymentDetails: {
      advanceReceived: 0, // Job orders typically don't require advance
      balanceDue: 53100,
      paymentTerms: 'Net 45 days'
    },
    
    subtotal: 45000,
    totalDiscount: 0,
    taxableAmount: 45000,
    totalTax: 8100,
    totalAmount: 53100,
    
    status: 'overdue',
    paymentReceivedDate: undefined,
    notes: 'Custom printing completed. Extended credit terms but payment overdue.',
    
    // Legacy fields for backward compatibility
    gstRate: 18,
    gstAmount: 8100,
    advanceAdjusted: 0,
    balanceAmount: 53100
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

// ===== PHASE 2: CATALOG-DRIVEN QUOTE GENERATION =====

// Generate quote from enhanced lead using existing Quote interface
export const generateQuoteFromLead = (leadId: string): Quote | null => {
  const lead = getLeadById(leadId);
  if (!lead || !lead.requestedItems || lead.requestedItems.length === 0) {
    return null;
  }

  const businessModel = lead.leadType;
  const quoteItems: QuoteItem[] = [];
  let subtotal = 0;

  // Import catalog functions dynamically
  const { calculateItemPrice, getItemById } = require('./catalogMockData');

  for (const requestedItem of lead.requestedItems) {
    const catalogItem = getItemById(requestedItem.masterItemId);
    if (!catalogItem) continue;

    // Skip materials for job work (customer provides materials)
    if (businessModel === 'job_work' && catalogItem.classification === 'material') {
      continue;
    }

    const priceCalculation = calculateItemPrice(
      requestedItem.masterItemId,
      requestedItem.requestedQuantity,
      businessModel
    );

    const quoteItem: QuoteItem = {
      itemCode: catalogItem.code,
      description: catalogItem.name,
      hsnCode: '5208', // Textile HSN code
      quantity: requestedItem.requestedQuantity,
      unit: catalogItem.pricing.salesOrderPricing[0]?.unit || 'piece',
      rate: priceCalculation.finalPrice,
      discount: priceCalculation.discountDetails?.discountPercentage || 0,
      taxableAmount: priceCalculation.finalPrice * requestedItem.requestedQuantity,
      
      // Enhanced catalog fields
      catalogItemId: requestedItem.masterItemId,
      businessModelPricing: businessModel === 'sales' ? 'sales_premium' : 'job_work_competitive',
      appliedVolumeDiscount: priceCalculation.discountDetails ? {
        thresholdQuantity: priceCalculation.discountDetails.thresholdQuantity,
        discountPercentage: priceCalculation.discountDetails.discountPercentage,
        discountAmount: (priceCalculation.basePrice - priceCalculation.finalPrice) * requestedItem.requestedQuantity
      } : undefined
    };

    quoteItems.push(quoteItem);
    subtotal += quoteItem.taxableAmount;
  }

  const taxes = Math.round(subtotal * 0.18); // 18% GST
  const terms = getBusinessModelTerms(businessModel);
  const validityDays = businessModel === 'sales' ? 15 : 30;

  return {
    id: `QT-${Date.now()}-${leadId.split('-')[1]}`,
    leadId,
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: getValidityDate(validityDays),
    totalAmount: subtotal + taxes,
    status: 'draft',
    statusMessage: 'Quote generated from catalog',
    items: quoteItems,
    revisionNumber: 1,
    isActive: true,
    
    // Enhanced business model fields
    businessModel,
    businessModelTerms: terms,
    pricingDifferentiation: {
      strategy: businessModel === 'sales' ? 'Material + Service + Premium' : 'Service + Competitive Processing',
      differentiationPercentage: businessModel === 'sales' ? 25 : -20,
      riskFactors: businessModel === 'sales' 
        ? ['Material procurement risk', 'Inventory holding cost', 'Quality guarantee']
        : ['Customer material dependency', 'Lower margin model']
    }
  };
};

// Business model specific terms
const getBusinessModelTerms = (businessModel: 'sales' | 'job_work') => {
  return businessModel === 'sales' 
    ? { 
        paymentTerms: '30% advance, 70% on delivery', 
        deliveryDays: 14,
        specialConditions: ['Quality inspection allowed', 'Material procurement risk with manufacturer']
      }
    : { 
        paymentTerms: '100% on completion', 
        processingDays: 7,
        specialConditions: ['Customer provides materials', 'Material quality verification at receipt']
      };
};

// Get quote validity date
const getValidityDate = (validityDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + validityDays);
  return date.toISOString().split('T')[0];
};

// Generate quote and update lead status
export const generateAndApplyQuote = (leadId: string): { quote: Quote | null, updatedLead: Lead | null } => {
  const quote = generateQuoteFromLead(leadId);
  if (!quote) {
    return { quote: null, updatedLead: null };
  }

  // Update lead with generated quote reference
  const leadIndex = mockLeads.findIndex(lead => lead.id === leadId);
  if (leadIndex === -1) {
    return { quote, updatedLead: null };
  }

  const updatedLead = { ...mockLeads[leadIndex] };
  // Update lead quote tracking (new approach replaces generatedQuoteId)
  updatedLead.activeQuoteId = quote.id;
  updatedLead.quoteHistory = [quote.id];
  updatedLead.conversionStatus = 'quote_sent';
  
  // Update the mock data (in real app, this would be API call)
  mockLeads[leadIndex] = updatedLead;

  return { quote, updatedLead };
};

// Get applicable catalog items for business model
export const getApplicableItemsForBusinessModel = (businessModel: 'sales' | 'job_work') => {
  const { getApplicableItems } = require('./catalogMockData');
  return getApplicableItems(businessModel);
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

export const getJobOrderById = (id: string): JobOrder | undefined => {
  return mockJobOrders.find(order => order.id === id);
};

export const getJobOrdersByCustomerId = (customerId: string): JobOrder[] => {
  return mockJobOrders.filter(order => order.businessProfileId === customerId);
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
 * SAMPLE STRUCTURED ITEMS DATA (for testing and development)
 */

export const sampleQuoteItems: QuoteItem[] = [];

export const sampleProformaItems: ProformaItem[] = convertQuoteToProformaItems(sampleQuoteItems);
export const sampleOrderItems: OrderItem[] = convertQuoteToOrderItems(sampleQuoteItems);

// Phase 2 Day 12: Quote Conversion Workflow Controllers
// Sample data showing different workflow states for various quotes

export const mockQuoteWorkflowControllers: QuoteWorkflowController[] = [
  // Service Quote - Direct to Job Order Workflow
  {
    quoteId: 'QT-JO-001', // Service quote for dyeing
    quoteType: 'service_processing',
    currentStep: 'service_quote_created',
    workflowType: 'service_conversion',
    nextStep: 'quote_acceptance',
    canProgress: true,
    progressCondition: 'Customer acceptance required'
  },
  {
    quoteId: 'QT-JO-002', // Service quote for finishing (accepted)
    quoteType: 'service_processing',
    currentStep: 'quote_acceptance',
    workflowType: 'service_conversion',
    nextStep: 'job_order_created',
    canProgress: true,
    progressCondition: 'Generate job order automatically'
  },
  {
    quoteId: 'QT-JO-003', // Service quote for printing (completed workflow)
    quoteType: 'service_processing',
    currentStep: 'job_order_created',
    workflowType: 'service_conversion',
    nextStep: 'material_receipt_awaited',
    canProgress: false,
    progressCondition: 'Job order JO-003 created, waiting for client materials'
  },
  
  // Product Sales Quote - Advance Payment Workflow  
  {
    quoteId: 'QT-2024-001', // Product quote for cotton fabric
    quoteType: 'product_sale',
    currentStep: 'quote_created',
    workflowType: 'sales_conversion',
    nextStep: 'proforma_invoice_generated',
    canProgress: true,
    progressCondition: 'Generate proforma invoice for advance payment'
  },
  {
    quoteId: 'QT-2024-002', // Product quote with proforma generated
    quoteType: 'product_sale',
    currentStep: 'proforma_invoice_generated',
    workflowType: 'sales_conversion',
    nextStep: 'advance_payment_received',
    canProgress: false,
    progressCondition: 'Awaiting 30% advance payment of ₹4,44,000'
  },
  {
    quoteId: 'QT-2024-003', // Product quote with payment received
    quoteType: 'product_sale',
    currentStep: 'advance_payment_received',
    workflowType: 'sales_conversion',
    nextStep: 'sales_order_created',
    canProgress: true,
    progressCondition: 'Create sales order for production'
  }
];

// Helper functions for quote workflow management
export function getNextWorkflowStep(controller: QuoteWorkflowController): QuoteConversionStep | null {
  if (!controller.canProgress) return null;
  return controller.nextStep;
}

export function canProgressWorkflow(quoteId: string): boolean {
  const controller = mockQuoteWorkflowControllers.find(c => c.quoteId === quoteId);
  return controller?.canProgress ?? false;
}

export function getWorkflowType(quoteId: string): 'sales_conversion' | 'service_conversion' | null {
  const controller = mockQuoteWorkflowControllers.find(c => c.quoteId === quoteId);
  return controller?.workflowType ?? null;
}

// Business logic: Service quotes skip proforma step
export function requiresProformaInvoice(quoteType: 'product_sale' | 'service_processing'): boolean {
  return quoteType === 'product_sale'; // Only product sales need proforma for advance payment
}

// ==================== JOB ORDER MOCK DATA ====================

// ❌ REMOVED: mockClientMaterials array - all client material tracking now through inventory system
// ✅ REPLACEMENT: Use mockInventory with materialOwnership: 'client' and jobOrderId references

// ✅ CLIENT MATERIAL HELPER FUNCTIONS MOVED TO INVENTORY MODULE
// All helper functions now imported from inventoryMockData.ts to eliminate dependency

// Mock Job Orders - Service-based processing orders
export const mockJobOrders: JobOrder[] = [
  {
    id: 'JO-2025-001',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'dyeing',
    creditTerms: 30,
    quoteId: 'QT-JO-001',
    businessProfileId: 'bp-surat-processors',
    advancePaymentId: '', // Job orders typically don't use advance payments
    orderDate: '2025-10-15',
    deliveryDate: '2025-10-22',
    totalAmount: 48000,
    status: 'production_started',
    statusMessage: 'Dyeing process in progress - 60% completed',
    paymentStatus: 'pending',
    urgency: 'normal',
    progressPercentage: 60,
    
    // ✅ NEW: Reference expected materials by name (no duplication)
    expectedClientMaterialNames: [
      'Cotton Fabric - Grey 150 GSM',
      'Cotton Fabric - Plain Weave 120 GSM'
    ],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Rajesh Agarwal',
    
    serviceRequirements: {
      serviceType: 'dyeing',
      materialType: 'Cotton Grey Fabric',
      quantity: 2000,
      unit: 'meters',
      customerSpecifications: {
        colors: ['Navy Blue']
      },
      deliveryTimeline: '5 days from material receipt',
      specialInstructions: 'Ensure color fastness as per export standards'
    },
    
    items: [{
      itemCode: 'SVC-DYE-001',
      description: 'Reactive Dyeing Service - Navy Blue',
      hsnCode: '9988', // Service HSN code
      quantity: 2000,
      unit: 'meters',
      rate: 24, // ₹24 per meter processing charge
      discount: 0,
      taxableAmount: 48000
    }]
  },
  
  {
    id: 'JO-2025-002',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'finishing',
    creditTerms: 15,
    quoteId: 'QT-JO-002',
    businessProfileId: 'bp-ahmedabad-finishers',
    advancePaymentId: '',
    orderDate: '2025-10-18',
    deliveryDate: '2025-10-25',
    totalAmount: 36000,
    status: 'order_confirmed',
    statusMessage: 'Material received, processing scheduled',
    paymentStatus: 'pending',
    urgency: 'normal',
    progressPercentage: 10,
    
    expectedClientMaterialNames: ['Cotton Blend Fabric 180 GSM'],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Kiran Shah',
    
    serviceRequirements: {
      serviceType: 'finishing',
      materialType: 'Cotton Dyed Fabric',
      quantity: 1500,
      unit: 'meters',
      customerSpecifications: {
        finishType: ['Softening & Anti-wrinkle']
      },
      deliveryTimeline: '3 days from processing start'
    },
    
    items: [{
      itemCode: 'SVC-FIN-001',
      description: 'Softening & Anti-wrinkle Finishing',
      hsnCode: '9988',
      quantity: 1500,
      unit: 'meters',
      rate: 24,
      discount: 0,
      taxableAmount: 36000
    }]
  },
  
  {
    id: 'JO-2025-003',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'printing',
    creditTerms: 45,
    quoteId: 'QT-JO-003',
    businessProfileId: 'bp-mumbai-printers',
    advancePaymentId: '',
    orderDate: '2025-10-21',
    deliveryDate: '2025-10-30',
    totalAmount: 96000,
    status: 'materials_pending',
    statusMessage: 'Waiting for client material quality approval',
    paymentStatus: 'pending',
    urgency: 'urgent',
    progressPercentage: 5,
    
    expectedClientMaterialNames: [
      'Polyester Fabric - 150 GSM',
      'Twill Weave Base Material'
    ],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Deepak Joshi',
    
    serviceRequirements: {
      serviceType: 'printing',
      materialType: 'Polyester Fabric',
      quantity: 3000,
      unit: 'meters',
      customerSpecifications: {
        colors: ['Red', 'Blue', 'Green', 'Yellow']
      },
      deliveryTimeline: '7 days from material approval',
      specialInstructions: 'Multi-color digital print with high resolution'
    },
    
    items: [{
      itemCode: 'SVC-PRT-001',
      description: 'Digital Printing Service - Multi-color Design',
      hsnCode: '9988',
      quantity: 3000,
      unit: 'meters',
      rate: 32,
      discount: 0,
      taxableAmount: 96000
    }]
  },

  // New JobOrders for WorkOrder Creation Testing
  {
    id: 'JO-2025-004',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'dyeing',
    creditTerms: 30,
    quoteId: 'QT-JO-004',
    businessProfileId: 'bp-rajkot-textiles',
    advancePaymentId: 'PAY-JO-004-ADV',
    orderDate: '2025-11-10',
    deliveryDate: '2025-11-17',
    totalAmount: 72000,
    status: 'materials_pending',
    statusMessage: 'Awaiting customer fabric for dyeing service',
    paymentStatus: 'advance_received',
    urgency: 'normal',
    progressPercentage: 25,
    
    expectedClientMaterialNames: [
      'Cotton Fabric - Grey 180 GSM',
      'Cotton Fabric - Plain Weave 160 GSM'
    ],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Rajesh Agarwal',
    
    serviceRequirements: {
      serviceType: 'dyeing',
      materialType: 'Cotton Grey Fabric',
      quantity: 2400,
      unit: 'meters',
      customerSpecifications: {
        colors: ['Red', 'Blue']
      },
      deliveryTimeline: '5 days from material receipt',
      specialInstructions: 'Two-color dyeing - separate lots for each color'
    },
    
    items: [{
      itemCode: 'SVC-DYE-002',
      description: 'Reactive Dyeing Service - Red & Blue (Dual Color)',
      hsnCode: '9988',
      quantity: 2400,
      unit: 'meters',
      rate: 30,
      discount: 0,
      taxableAmount: 72000
    }]
  },

  {
    id: 'JO-2025-005',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'finishing',
    creditTerms: 30,
    quoteId: 'QT-JO-005',
    businessProfileId: 'bp-vadodara-mills',
    advancePaymentId: 'PAY-JO-005-ADV',
    orderDate: '2025-11-08',
    deliveryDate: '2025-11-18',
    totalAmount: 105000,
    status: 'materials_pending',
    statusMessage: 'Customer fabric received - ready for processing',
    paymentStatus: 'advance_received',
    urgency: 'urgent',
    progressPercentage: 35,
    
    expectedClientMaterialNames: [
      'Cotton Dyed Fabric - Blue 200 GSM',
      'Cotton Dyed Fabric - Red 180 GSM'
    ],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Mehul Shah',
    
    serviceRequirements: {
      serviceType: 'finishing',
      materialType: 'Cotton Dyed Fabric',
      quantity: 3500,
      unit: 'meters',
      customerSpecifications: {
        finishType: ['Anti-wrinkle', 'Softening', 'Water-repellent']
      },
      deliveryTimeline: '8 days from material receipt',
      specialInstructions: 'Premium finishing - export quality standards required'
    },
    
    items: [{
      itemCode: 'SVC-FIN-001',
      description: 'Premium Finishing Service - Multi-treatment',
      hsnCode: '9988',
      quantity: 3500,
      unit: 'meters',
      rate: 30,
      discount: 0,
      taxableAmount: 105000
    }]
  },

  {
    id: 'JO-2025-006',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'printing',
    creditTerms: 45,
    quoteId: 'QT-JO-006',
    businessProfileId: 'bp-bharuch-printers',
    advancePaymentId: 'PAY-JO-006-ADV',
    orderDate: '2025-11-12',
    deliveryDate: '2025-11-25',
    totalAmount: 144000,
    status: 'materials_pending',
    statusMessage: 'Premium digital printing - awaiting customer fabric',
    paymentStatus: 'advance_received',
    urgency: 'urgent',
    progressPercentage: 20,
    
    expectedClientMaterialNames: [
      'Polyester Fabric - White 150 GSM',
      'Polyester Fabric - Premium 180 GSM'
    ],
    creditApprovalStatus: 'approved',
    creditApprovalBy: 'Priya Desai',
    
    serviceRequirements: {
      serviceType: 'printing',
      materialType: 'Polyester Fabric',
      quantity: 4000,
      unit: 'meters',
      customerSpecifications: {
        colors: ['Royal Blue', 'Gold', 'White', 'Silver'],
        printType: ['Digital printing'],
        designComplexity: 'Complex geometric patterns',
        printQuality: 'Export quality'
      },
      deliveryTimeline: '10 days from material receipt',
      specialInstructions: 'High-resolution digital printing with precise color matching'
    },
    
    items: [{
      itemCode: 'SVC-PRT-002',
      description: 'Digital Printing Service - 4-Color Premium Design',
      hsnCode: '9988',
      quantity: 4000,
      unit: 'meters',
      rate: 36,
      discount: 0,
      taxableAmount: 144000
    }]
  }
];

// ==================== FINANCIAL MANAGEMENT MOCK DATA ====================

// Mock Receivables with Aging Analysis
export const mockReceivables: ReceivableRecord[] = [
  {
    id: 'REC-001',
    invoiceId: 'INV-2024-089',
    customerId: 'bp-surat-dye-works',
    customerName: 'Rajesh Agarwal',
    companyName: 'Surat Dye Works Pvt. Ltd.',
    invoiceNumber: 'INV-2024-089',
    invoiceDate: '2024-09-15',
    dueDate: '2024-10-15',
    originalAmount: 48000,
    receivedAmount: 0,
    balanceAmount: 48000,
    daysPastDue: 17,
    agingCategory: '31-60',
    orderType: 'job_order',
    orderId: 'JO-2025-001',
    orderDescription: 'Reactive Dyeing Service - Navy Blue',
    creditLimit: 200000,
    totalOutstanding: 75000,
    creditUtilization: 37.5,
    customerRisk: 'medium',
    paymentHistory: 'good',
    lastPaymentDate: '2024-08-20',
    averagePaymentDays: 35,
    remindersSent: 2,
    lastReminderDate: '2024-10-20',
    nextActionDate: '2024-11-05',
    nextActionType: 'call',
    assignedCollector: 'Priya Sharma',
    paymentStatus: 'overdue'
  },
  
  {
    id: 'REC-003',
    invoiceId: 'INV-2024-067',
    customerId: 'bp-mumbai-exports',
    customerName: 'Deepak Joshi',
    companyName: 'Mumbai Export House',
    invoiceNumber: 'INV-2024-067',
    invoiceDate: '2024-07-20',
    dueDate: '2024-08-19',
    originalAmount: 180000,
    receivedAmount: 0,
    balanceAmount: 180000,
    daysPastDue: 74,
    agingCategory: '61-90',
    orderType: 'job_order',
    orderId: 'JO-2025-008',
    orderDescription: 'Digital Printing Service - Multi-color Design',
    creditLimit: 300000,
    totalOutstanding: 280000,
    creditUtilization: 93.3,
    customerRisk: 'high',
    paymentHistory: 'poor',
    averagePaymentDays: 65,
    remindersSent: 5,
    lastReminderDate: '2024-10-25',
    nextActionDate: '2024-11-10',
    nextActionType: 'legal',
    assignedCollector: 'Suresh Kumar',
    paymentStatus: 'collection'
  },
  
  {
    id: 'REC-004',
    invoiceId: 'INV-2024-095',
    customerId: 'bp-coimbatore-mills',
    customerName: 'Lakshmi Narayan',
    companyName: 'Coimbatore Cotton Mills',
    invoiceNumber: 'INV-2024-095',
    invoiceDate: '2024-10-20',
    dueDate: '2024-11-19',
    originalAmount: 85000,
    receivedAmount: 0,
    balanceAmount: 85000,
    daysPastDue: -18,
    agingCategory: 'current',
    orderType: 'job_order',
    orderId: 'JO-2025-012',
    orderDescription: 'Bleaching & Finishing Services',
    creditLimit: 150000,
    totalOutstanding: 85000,
    creditUtilization: 56.7,
    customerRisk: 'low',
    paymentHistory: 'good',
    averagePaymentDays: 25,
    remindersSent: 0,
    nextActionDate: '2024-11-15',
    nextActionType: 'reminder',
    paymentStatus: 'pending'
  },
  
  // Phase 2 Day 14: Job Order Receivables for Financial Chain
  // Linked to enhanced service invoices with new service-specific fields
  {
    id: 'REC-JO-001',
    invoiceId: 'INV-JO-2025-001', // Links to enhanced service invoice
    customerId: 'bp-surat-dye-works',
    customerName: 'Ramesh Kumar',
    companyName: 'Surat Dye Works',
    
    invoiceNumber: 'INV-JO-2025-001',
    invoiceDate: '2024-10-22',
    dueDate: '2024-11-21',
    originalAmount: 56640,
    receivedAmount: 56640, // Paid as per enhanced invoice
    balanceAmount: 0,
    
    // Credit-based aging (different from advance-based sales)
    daysPastDue: -17, // Still current (17 days to due date)
    agingCategory: 'current',
    
    // Job order specific fields
    orderType: 'job_order',
    orderId: 'JO-2025-001',
    orderDescription: 'Reactive Dyeing Service - Navy Blue Premium Grade',
    
    creditLimit: 200000,
    totalOutstanding: 0, // Paid
    creditUtilization: 0.0,
    customerRisk: 'low',
    paymentHistory: 'excellent',
    lastPaymentDate: '2024-11-15',
    averagePaymentDays: 24,
    remindersSent: 0,
    nextActionDate: undefined,
    nextActionType: undefined,
    paymentStatus: 'paid'
  },
  
  // Additional service quote receivables  
  {
    id: 'REC-JO-002',
    invoiceId: 'INV-JO-2025-002',
    customerId: 'bp-ahmedabad-finishers',
    customerName: 'Arvind Patel',
    companyName: 'Advanced Textile Finishers',
    
    invoiceNumber: 'INV-JO-2025-002',
    invoiceDate: '2024-10-25',
    dueDate: '2024-11-09',
    originalAmount: 84000,
    receivedAmount: 0,
    balanceAmount: 84000,
    
    daysPastDue: -5, // Due in 5 days
    agingCategory: 'current',
    
    orderType: 'job_order',
    orderId: 'JO-2025-002',
    orderDescription: 'Finishing Services - Softening & Anti-wrinkle',
    
    creditLimit: 150000,
    totalOutstanding: 84000,
    creditUtilization: 56.0,
    customerRisk: 'medium',
    paymentHistory: 'good',
    averagePaymentDays: 28,
    remindersSent: 1,
    lastReminderDate: '2024-11-01',
    nextActionDate: '2024-11-08',
    nextActionType: 'call',
    paymentStatus: 'pending'
  }
];

// Mock Payables - Vendor payment management
export const mockPayables: PayableRecord[] = [];

// PHASE 1.1: Quote Migration Utility - Add revision tracking fields to existing quotes
function migrateQuotesToRevisionSystem() {
  mockQuotes.forEach(quote => {
    if (!quote.hasOwnProperty('revisionNumber')) {
      quote.revisionNumber = 1;
    }
    if (!quote.hasOwnProperty('isActive')) {
      quote.isActive = true;
    }
    // leadQuoteState removed - using lead conversionStatus as single source of truth
  });
}

// Auto-migrate quotes on module load
migrateQuotesToRevisionSystem();

