# Job Order System + Financial Module + Inventory Management - Complete Implementation Plan

## Executive Summary

This document outlines the comprehensive frontend MVP implementation to transform the 360° Business Platform into a complete MSME textile processing system. The plan extends existing mock data and UI components to support Job Order processing, Financial management (Receivables/Payables), and Inventory management - all targeting the larger MSME market while maintaining existing Sales Order functionality.

## Business Context & Market Opportunity

### The MSME Textile Processing Discovery

**Current System**: Designed for large integrated manufacturers (own materials, full production cycle)
**Target Market Reality**: MSME processors providing services on client-owned materials (larger market)

### Key Business Model Differences

| Aspect | Sales Orders (Current) | Job Orders (New Primary) |
|--------|----------------------|---------------------------|
| Material Ownership | Company owns materials | Client owns materials |
| Business Model | Product sales | Service provision |
| Payment Terms | 30% advance + balance | 15-30-45 day credit cycles |
| Procurement Needs | Full MR→PR→PO chain | Chemicals only |
| Credit Management | Advance tracking | Aging & credit limits |
| Inventory Focus | Raw materials for production | Processing chemicals + client materials |
| Market Size | Large integrated mills | MSME processors (significantly larger) |

### System Architecture Benefits

**90% Code Reuse**: Existing production workflows, UI components, and data structures work for both order types
**Progressive Enhancement**: Add features without breaking existing functionality
**Unified Operations**: Same machines, quality control, and delivery processes

## Current System Analysis

### Existing Data Structure (Strong Foundation)

#### BusinessProfile (Customer Management)
```typescript
export interface BusinessProfile {
  // ALREADY EXISTS - Perfect for credit management
  creditLimit: number;
  paymentScore: number; // 1-100 rating
  creditStatus: 'excellent' | 'good' | 'watch' | 'hold' | 'new';
  paymentBehavior: 'excellent' | 'good' | 'fair' | 'poor' | 'new';
  customerStatus: 'prospect' | 'customer' | 'inactive';
}
```

#### Sales Flow (Perfectly Reusable)
```typescript
// Base item structure - WORKS for both order types
export interface QuoteItem {
  itemCode: string;        // "TEX-001" or "SVC-DYE-001"
  description: string;     // "Cotton Fabric" or "Dyeing Service"
  hsnCode: string;         // Goods or Services HSN
  quantity: number;        // 1500 meters or kg
  unit: string;           // "meters", "kg", "pieces"
  rate: number;           // Product price or service rate
  taxableAmount: number;  // Same calculation for both
}

// SalesOrder structure - EXTENDS perfectly for Job Orders
export interface SalesOrder {
  id: string;
  businessProfileId: string;
  items: OrderItem[];               // Same structure!
  totalAmount: number;
  status: 'order_confirmed' | 'production_planning' | '...';
  paymentStatus: 'pending' | 'advance_received' | 'completed';
  // All existing fields work perfectly for both types
}
```

#### Production System (100% Compatible)
```typescript
export interface WorkOrder {
  id: string;
  salesOrderId: string; // Works for both SO and JO
  product: string;      // "Cotton Fabric" or "Dyeing Service"
  status: 'pending' | 'in_progress' | 'completed';
  assignedMachine: string; // Same machines used for both
  // Entire production workflow identical
}
```

### UI Component Compatibility

#### Existing Components (No Changes Required)
- **Production**: `ProductionOrderManagement`, `WorkOrderPlanning`, `QualityControlManagement`
- **Delivery**: `DeliveryFulfillment` and all delivery components
- **Customer**: `CustomerAccountStatementTab`, `Customer360View`
- **Design System**: All ds-card, ds-btn, progressive disclosure patterns

#### Components for Enhancement (Not Replacement)
- **Sales.tsx**: Add Receivables/Payables tabs
- **SalesOrders.tsx**: Add order type indicators
- **LeadManagement.tsx**: Add service requirements support
- **Procurement.tsx**: Add Inventory tab

## Phase 1: Mock Data Structure Extensions

### 1.1 Service-Oriented Interfaces (salesMockData.ts)

#### Service Requirements Interface
```typescript
// Parallel to existing FabricRequirements
export interface ServiceRequirements {
  serviceType: 'dyeing' | 'finishing' | 'printing' | 'bleaching' | 'mercerizing';
  materialType: string;        // "Cotton Grey Fabric", "Polyester Blend"
  quantity: number;           // Quantity of material to process
  unit: 'meters' | 'yards' | 'kg' | 'pieces';
  processSpecifications: {
    colors?: string[];         // For dyeing/printing services
    finishType?: string;       // For finishing processes
    qualityGrade: 'A-Grade' | 'B-Grade' | 'Export-Grade';
    chemicalRequirements?: string[];
    temperatureRange?: string;
    processingTime?: string;   // "24 hours", "3 days"
  };
  deliveryTimeline: string;    // "5 days from material receipt"
  specialInstructions?: string;
}
```

#### Job Order Lead Interface
```typescript
// Extends existing Lead interface
export interface JobOrderLead extends Lead {
  // Inherits ALL existing fields from Lead interface
  serviceRequirements?: ServiceRequirements;  // Instead of fabricRequirements
  
  // Client material estimation
  clientMaterialDetails?: {
    materialType: string;
    estimatedQuantity: number;
    unit: string;
    currentLocation?: string;
    qualityGrade?: string;
    expectedReceiptDate?: string;
  };
  
  // Service-specific lead information
  processingUrgency?: 'standard' | 'urgent' | 'critical';
  repeatCustomer?: boolean;
}
```

#### Job Order Interface
```typescript
// Extends existing SalesOrder with minimal additions
export interface JobOrder extends SalesOrder {
  // Differentiator fields
  orderType: 'job_order';                    // Key differentiator
  materialOwnership: 'client';               // Always client for job orders
  
  // Service-specific fields
  serviceType: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  creditTerms: 15 | 30 | 45;                // Credit days instead of advance %
  
  // Client material tracking
  clientMaterials: ClientMaterialInward[];
  clientMaterialsReceived: boolean;
  
  // Credit management (leverages existing BusinessProfile)
  creditApprovalStatus: 'approved' | 'pending' | 'requires_review';
  creditApprovalBy?: string;
  creditHoldReason?: string;
  
  // Service delivery tracking
  serviceStartDate?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  
  // INHERITS ALL EXISTING SALESORDER FIELDS:
  // - id, businessProfileId, orderDate, deliveryDate
  // - items: OrderItem[] (same structure works perfectly!)
  // - totalAmount, status, paymentStatus, etc.
}

// Enhanced SalesOrder (for comparison)
export interface SalesOrder {
  orderType: 'sales_order';                 // Differentiator field
  materialOwnership: 'company';             // Always company for sales
  // ... all existing fields remain unchanged
}
```

#### Client Material Management
```typescript
export interface ClientMaterialInward {
  id: string;
  jobOrderId: string;
  materialType: string;
  description: string;           // "Cotton Grey Fabric - 180 GSM"
  receivedQuantity: number;
  unit: string;
  receivedDate: string;
  receivedBy: string;            // Employee name
  
  // Quality assessment
  qualityCheck: {
    inspector: string;
    inspectionDate: string;
    gradeAssigned: 'A-Grade' | 'B-Grade' | 'C-Grade' | 'Rejected';
    defectsNoted?: string[];
    defectPercentage?: number;
    photosPath?: string[];       // Quality check photos
    approvalStatus: 'approved' | 'conditional' | 'rejected';
  };
  
  // Storage and tracking
  storageLocation: string;       // "Warehouse B - Section 3"
  batchNumber?: string;
  currentBalance: number;        // Tracks consumption during processing
  
  // Processing status
  status: 'received' | 'in_process' | 'processing_complete' | 'ready_return';
  
  // Material balance tracking
  consumedQuantity?: number;     // Used in processing
  wasteQuantity?: number;        // Process waste
  returnableQuantity?: number;   // Remaining for return
  finalProductQuantity?: number; // Completed processed material
}

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
```

### 1.2 Financial Management Interfaces

#### Receivables with Aging Analysis
```typescript
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
  paymentStatus: 'pending' | 'partial' | 'overdue' | 'collection' | 'written_off';
  paymentPlan?: {
    planActive: boolean;
    installmentAmount: number;
    nextInstallmentDate: string;
    remainingInstallments: number;
  };
}
```

#### Payables Management
```typescript
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
```

### 1.3 Enhanced Inventory Management

#### Comprehensive Inventory Interface
```typescript
export interface InventoryRecord {
  id: string;
  materialCode: string;          // "CHM-DYE-001", "YRN-COT-30S"
  materialName: string;
  description: string;
  
  // Categorization
  category: 'yarn' | 'chemicals' | 'dyes' | 'accessories' | 'packaging';
  subCategory: string;           // "Cotton Yarn", "Reactive Dyes", "Finishing Chemicals"
  
  // Stock management
  onHandStock: number;
  unit: string;
  reorderLevel: number;
  maxStock: number;              // Maximum storage capacity
  safetyStock: number;           // Buffer stock
  
  // Cost management
  costPerUnit: number;
  averageCostPerUnit: number;    // Weighted average
  lastPurchasePrice: number;
  totalValue: number;            // onHandStock * averageCostPerUnit
  
  // Location and organization
  primaryLocation: string;       // "Warehouse A - Section 2"
  alternateLocations?: string[]; // Multiple storage locations
  binLocation?: string;          // Specific bin/rack location
  
  // Stock status analysis
  stockStatus: 'healthy' | 'low' | 'critical' | 'out_of_stock' | 'excess';
  daysSinceLastMovement: number;
  turnoverRate: number;          // How fast inventory moves
  
  // Ownership tracking (KEY for job orders)
  materialOwnership: 'company' | 'client';
  clientId?: string;             // If client material
  clientName?: string;           // For display purposes
  
  // Quality and specifications
  qualityGrade?: 'A-Grade' | 'B-Grade' | 'Industrial';
  expiryDate?: string;           // For chemicals with shelf life
  batchNumber?: string;
  supplierName?: string;
  
  // Movement tracking
  lastUpdated: string;
  lastReceivedDate?: string;
  lastIssuedDate?: string;
  lastReceivedQuantity?: number;
  lastIssuedQuantity?: number;
  
  // Alerts and notifications
  reorderAlert: boolean;         // Trigger when below reorder level
  expiryAlert: boolean;          // Trigger for expiring materials
  slowMovingAlert: boolean;      // Trigger for slow-moving inventory
  
  // Planning and forecasting
  monthlyConsumption: number;    // Average monthly usage
  leadTimeDays: number;          // Supplier lead time
  economicOrderQuantity: number; // Optimal order quantity
  
  // Notes and special handling
  notes?: string;
  specialHandling?: string;      // "Temperature controlled", "Hazardous"
  storageRequirements?: string;  // Storage conditions
}
```

## Phase 2: Sales Module Enhancement

### 2.1 Sales.tsx Tab Structure Extension

#### Current vs Enhanced Tab Structure
```typescript
// Current
type TabType = 'leads' | 'quotes' | 'orders' | 'invoices';

// Enhanced
type TabType = 'leads' | 'quotes' | 'orders' | 'invoices' | 'receivables' | 'payables';
```

#### Enhanced Filter Configurations
```typescript
const statusFilterConfigs = {
  // Enhanced lead filters (support both types)
  leads: [
    { value: 'all', label: 'All Leads', count: leadCounts.all },
    { value: 'sales_leads', label: '📦 Sales Leads', count: leadCounts.sales },
    { value: 'job_leads', label: '🔧 Job Work Leads', count: leadCounts.jobWork },
    { value: 'hot', label: '🔥 Hot Leads', count: leadCounts.hot },
    { value: 'warm', label: '🔶 Warm Leads', count: leadCounts.warm },
    { value: 'cold', label: '🔵 Cold Leads', count: leadCounts.cold }
  ],
  
  // Enhanced order filters (unified view)
  orders: [
    { value: 'all', label: 'All Orders', count: orderCounts.all },
    { value: 'sales_orders', label: '📦 Sales Orders', count: orderCounts.salesOrders },
    { value: 'job_orders', label: '🔧 Job Orders', count: orderCounts.jobOrders },
    { value: 'production', label: '🟡 In Production', count: orderCounts.production },
    { value: 'completed', label: '✅ Completed', count: orderCounts.completed },
    { value: 'urgent', label: '🔴 Urgent', count: orderCounts.urgent }
  ],
  
  // NEW: Receivables with aging analysis
  receivables: [
    { value: 'all', label: 'All Receivables', count: receivableCounts.all },
    { value: 'current', label: '💚 Current (0-30)', count: receivableCounts.current },
    { value: 'aging_30', label: '🟡 31-60 Days', count: receivableCounts.aging30 },
    { value: 'aging_60', label: '🟠 61-90 Days', count: receivableCounts.aging60 },
    { value: 'overdue', label: '🔴 90+ Days', count: receivableCounts.overdue },
    { value: 'critical', label: '⚠️ Critical Risk', count: receivableCounts.critical }
  ],
  
  // NEW: Payables management
  payables: [
    { value: 'all', label: 'All Payables', count: payableCounts.all },
    { value: 'due_today', label: '🟡 Due Today', count: payableCounts.dueToday },
    { value: 'due_week', label: '📅 Due This Week', count: payableCounts.dueThisWeek },
    { value: 'upcoming', label: '💚 Upcoming', count: payableCounts.upcoming },
    { value: 'overdue', label: '🔴 Overdue', count: payableCounts.overdue },
    { value: 'critical', label: '⚠️ Critical Suppliers', count: payableCounts.critical }
  ]
};
```

### 2.2 New Financial Components

#### ReceivablesManagement.tsx Component
```typescript
interface ReceivablesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
  onShowCustomerProfile?: (customerId: string) => void;
}

function ReceivablesManagement({ filterState, onFilterChange, onShowCustomerProfile }: ReceivablesProps) {
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Credit aging analysis
  const getAgingAnalysis = () => {
    const receivables = mockReceivables.filter(rec => {
      if (filterState === 'current') return rec.agingCategory === 'current';
      if (filterState === 'aging_30') return rec.agingCategory === '31-60';
      if (filterState === 'aging_60') return rec.agingCategory === '61-90';
      if (filterState === 'overdue') return rec.agingCategory === '90+';
      if (filterState === 'critical') return rec.customerRisk === 'critical';
      return true;
    });
    
    return receivables.sort((a, b) => b.daysPastDue - a.daysPastDue);
  };
  
  const renderReceivableCard = (receivable: ReceivableRecord) => (
    <div className={`ds-card ${getAgingCSSClass(receivable.agingCategory)}`}>
      {/* Customer and amount header */}
      <div className="ds-card-header">
        {receivable.customerName} — ₹{formatCurrency(receivable.balanceAmount)}
      </div>
      
      {/* Aging and risk status */}
      <div className="ds-card-status">
        {getAgingIcon(receivable.agingCategory)} {receivable.agingCategory.toUpperCase()} • 
        {getRiskIcon(receivable.customerRisk)} {receivable.customerRisk.toUpperCase()} • 
        {receivable.orderType === 'job_order' ? '🔧 Job Work' : '📦 Sales'}
      </div>
      
      {/* Invoice and timing meta */}
      <div className="ds-card-meta">
        {receivable.invoiceNumber} • Due: {receivable.dueDate} • 
        {receivable.daysPastDue > 0 ? `${receivable.daysPastDue} days overdue` : 'Current'}
      </div>
      
      {/* Expand indicator */}
      <div className="ds-card-expand-indicator">
        {expandedDetails.has(receivable.id) ? 'Less' : 'More'}
      </div>
      
      {/* Expanded details */}
      {expandedDetails.has(receivable.id) && (
        <div className="ds-card-expanded">
          {/* Credit analysis section */}
          <div className="receivables-credit-section">
            <h4>Credit Analysis</h4>
            <p><strong>Credit Limit:</strong> ₹{formatCurrency(receivable.creditLimit)}</p>
            <p><strong>Total Outstanding:</strong> ₹{formatCurrency(receivable.totalOutstanding)}</p>
            <p><strong>Credit Utilization:</strong> {receivable.creditUtilization}%</p>
            <p><strong>Payment History:</strong> {receivable.paymentHistory}</p>
          </div>
          
          {/* Collection workflow section */}
          <div className="receivables-collection-section">
            <h4>Collection Status</h4>
            <p><strong>Reminders Sent:</strong> {receivable.remindersSent}</p>
            <p><strong>Next Action:</strong> {receivable.nextActionType} on {receivable.nextActionDate}</p>
            {receivable.assignedCollector && (
              <p><strong>Assigned To:</strong> {receivable.assignedCollector}</p>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="receivables-actions">
            <button className="ds-btn ds-btn-secondary">Send Reminder</button>
            <button className="ds-btn ds-btn-secondary">Schedule Call</button>
            <button className="ds-btn ds-btn-primary">Record Payment</button>
            <button className="ds-btn ds-btn-secondary">Customer Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### PayablesManagement.tsx Component
```typescript
interface PayablesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function PayablesManagement({ filterState, onFilterChange }: PayablesProps) {
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  const getFilteredPayables = () => {
    return mockPayables.filter(payable => {
      if (filterState === 'due_today') return payable.daysToDue === 0;
      if (filterState === 'due_week') return payable.daysToDue >= 0 && payable.daysToDue <= 7;
      if (filterState === 'upcoming') return payable.daysToDue > 7;
      if (filterState === 'overdue') return payable.daysToDue < 0;
      if (filterState === 'critical') return payable.criticalSupplier;
      return true;
    }).sort((a, b) => a.daysToDue - b.daysToDue);
  };
  
  const renderPayableCard = (payable: PayableRecord) => (
    <div className={`ds-card ${getPayableStatusClass(payable.status)}`}>
      {/* Vendor and amount header */}
      <div className="ds-card-header">
        {payable.vendorName} — ₹{formatCurrency(payable.balanceAmount)}
      </div>
      
      {/* Status and category */}
      <div className="ds-card-status">
        {getPayableStatusIcon(payable.status)} {payable.status.replace('_', ' ').toUpperCase()} • 
        {getCategoryIcon(payable.category)} {payable.category.replace('_', ' ')} • 
        {payable.criticalSupplier ? '⚠️ Critical' : '📋 Standard'}
      </div>
      
      {/* Due date and timing meta */}
      <div className="ds-card-meta">
        {payable.billNumber} • Due: {payable.dueDate} • 
        {payable.daysToDue >= 0 ? `${payable.daysToDue} days remaining` : `${Math.abs(payable.daysToDue)} days overdue`}
      </div>
      
      {/* Expanded details for payment planning */}
      {expandedDetails.has(payable.id) && (
        <div className="ds-card-expanded">
          {/* Payment details */}
          <div className="payables-payment-section">
            <h4>Payment Details</h4>
            <p><strong>Payment Method:</strong> {payable.paymentMethod}</p>
            <p><strong>Payment Terms:</strong> {payable.paymentTerms}</p>
            {payable.earlyPaymentDiscount && (
              <p><strong>Early Payment Discount:</strong> {payable.earlyPaymentDiscount}%</p>
            )}
          </div>
          
          {/* Vendor relationship */}
          <div className="payables-vendor-section">
            <h4>Vendor Information</h4>
            <p><strong>Vendor Rating:</strong> {payable.vendorRating}</p>
            <p><strong>Vendor Type:</strong> {payable.vendorType.replace('_', ' ')}</p>
            <p><strong>Priority:</strong> {payable.priority}</p>
          </div>
          
          {/* Action buttons */}
          <div className="payables-actions">
            <button className="ds-btn ds-btn-primary">Schedule Payment</button>
            <button className="ds-btn ds-btn-secondary">Request Approval</button>
            <button className="ds-btn ds-btn-secondary">Vendor Details</button>
            <button className="ds-btn ds-btn-secondary">Payment History</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Phase 3: Procurement Module Enhancement (Inventory Tab)

### 3.1 Procurement.tsx Tab Structure Extension

#### Current vs Enhanced Procurement Tabs
```typescript
// Current Procurement tabs
type ProcurementTabType = 'purchase' | 'grn' | 'suppliers';

// Enhanced Procurement tabs
type ProcurementTabType = 'purchase' | 'grn' | 'inventory' | 'suppliers';
```

#### Inventory Filter Configuration
```typescript
const procurementFilterConfigs = {
  // Existing filters for purchase, grn, suppliers...
  
  // NEW: Comprehensive inventory filters
  inventory: [
    { value: 'all', label: 'All Materials', count: inventoryCounts.all },
    { value: 'company', label: '🏢 Company Materials', count: inventoryCounts.company },
    { value: 'client', label: '👤 Client Materials', count: inventoryCounts.client },
    { value: 'yarn', label: '🧶 Yarns', count: inventoryCounts.yarn },
    { value: 'chemicals', label: '🧪 Chemicals', count: inventoryCounts.chemicals },
    { value: 'dyes', label: '🎨 Dyes', count: inventoryCounts.dyes },
    { value: 'low_stock', label: '⚠️ Low Stock', count: inventoryCounts.lowStock },
    { value: 'out_of_stock', label: '🔴 Out of Stock', count: inventoryCounts.outOfStock },
    { value: 'excess', label: '📈 Excess Stock', count: inventoryCounts.excess },
    { value: 'expiring', label: '⏰ Expiring Soon', count: inventoryCounts.expiring }
  ]
};
```

### 3.2 InventoryManagement.tsx Component

#### Comprehensive Inventory Management
```typescript
interface InventoryProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function InventoryManagement({ filterState, onFilterChange }: InventoryProps) {
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [stockUpdateModal, setStockUpdateModal] = useState<{isOpen: boolean, item?: InventoryRecord}>({isOpen: false});
  
  const getFilteredInventory = () => {
    return mockInventory.filter(item => {
      if (filterState === 'company') return item.materialOwnership === 'company';
      if (filterState === 'client') return item.materialOwnership === 'client';
      if (filterState === 'yarn') return item.category === 'yarn';
      if (filterState === 'chemicals') return item.category === 'chemicals';
      if (filterState === 'dyes') return item.category === 'dyes';
      if (filterState === 'low_stock') return item.stockStatus === 'low' || item.stockStatus === 'critical';
      if (filterState === 'out_of_stock') return item.stockStatus === 'out_of_stock';
      if (filterState === 'excess') return item.stockStatus === 'excess';
      if (filterState === 'expiring') return item.expiryAlert;
      return true;
    }).sort((a, b) => {
      // Priority sort: critical -> low -> healthy
      const statusPriority = { 'critical': 0, 'out_of_stock': 1, 'low': 2, 'healthy': 3, 'excess': 4 };
      return statusPriority[a.stockStatus] - statusPriority[b.stockStatus];
    });
  };
  
  const renderInventoryCard = (item: InventoryRecord) => (
    <div className={`ds-card ${getStockStatusClass(item.stockStatus)}`}>
      {/* Material name and stock level header */}
      <div className="ds-card-header">
        {item.materialName} — {item.onHandStock} {item.unit}
      </div>
      
      {/* Stock status and ownership */}
      <div className="ds-card-status">
        {getStockStatusIcon(item.stockStatus)} {item.stockStatus.replace('_', ' ').toUpperCase()} • 
        {item.materialOwnership === 'client' ? '👤 Client Material' : '🏢 Company Stock'} • 
        {getCategoryIcon(item.category)} {item.category.toUpperCase()}
      </div>
      
      {/* Location and value meta */}
      <div className="ds-card-meta">
        {item.primaryLocation} • ₹{formatCurrency(item.totalValue)} • 
        {item.materialOwnership === 'client' ? item.clientName : `Reorder: ${item.reorderLevel} ${item.unit}`}
      </div>
      
      {/* Stock level indicator */}
      <div className="inventory-stock-indicator">
        <div className="stock-bar">
          <div 
            className={`stock-fill ${getStockFillClass(item.stockStatus)}`}
            style={{width: `${Math.min((item.onHandStock / item.maxStock) * 100, 100)}%`}}
          />
        </div>
        <div className="stock-numbers">
          {item.onHandStock} / {item.maxStock} {item.unit}
        </div>
      </div>
      
      {/* Expanded details */}
      {expandedDetails.has(item.id) && (
        <div className="ds-card-expanded">
          {/* Stock analysis section */}
          <div className="inventory-analysis-section">
            <h4>Stock Analysis</h4>
            <div className="inventory-grid">
              <p><strong>Current Stock:</strong> {item.onHandStock} {item.unit}</p>
              <p><strong>Reorder Level:</strong> {item.reorderLevel} {item.unit}</p>
              <p><strong>Safety Stock:</strong> {item.safetyStock} {item.unit}</p>
              <p><strong>Max Capacity:</strong> {item.maxStock} {item.unit}</p>
              <p><strong>Monthly Usage:</strong> {item.monthlyConsumption} {item.unit}</p>
              <p><strong>Days of Stock:</strong> {Math.round(item.onHandStock / (item.monthlyConsumption / 30))} days</p>
            </div>
          </div>
          
          {/* Cost and value section */}
          <div className="inventory-cost-section">
            <h4>Cost Information</h4>
            <div className="inventory-grid">
              <p><strong>Current Cost/Unit:</strong> ₹{item.costPerUnit}</p>
              <p><strong>Average Cost/Unit:</strong> ₹{item.averageCostPerUnit}</p>
              <p><strong>Total Value:</strong> ₹{formatCurrency(item.totalValue)}</p>
              <p><strong>Last Purchase Price:</strong> ₹{item.lastPurchasePrice}</p>
            </div>
          </div>
          
          {/* Location and movement section */}
          <div className="inventory-location-section">
            <h4>Location & Movement</h4>
            <div className="inventory-grid">
              <p><strong>Primary Location:</strong> {item.primaryLocation}</p>
              {item.binLocation && <p><strong>Bin Location:</strong> {item.binLocation}</p>}
              <p><strong>Last Movement:</strong> {item.daysSinceLastMovement} days ago</p>
              <p><strong>Turnover Rate:</strong> {item.turnoverRate}x per year</p>
            </div>
          </div>
          
          {/* Client material section (if applicable) */}
          {item.materialOwnership === 'client' && (
            <div className="inventory-client-section">
              <h4>Client Material Details</h4>
              <div className="inventory-grid">
                <p><strong>Client:</strong> {item.clientName}</p>
                <p><strong>Quality Grade:</strong> {item.qualityGrade}</p>
                {item.batchNumber && <p><strong>Batch Number:</strong> {item.batchNumber}</p>}
                <p><strong>Received Date:</strong> {item.lastReceivedDate}</p>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="inventory-actions">
            <button 
              className="ds-btn ds-btn-primary"
              onClick={() => setStockUpdateModal({isOpen: true, item})}
            >
              Update Stock
            </button>
            <button className="ds-btn ds-btn-secondary">View Movement History</button>
            <button className="ds-btn ds-btn-secondary">Generate Report</button>
            {item.stockStatus === 'low' || item.stockStatus === 'critical' ? (
              <button className="ds-btn ds-btn-warning">Create Purchase Request</button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="inventory-management">
      {/* Inventory overview dashboard */}
      <div className="inventory-dashboard">
        <div className="inventory-metrics">
          <div className="metric-card">
            <h3>Total Materials</h3>
            <p className="metric-value">{mockInventory.length}</p>
          </div>
          <div className="metric-card critical">
            <h3>Critical Stock</h3>
            <p className="metric-value">{mockInventory.filter(i => i.stockStatus === 'critical').length}</p>
          </div>
          <div className="metric-card">
            <h3>Total Value</h3>
            <p className="metric-value">₹{formatCurrency(mockInventory.reduce((sum, item) => sum + item.totalValue, 0))}</p>
          </div>
          <div className="metric-card">
            <h3>Client Materials</h3>
            <p className="metric-value">{mockInventory.filter(i => i.materialOwnership === 'client').length}</p>
          </div>
        </div>
      </div>
      
      {/* Inventory cards */}
      <div className="inventory-cards">
        {getFilteredInventory().map(item => renderInventoryCard(item))}
      </div>
      
      {/* Stock update modal */}
      {stockUpdateModal.isOpen && (
        <StockUpdateModal 
          item={stockUpdateModal.item}
          onClose={() => setStockUpdateModal({isOpen: false})}
          onUpdate={(updatedItem) => {
            // Update stock logic
            setStockUpdateModal({isOpen: false});
          }}
        />
      )}
    </div>
  );
}
```

## Phase 4: Order Processing Unification

### 4.1 SalesOrders.tsx Enhancement for Dual Order Types

#### Unified Order Display with Type Differentiation
```typescript
// Enhanced SalesOrders component
function SalesOrders({ filterState, onFilterChange }: SalesOrdersProps) {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Unified order processing - combines Sales Orders and Job Orders
  const getAllOrders = (): UnifiedOrderRecord[] => {
    const salesOrders = mockSalesOrders.map(order => ({
      ...order,
      orderType: 'sales_order' as const,
      materialOwnership: 'company' as const
    }));
    
    const jobOrders = mockJobOrders.map(order => ({
      ...order,
      orderType: 'job_order' as const,
      materialOwnership: 'client' as const
    }));
    
    return [...salesOrders, ...jobOrders].sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  };
  
  // Enhanced filtering for unified order types
  const getFilteredOrders = () => {
    const allOrders = getAllOrders();
    
    return allOrders.filter(order => {
      if (filterState === 'sales_orders') return order.orderType === 'sales_order';
      if (filterState === 'job_orders') return order.orderType === 'job_order';
      if (filterState === 'production') return order.status.includes('production');
      if (filterState === 'completed') return order.status === 'completed';
      if (filterState === 'urgent') return order.urgency === 'urgent' || order.urgency === 'critical';
      return true;
    });
  };
  
  // Enhanced order description for both types
  const getOrderDescription = (order: UnifiedOrderRecord): string => {
    if (order.orderType === 'job_order') {
      const jobOrder = order as JobOrder;
      return `${jobOrder.serviceType} service - ${getOrderItemsHeader(order)}`;
    } else {
      return getOrderItemsHeader(order);
    }
  };
  
  // Enhanced payment terms display
  const getPaymentTermsDisplay = (order: UnifiedOrderRecord): string => {
    if (order.orderType === 'job_order') {
      const jobOrder = order as JobOrder;
      return `${jobOrder.creditTerms} days credit`;
    } else {
      return 'Advance payment';
    }
  };
  
  const renderUnifiedOrderCard = (order: UnifiedOrderRecord) => (
    <div 
      className={`ds-card ${order.orderType === 'job_order' ? 'ds-card-job-order' : 'ds-card-sales-order'} ${isExpanded(order.id) ? 'ds-card-expanded' : ''}`}
      data-order-id={order.id}
      onClick={() => toggleDetails(order.id)}
    >
      {/* Order type indicator badge */}
      <div className={`ds-order-type-badge ${order.orderType === 'job_order' ? 'job-order' : 'sales-order'}`}>
        {order.orderType === 'job_order' ? '🔧 Job Work' : '📦 Sales Order'}
      </div>
      
      {/* Enhanced header with company and order description */}
      <div className="ds-card-header">
        {getBusinessProfileById(order.businessProfileId)?.companyName || 'Unknown Company'} — {getOrderDescription(order)}
      </div>
      
      {/* Enhanced status with material ownership and payment terms */}
      <div className="ds-card-status">
        {order.materialOwnership === 'client' ? '👤 Client Material' : '🏢 Company Material'} • 
        {getStatusIcon(order.status)} {order.status.replace('_', ' ')} • 
        {getPaymentStatusIcon(order.paymentStatus)} {order.paymentStatus.replace('_', ' ')}
      </div>
      
      {/* Enhanced meta with payment terms and urgency */}
      <div className="ds-card-meta">
        {getPaymentTermsDisplay(order)} • ₹{formatCurrency(order.totalAmount)} • 
        Due: {order.deliveryDate} • 
        {order.urgency && order.urgency !== 'normal' ? `${getUrgencyIcon(order.urgency)} ${order.urgency}` : 'Standard'}
      </div>
      
      {/* Expand indicator */}
      <div className="ds-card-expand-indicator">
        {isExpanded(order.id) ? 'Less' : 'More'}
      </div>
      
      {/* Expanded details section */}
      {isExpanded(order.id) && (
        <div className="ds-card-expanded">
          {/* Order details section */}
          <div className="order-details-section">
            <h4>Order Information</h4>
            <div className="details-grid">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Order Type:</strong> {order.orderType === 'job_order' ? 'Job Work Order' : 'Sales Order'}</p>
              <p><strong>Order Date:</strong> {order.orderDate}</p>
              <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
              {order.orderType === 'job_order' && (
                <>
                  <p><strong>Service Type:</strong> {(order as JobOrder).serviceType}</p>
                  <p><strong>Credit Terms:</strong> {(order as JobOrder).creditTerms} days</p>
                </>
              )}
            </div>
          </div>
          
          {/* Customer information */}
          <div className="customer-section">
            <h4>Customer Information</h4>
            <div className="details-grid">
              <p><strong>Company:</strong> {getBusinessProfileById(order.businessProfileId)?.companyName}</p>
              <p><strong>Contact:</strong> {getBusinessProfileById(order.businessProfileId)?.contactPerson}</p>
              <p><strong>Phone:</strong> {getBusinessProfileById(order.businessProfileId)?.phone}</p>
              <p><strong>Customer Status:</strong> {getBusinessProfileById(order.businessProfileId)?.customerStatus}</p>
            </div>
          </div>
          
          {/* Order items section */}
          <div className="items-section">
            <h4>Order Items</h4>
            {hasStructuredItems(order) ? (
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-details">
                      <strong>{item.description}</strong> ({item.itemCode})
                    </div>
                    <div className="item-quantity">
                      {item.quantity} {item.unit} × ₹{item.rate} = ₹{formatCurrency(item.taxableAmount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No structured items available</p>
            )}
          </div>
          
          {/* Payment information */}
          <div className="payment-section">
            <h4>Payment Information</h4>
            <div className="details-grid">
              <p><strong>Total Amount:</strong> ₹{formatCurrency(order.totalAmount)}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus.replace('_', ' ')}</p>
              {order.orderType === 'sales_order' ? (
                <>
                  <p><strong>Advance Required:</strong> 30%</p>
                  <p><strong>Balance Payment:</strong> On delivery</p>
                </>
              ) : (
                <>
                  <p><strong>Credit Terms:</strong> {(order as JobOrder).creditTerms} days</p>
                  <p><strong>Payment Due:</strong> {calculatePaymentDueDate(order.deliveryDate, (order as JobOrder).creditTerms)}</p>
                </>
              )}
            </div>
          </div>
          
          {/* Client material section (for job orders) */}
          {order.orderType === 'job_order' && (order as JobOrder).clientMaterials && (
            <div className="client-materials-section">
              <h4>Client Materials</h4>
              <div className="client-materials-list">
                {(order as JobOrder).clientMaterials.map((material, index) => (
                  <div key={index} className="material-row">
                    <div className="material-details">
                      <strong>{material.materialType}</strong>
                    </div>
                    <div className="material-quantity">
                      {material.receivedQuantity} {material.unit} • 
                      Balance: {material.currentBalance} {material.unit} • 
                      Status: {material.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Production status (if applicable) */}
          {order.status.includes('production') && (
            <div className="production-section">
              <h4>Production Status</h4>
              <div className="details-grid">
                <p><strong>Production Status:</strong> {order.productionStatus || 'Planning'}</p>
                <p><strong>Progress:</strong> {order.progressPercentage || 0}%</p>
                {order.expectedDeliveryDate && (
                  <p><strong>Expected Completion:</strong> {order.expectedDeliveryDate}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Action buttons - Enhanced for order types */}
          <div className="order-actions">
            {order.orderType === 'job_order' ? (
              <>
                <button className="ds-btn ds-btn-secondary">Client Material Status</button>
                <button className="ds-btn ds-btn-secondary">Service Progress</button>
                <button className="ds-btn ds-btn-primary">Update Status</button>
                <button className="ds-btn ds-btn-secondary">Credit Analysis</button>
              </>
            ) : (
              <>
                <button className="ds-btn ds-btn-secondary">Production Planning</button>
                <button className="ds-btn ds-btn-secondary">Material Allocation</button>
                <button className="ds-btn ds-btn-primary">Update Status</button>
                <button className="ds-btn ds-btn-secondary">Payment Tracking</button>
              </>
            )}
            <button 
              className="ds-btn ds-btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onShowCustomerProfile?.(order.businessProfileId);
              }}
            >
              Customer Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="sales-orders-management">
      {/* Enhanced order summary dashboard */}
      <div className="orders-dashboard">
        <div className="order-metrics">
          <div className="metric-card">
            <h3>Total Orders</h3>
            <p className="metric-value">{getAllOrders().length}</p>
          </div>
          <div className="metric-card">
            <h3>Sales Orders</h3>
            <p className="metric-value">{getAllOrders().filter(o => o.orderType === 'sales_order').length}</p>
          </div>
          <div className="metric-card">
            <h3>Job Orders</h3>
            <p className="metric-value">{getAllOrders().filter(o => o.orderType === 'job_order').length}</p>
          </div>
          <div className="metric-card">
            <h3>In Production</h3>
            <p className="metric-value">{getAllOrders().filter(o => o.status.includes('production')).length}</p>
          </div>
        </div>
      </div>
      
      {/* Order cards */}
      <div className="orders-container">
        {getFilteredOrders().map(order => renderUnifiedOrderCard(order))}
      </div>
    </div>
  );
}
```

### 4.2 LeadManagement.tsx Enhancement for Service Requirements

#### Enhanced Lead Creation for Both Types
```typescript
// Enhanced AddLeadModal to support both fabric and service requirements
function AddLeadModal({ isOpen, onClose, onAddLead, editingLead }: AddLeadModalProps) {
  const [leadType, setLeadType] = useState<'sales' | 'job_work'>('job_work'); // Default to job work
  const [serviceRequirements, setServiceRequirements] = useState<ServiceRequirements>({
    serviceType: 'dyeing',
    materialType: '',
    quantity: 0,
    unit: 'meters',
    processSpecifications: {
      qualityGrade: 'A-Grade',
      processingTime: ''
    },
    deliveryTimeline: ''
  });
  
  return (
    <div className="add-lead-modal">
      {/* Lead type selection */}
      <div className="lead-type-selection">
        <h3>Lead Type</h3>
        <div className="lead-type-options">
          <label className={`lead-type-option ${leadType === 'sales' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              value="sales" 
              checked={leadType === 'sales'}
              onChange={() => setLeadType('sales')}
            />
            <span className="option-content">
              <span className="option-icon">📦</span>
              <span className="option-text">
                <strong>Sales Lead</strong>
                <small>Customer wants to purchase our products</small>
              </span>
            </span>
          </label>
          
          <label className={`lead-type-option ${leadType === 'job_work' ? 'selected' : ''}`}>
            <input 
              type="radio" 
              value="job_work" 
              checked={leadType === 'job_work'}
              onChange={() => setLeadType('job_work')}
            />
            <span className="option-content">
              <span className="option-icon">🔧</span>
              <span className="option-text">
                <strong>Job Work Lead</strong>
                <small>Customer wants processing services on their material</small>
              </span>
            </span>
          </label>
        </div>
      </div>
      
      {/* Standard lead information fields */}
      {/* ... existing contact, company, budget fields ... */}
      
      {/* Conditional requirements section */}
      {leadType === 'sales' ? (
        <div className="fabric-requirements-section">
          <h3>Fabric Requirements</h3>
          {/* Existing fabric requirements form */}
        </div>
      ) : (
        <div className="service-requirements-section">
          <h3>Service Requirements</h3>
          
          {/* Service type selection */}
          <div className="form-group">
            <label>Service Type</label>
            <select 
              value={serviceRequirements.serviceType}
              onChange={(e) => setServiceRequirements(prev => ({
                ...prev,
                serviceType: e.target.value as ServiceRequirements['serviceType']
              }))}
            >
              <option value="dyeing">Dyeing Services</option>
              <option value="finishing">Finishing Services</option>
              <option value="printing">Printing Services</option>
              <option value="bleaching">Bleaching Services</option>
              <option value="mercerizing">Mercerizing Services</option>
            </select>
          </div>
          
          {/* Material details */}
          <div className="form-row">
            <div className="form-group">
              <label>Material Type</label>
              <input 
                type="text"
                placeholder="e.g., Cotton Grey Fabric"
                value={serviceRequirements.materialType}
                onChange={(e) => setServiceRequirements(prev => ({
                  ...prev,
                  materialType: e.target.value
                }))}
              />
            </div>
            
            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number"
                value={serviceRequirements.quantity}
                onChange={(e) => setServiceRequirements(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value)
                }))}
              />
            </div>
            
            <div className="form-group">
              <label>Unit</label>
              <select 
                value={serviceRequirements.unit}
                onChange={(e) => setServiceRequirements(prev => ({
                  ...prev,
                  unit: e.target.value as ServiceRequirements['unit']
                }))}
              >
                <option value="meters">Meters</option>
                <option value="yards">Yards</option>
                <option value="kg">Kilograms</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>
          </div>
          
          {/* Process specifications based on service type */}
          {serviceRequirements.serviceType === 'dyeing' && (
            <div className="process-specs-dyeing">
              <div className="form-group">
                <label>Colors Required</label>
                <input 
                  type="text"
                  placeholder="e.g., Navy Blue, Dark Green"
                  value={serviceRequirements.processSpecifications.colors?.join(', ') || ''}
                  onChange={(e) => setServiceRequirements(prev => ({
                    ...prev,
                    processSpecifications: {
                      ...prev.processSpecifications,
                      colors: e.target.value.split(',').map(c => c.trim())
                    }
                  }))}
                />
              </div>
            </div>
          )}
          
          {serviceRequirements.serviceType === 'finishing' && (
            <div className="process-specs-finishing">
              <div className="form-group">
                <label>Finish Type</label>
                <select 
                  value={serviceRequirements.processSpecifications.finishType || ''}
                  onChange={(e) => setServiceRequirements(prev => ({
                    ...prev,
                    processSpecifications: {
                      ...prev.processSpecifications,
                      finishType: e.target.value
                    }
                  }))}
                >
                  <option value="">Select finish type</option>
                  <option value="softening">Softening</option>
                  <option value="anti_wrinkle">Anti-wrinkle</option>
                  <option value="water_repellent">Water repellent</option>
                  <option value="flame_retardant">Flame retardant</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Common process specifications */}
          <div className="form-row">
            <div className="form-group">
              <label>Quality Grade</label>
              <select 
                value={serviceRequirements.processSpecifications.qualityGrade}
                onChange={(e) => setServiceRequirements(prev => ({
                  ...prev,
                  processSpecifications: {
                    ...prev.processSpecifications,
                    qualityGrade: e.target.value as ServiceRequirements['processSpecifications']['qualityGrade']
                  }
                }))}
              >
                <option value="A-Grade">A-Grade (Premium)</option>
                <option value="B-Grade">B-Grade (Standard)</option>
                <option value="Export-Grade">Export Grade</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Processing Time Required</label>
              <input 
                type="text"
                placeholder="e.g., 24 hours, 3 days"
                value={serviceRequirements.processSpecifications.processingTime}
                onChange={(e) => setServiceRequirements(prev => ({
                  ...prev,
                  processSpecifications: {
                    ...prev.processSpecifications,
                    processingTime: e.target.value
                  }
                }))}
              />
            </div>
          </div>
          
          {/* Delivery and special instructions */}
          <div className="form-group">
            <label>Delivery Timeline</label>
            <input 
              type="text"
              placeholder="e.g., 5 days from material receipt"
              value={serviceRequirements.deliveryTimeline}
              onChange={(e) => setServiceRequirements(prev => ({
                ...prev,
                deliveryTimeline: e.target.value
              }))}
            />
          </div>
          
          <div className="form-group">
            <label>Special Instructions</label>
            <textarea 
              placeholder="Any special handling or processing requirements..."
              value={serviceRequirements.specialInstructions || ''}
              onChange={(e) => setServiceRequirements(prev => ({
                ...prev,
                specialInstructions: e.target.value
              }))}
              rows={3}
            />
          </div>
        </div>
      )}
      
      {/* Modal actions */}
      <div className="modal-actions">
        <button className="ds-btn ds-btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="ds-btn ds-btn-primary" onClick={handleSubmit}>
          {editingLead ? 'Update Lead' : 'Add Lead'}
        </button>
      </div>
    </div>
  );
}
```

## Phase 5: Production Integration (Minimal Changes)

### 5.1 WorkOrder Enhancement for Material Source Tracking

#### Enhanced WorkOrder Interface (Minimal Addition)
```typescript
// Enhanced WorkOrder with material source tracking
export interface WorkOrder {
  // ALL EXISTING FIELDS REMAIN UNCHANGED
  id: string;
  salesOrderId: string; // Works for both SO and JO
  product: string;      // "Cotton Fabric" or "Dyeing Service"
  customer: string;
  batchNumber: string;
  targetQuantity: string;
  producedQuantity: string;
  remainingQuantity: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'ready_qc';
  assignedMachine: string;
  assignedWorker: string;
  startTime?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  priority: 'normal' | 'urgent' | 'high';
  qualityGrade?: string;
  notes?: string;
  issues?: string[];
  createdDate: string;
  
  // NEW: Material source tracking (minimal addition)
  materialSource: 'company_stock' | 'client_material';
  clientMaterialAllocations?: ClientMaterialAllocation[];
  
  // NEW: Service-specific tracking (for job orders)
  serviceType?: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  serviceSpecifications?: {
    processParameters?: Record<string, any>;
    qualityRequirements?: string[];
    specialInstructions?: string;
  };
}

export interface ClientMaterialAllocation {
  clientMaterialId: string;        // Links to ClientMaterialInward
  allocatedQuantity: number;
  allocatedDate: string;
  allocatedBy: string;
  
  // Consumption tracking
  consumedQuantity: number;
  wasteQuantity: number;
  returnableQuantity: number;
  
  // Process tracking
  processStage: 'allocated' | 'in_process' | 'completed' | 'returned';
  processNotes?: string;
  qualityCheckStatus?: 'pending' | 'passed' | 'failed';
}
```

### 5.2 Production Flow Benefits (Same Processes)

#### Unified Production Workflow Logic
```typescript
// Production planning works for both order types
const createWorkOrderFromOrder = (order: SalesOrder | JobOrder): WorkOrder => {
  const baseWorkOrder = {
    id: generateWorkOrderId(),
    salesOrderId: order.id,
    customer: getBusinessProfileById(order.businessProfileId)?.companyName || '',
    batchNumber: generateBatchNumber(),
    status: 'pending' as const,
    progress: 0,
    createdDate: new Date().toISOString(),
    priority: order.urgency || 'normal'
  };
  
  if (order.orderType === 'job_order') {
    const jobOrder = order as JobOrder;
    return {
      ...baseWorkOrder,
      product: `${jobOrder.serviceType} service`,
      materialSource: 'client_material',
      serviceType: jobOrder.serviceType,
      targetQuantity: `${jobOrder.items.reduce((sum, item) => sum + item.quantity, 0)} units`,
      clientMaterialAllocations: jobOrder.clientMaterials.map(cm => ({
        clientMaterialId: cm.id,
        allocatedQuantity: cm.currentBalance,
        allocatedDate: new Date().toISOString(),
        allocatedBy: 'System',
        consumedQuantity: 0,
        wasteQuantity: 0,
        returnableQuantity: cm.currentBalance,
        processStage: 'allocated' as const
      }))
    };
  } else {
    const salesOrder = order as SalesOrder;
    return {
      ...baseWorkOrder,
      product: getOrderItemsHeader(salesOrder),
      materialSource: 'company_stock',
      targetQuantity: `${salesOrder.items.reduce((sum, item) => sum + item.quantity, 0)} units`
    };
  }
};

// Quality control processes - SAME for both types
const performQualityCheck = (workOrder: WorkOrder): QualityControlResult => {
  // Same quality standards apply regardless of material source
  return {
    workOrderId: workOrder.id,
    inspector: 'QC Team',
    inspectionDate: new Date().toISOString(),
    qualityGrade: workOrder.qualityGrade || 'A-Grade',
    defectsFound: [],
    approvalStatus: 'approved',
    notes: workOrder.materialSource === 'client_material' 
      ? 'Client material processed to specification'
      : 'Company material meets quality standards'
  };
};

// Delivery processes - SAME for both types
const scheduleDelivery = (workOrder: WorkOrder): DeliverySchedule => {
  return {
    workOrderId: workOrder.id,
    scheduledDate: workOrder.estimatedCompletion || '',
    deliveryMethod: 'company_vehicle',
    specialInstructions: workOrder.materialSource === 'client_material'
      ? 'Return processed material and unused balance to client'
      : 'Standard delivery to customer address'
  };
};
```

## Mock Data Generation Strategy

### Realistic Textile Processing Scenarios

#### Job Order Mock Data Examples
```typescript
export const mockJobOrders: JobOrder[] = [
  {
    id: 'JO-2024-001',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'dyeing',
    creditTerms: 30,
    quoteId: 'QT-JO-001',
    businessProfileId: 'bp-surat-dye-works',
    orderDate: '2024-10-15',
    deliveryDate: '2024-10-22',
    totalAmount: 48000,
    status: 'production_started',
    paymentStatus: 'pending',
    creditApprovalStatus: 'approved',
    
    items: [{
      itemCode: 'SVC-DYE-001',
      description: 'Reactive Dyeing Service - Navy Blue',
      hsnCode: '9988', // Service HSN code
      quantity: 2000,
      unit: 'meters',
      rate: 24, // ₹24 per meter processing charge
      discount: 0,
      taxableAmount: 48000
    }],
    
    clientMaterials: [{
      id: 'CM-001',
      jobOrderId: 'JO-2024-001',
      materialType: 'Cotton Grey Fabric - 180 GSM',
      description: 'High-quality cotton grey fabric for dyeing',
      receivedQuantity: 2100, // 5% extra for process allowance
      unit: 'meters',
      receivedDate: '2024-10-14',
      receivedBy: 'Ramesh Kumar',
      qualityCheck: {
        inspector: 'Priya Sharma',
        inspectionDate: '2024-10-14',
        gradeAssigned: 'A-Grade',
        defectsNoted: [],
        defectPercentage: 0.5,
        approvalStatus: 'approved'
      },
      storageLocation: 'Warehouse C - Section 2',
      batchNumber: 'BATCH-CM-001',
      currentBalance: 2050, // Some already allocated to production
      status: 'in_process'
    }],
    
    serviceStartDate: '2024-10-16',
    estimatedCompletionDate: '2024-10-21',
    productionStatus: 'dyeing_in_progress'
  },
  
  {
    id: 'JO-2024-002',
    orderType: 'job_order',
    materialOwnership: 'client',
    serviceType: 'finishing',
    creditTerms: 15,
    quoteId: 'QT-JO-002',
    businessProfileId: 'bp-ahmedabad-finishers',
    orderDate: '2024-10-18',
    deliveryDate: '2024-10-25',
    totalAmount: 36000,
    status: 'order_confirmed',
    paymentStatus: 'pending',
    creditApprovalStatus: 'approved',
    
    items: [{
      itemCode: 'SVC-FIN-001',
      description: 'Softening & Anti-wrinkle Finishing',
      hsnCode: '9988',
      quantity: 1500,
      unit: 'meters',
      rate: 24,
      discount: 0,
      taxableAmount: 36000
    }],
    
    clientMaterials: [{
      id: 'CM-002',
      jobOrderId: 'JO-2024-002',
      materialType: 'Cotton Dyed Fabric - Navy Blue',
      description: 'Pre-dyed cotton fabric for finishing',
      receivedQuantity: 1550,
      unit: 'meters',
      receivedDate: '2024-10-17',
      receivedBy: 'Suresh Patel',
      qualityCheck: {
        inspector: 'Anjali Mehta',
        inspectionDate: '2024-10-17',
        gradeAssigned: 'A-Grade',
        defectsNoted: ['Minor color variation in 2 pieces'],
        defectPercentage: 1.0,
        approvalStatus: 'conditional'
      },
      storageLocation: 'Warehouse A - Section 4',
      batchNumber: 'BATCH-CM-002',
      currentBalance: 1550,
      status: 'received'
    }]
  }
];
```

#### Receivables Mock Data with Aging
```typescript
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
    daysPastDue: 17, // Current date - due date
    agingCategory: '31-60',
    orderType: 'job_order',
    orderId: 'JO-2024-001',
    orderDescription: 'Reactive Dyeing Service - Navy Blue',
    creditLimit: 200000,
    totalOutstanding: 75000, // Including other pending invoices
    creditUtilization: 37.5, // 75000/200000 * 100
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
    id: 'REC-002',
    invoiceId: 'INV-2024-091',
    customerId: 'bp-ahmedabad-traders',
    customerName: 'Kiran Shah',
    companyName: 'Ahmedabad Textile Traders',
    invoiceNumber: 'INV-2024-091',
    invoiceDate: '2024-10-01',
    dueDate: '2024-10-31',
    originalAmount: 125000,
    receivedAmount: 50000,
    balanceAmount: 75000,
    daysPastDue: 1, // Just overdue
    agingCategory: 'current',
    orderType: 'sales_order',
    orderId: 'SO-2024-045',
    orderDescription: 'Premium Cotton Fabric - Export Quality',
    creditLimit: 500000,
    totalOutstanding: 225000,
    creditUtilization: 45.0,
    customerRisk: 'low',
    paymentHistory: 'excellent',
    lastPaymentDate: '2024-10-15', // Partial payment
    averagePaymentDays: 28,
    remindersSent: 1,
    lastReminderDate: '2024-11-01',
    nextActionDate: '2024-11-08',
    nextActionType: 'reminder',
    paymentStatus: 'partial'
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
    daysPastDue: 74, // Seriously overdue
    agingCategory: '61-90',
    orderType: 'job_order',
    orderId: 'JO-2024-008',
    orderDescription: 'Digital Printing Service - Multi-color Design',
    creditLimit: 300000,
    totalOutstanding: 280000, // Multiple overdue invoices
    creditUtilization: 93.3, // Very high utilization
    customerRisk: 'high',
    paymentHistory: 'poor',
    averagePaymentDays: 65, // Consistently late
    remindersSent: 5,
    lastReminderDate: '2024-10-25',
    nextActionDate: '2024-11-10',
    nextActionType: 'legal',
    assignedCollector: 'Suresh Kumar',
    paymentStatus: 'collection'
  }
];
```

#### Enhanced Inventory Mock Data
```typescript
export const mockInventoryEnhanced: InventoryRecord[] = [
  // Company-owned processing chemicals
  {
    id: 'INV-CHM-001',
    materialCode: 'CHM-DYE-RCT-001',
    materialName: 'Reactive Dye - Navy Blue',
    description: 'High-quality reactive dye for cotton dyeing processes',
    category: 'chemicals',
    subCategory: 'Reactive Dyes',
    onHandStock: 85,
    unit: 'kg',
    reorderLevel: 25,
    maxStock: 200,
    safetyStock: 15,
    costPerUnit: 450,
    averageCostPerUnit: 435,
    lastPurchasePrice: 460,
    totalValue: 36975, // 85 * 435
    primaryLocation: 'Chemical Warehouse - Rack A2',
    stockStatus: 'healthy',
    materialOwnership: 'company',
    qualityGrade: 'A-Grade',
    supplierName: 'Colourtex Chemicals Ltd.',
    lastUpdated: '2024-10-31T14:30:00Z',
    lastReceivedDate: '2024-10-15',
    lastIssuedDate: '2024-10-30',
    lastReceivedQuantity: 50,
    lastIssuedQuantity: 12,
    monthlyConsumption: 45,
    leadTimeDays: 7,
    economicOrderQuantity: 75,
    daysSinceLastMovement: 1,
    turnoverRate: 6.35, // 45*12/85 = annual turnover
    reorderAlert: false,
    expiryAlert: false,
    slowMovingAlert: false,
    notes: 'Fast-moving dye for job work orders',
    specialHandling: 'Store in cool, dry place'
  },
  
  {
    id: 'INV-CHM-002',
    materialCode: 'CHM-AUX-SOD-001',
    materialName: 'Caustic Soda (Sodium Hydroxide)',
    description: 'Industrial grade caustic soda for textile processing',
    category: 'chemicals',
    subCategory: 'Auxiliary Chemicals',
    onHandStock: 12,
    unit: 'kg',
    reorderLevel: 50,
    maxStock: 500,
    safetyStock: 25,
    costPerUnit: 45,
    averageCostPerUnit: 42,
    lastPurchasePrice: 48,
    totalValue: 504, // 12 * 42
    primaryLocation: 'Chemical Warehouse - Section B',
    stockStatus: 'critical', // Below reorder level
    materialOwnership: 'company',
    qualityGrade: 'Industrial',
    supplierName: 'Gujarat Alkali & Chemicals',
    lastUpdated: '2024-10-31T09:15:00Z',
    lastReceivedDate: '2024-09-20',
    lastIssuedDate: '2024-10-29',
    lastReceivedQuantity: 100,
    lastIssuedQuantity: 25,
    monthlyConsumption: 120,
    leadTimeDays: 3,
    economicOrderQuantity: 200,
    daysSinceLastMovement: 2,
    turnoverRate: 12.0, // High turnover - essential chemical
    reorderAlert: true,
    expiryAlert: false,
    slowMovingAlert: false,
    notes: 'URGENT: Reorder required for continuous operations',
    specialHandling: 'Hazardous chemical - proper PPE required',
    storageRequirements: 'Separate storage, away from acids'
  },
  
  // Client-owned materials
  {
    id: 'INV-CLIENT-001',
    materialCode: 'CLT-FAB-COT-001',
    materialName: 'Cotton Grey Fabric - Surat Dye Works',
    description: 'Client material - Cotton grey fabric for dyeing',
    category: 'yarn',
    subCategory: 'Cotton Fabrics',
    onHandStock: 2050,
    unit: 'meters',
    reorderLevel: 0, // Not applicable for client materials
    maxStock: 0, // Not applicable for client materials
    safetyStock: 0,
    costPerUnit: 0, // Client-owned, no cost to us
    averageCostPerUnit: 0,
    lastPurchasePrice: 0,
    totalValue: 0,
    primaryLocation: 'Warehouse C - Section 2',
    binLocation: 'Rack C2-15',
    stockStatus: 'healthy',
    materialOwnership: 'client',
    clientId: 'bp-surat-dye-works',
    clientName: 'Surat Dye Works Pvt. Ltd.',
    qualityGrade: 'A-Grade',
    batchNumber: 'BATCH-CM-001',
    lastUpdated: '2024-10-30T16:45:00Z',
    lastReceivedDate: '2024-10-14',
    lastIssuedDate: '2024-10-16', // Issued to production
    lastReceivedQuantity: 2100,
    lastIssuedQuantity: 50, // Allocated to dyeing process
    monthlyConsumption: 0, // We don't "consume" client materials
    leadTimeDays: 0,
    economicOrderQuantity: 0,
    daysSinceLastMovement: 14,
    turnoverRate: 0,
    reorderAlert: false,
    expiryAlert: false,
    slowMovingAlert: false,
    notes: 'Client material for Job Order JO-2024-001 - Navy blue dyeing',
    specialHandling: 'Handle with care - client material'
  },
  
  {
    id: 'INV-YRN-001',
    materialCode: 'YRN-COT-30S-001',
    materialName: 'Cotton Yarn 30s Count',
    description: 'High-quality cotton yarn for weaving',
    category: 'yarn',
    subCategory: 'Cotton Yarn',
    onHandStock: 850,
    unit: 'kg',
    reorderLevel: 200,
    maxStock: 2000,
    safetyStock: 100,
    costPerUnit: 185,
    averageCostPerUnit: 178,
    lastPurchasePrice: 190,
    totalValue: 151300, // 850 * 178
    primaryLocation: 'Yarn Warehouse - Section A1',
    stockStatus: 'healthy',
    materialOwnership: 'company',
    qualityGrade: 'A-Grade',
    supplierName: 'Rajkot Spinning Mills',
    lastUpdated: '2024-10-29T11:20:00Z',
    lastReceivedDate: '2024-10-10',
    lastIssuedDate: '2024-10-28',
    lastReceivedQuantity: 500,
    lastIssuedQuantity: 75,
    monthlyConsumption: 300,
    leadTimeDays: 15,
    economicOrderQuantity: 600,
    daysSinceLastMovement: 3,
    turnoverRate: 4.24, // (300*12)/850
    reorderAlert: false,
    expiryAlert: false,
    slowMovingAlert: false,
    notes: 'Premium quality yarn for export orders'
  }
];
```

## Implementation Timeline & Benefits

### 4-Week Implementation Schedule

#### Week 1: Foundation & Data Structure
- **Days 1-2**: Extend `salesMockData.ts` with all new interfaces
- **Days 3-4**: Create comprehensive mock data for all new functionality
- **Days 5-7**: Test data integrity and relationships

#### Week 2: Sales Module Financial Enhancement
- **Days 8-10**: Implement Receivables and Payables tabs in `Sales.tsx`
- **Days 11-12**: Create `ReceivablesManagement.tsx` component
- **Days 13-14**: Create `PayablesManagement.tsx` component

#### Week 3: Procurement Inventory Integration
- **Days 15-16**: Add Inventory tab to `Procurement.tsx`
- **Days 17-19**: Implement `InventoryManagement.tsx` with full functionality
- **Days 20-21**: Test inventory filtering and client material separation

#### Week 4: Order Unification & Final Integration
- **Days 22-24**: Enhance `SalesOrders.tsx` for dual order types
- **Days 25-26**: Update `LeadManagement.tsx` for service requirements
- **Days 27-28**: Comprehensive testing and refinement

### Business Impact & ROI

#### Market Expansion Potential
1. **MSME Market Access**: Target significantly larger market segment
2. **Service Revenue**: Higher margins on processing services vs product sales
3. **Credit Cycle Management**: Better cash flow control and customer relationships
4. **Inventory Optimization**: Clear separation of company vs client materials

#### Technical Benefits
1. **90% Code Reuse**: Minimal development effort for maximum functionality
2. **Progressive Enhancement**: Zero disruption to existing operations
3. **Scalable Architecture**: Ready for future backend integration
4. **Mobile-First Design**: Optimized for factory floor usage

#### Operational Advantages
1. **Unified Workflows**: Same production processes for both order types
2. **Financial Visibility**: Real-time aging analysis and credit monitoring
3. **Inventory Control**: Comprehensive material tracking and alerts
4. **Customer Insights**: 360° view including credit behavior and payment patterns

### Risk Mitigation & Quality Assurance

#### Technical Risk Management
1. **Incremental Development**: Each phase builds on previous functionality
2. **Component Isolation**: New features don't affect existing workflows
3. **Mock Data Validation**: Comprehensive testing without backend dependencies
4. **UI Consistency**: Maintain existing design system and patterns

#### Business Risk Controls
1. **Credit Limit Enforcement**: Automated checking before order approval
2. **Aging Analysis**: Early warning system for payment issues
3. **Inventory Alerts**: Prevent stockouts and optimize material levels
4. **Client Material Tracking**: Complete audit trail for client-owned materials

#### Implementation Quality Gates
1. **Phase 1**: Data structure validation and mock data integrity
2. **Phase 2**: Financial module functionality and aging calculations
3. **Phase 3**: Inventory management and client material separation
4. **Phase 4**: Order unification and production workflow integration

## Conclusion

This comprehensive implementation plan transforms the 360° Business Platform into a complete MSME textile processing system while maintaining 90% code reuse and zero disruption to existing functionality. The frontend-only approach with enhanced mock data provides:

1. **Complete MVP Functionality**: Full job order processing, credit management, and inventory control
2. **Market Leadership Position**: First-mover advantage in MSME textile processing segment
3. **Technical Excellence**: Progressive enhancement with consistent UI patterns
4. **Business Growth**: Access to larger market with higher service margins
5. **Operational Efficiency**: Unified workflows with enhanced financial visibility

The platform will serve as the comprehensive solution for the entire textile ecosystem, from integrated manufacturers to MSME processors, with job work processing as the primary focus and sales orders as secondary functionality.

This implementation creates a robust, scalable foundation ready for future backend integration while providing immediate business value through superior user experience and comprehensive functionality targeting the high-growth MSME textile processing market.