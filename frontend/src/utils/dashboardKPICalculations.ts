// Dashboard KPI Calculations - Comprehensive Business Intelligence
// Implements the complete KPI structure: Global Business Pulse + 4 Module Sections

import { mockLeads, mockJobOrders, mockFinalInvoices } from '../data/salesMockData';
import { mockWorkOrders, mockQCItems } from '../data/productionMockData';
import { mockBusinessProfiles } from '../data/customerMockData';
import { 
  mockPurchaseOrders, 
  mockGoodsReceiptNotes, 
  mockInwardEntries 
} from '../data/procurementMockData';
import { mockInventory } from '../data/inventoryMockData';

// ==================== GLOBAL BUSINESS PULSE KPIs ====================

export interface GlobalKPIs {
  activeJobOrders: number;
  lotsInProcess: number;  
  billedThisMonth: number;
  outstandingAmount: number;
}

export const calculateGlobalKPIs = (): GlobalKPIs => {
  // 1. Active Job Orders (orders that are not completed/delivered/cancelled)
  const activeJobOrders = mockJobOrders.filter(job => 
    !['completed', 'delivered', 'cancelled'].includes(job.status)
  ).length;

  // 2. Lots in Process (WIP) - Work orders currently being processed
  const lotsInProcess = mockWorkOrders.filter(wo => 
    ['in_progress', 'pending', 'ready_qc'].includes(wo.status)
  ).length;

  // 3. Billed This Month - Total invoiced revenue for current month
  const currentMonth = new Date().getMonth();
  const billedThisMonth = mockFinalInvoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate);
      return invoiceDate.getMonth() === currentMonth;
    })
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  // 4. Outstanding Amount - Unpaid invoice amounts + pending order amounts
  const unpaidInvoices = mockFinalInvoices
    .filter(invoice => invoice.paymentDetails.balanceDue > 0)
    .reduce((sum, invoice) => sum + invoice.paymentDetails.balanceDue, 0);
  
  const pendingOrderPayments = mockJobOrders
    .filter(order => order.paymentStatus?.includes('pending') || order.paymentStatus?.includes('partial'))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const outstandingAmount = unpaidInvoices + pendingOrderPayments;

  return {
    activeJobOrders,
    lotsInProcess,
    billedThisMonth,
    outstandingAmount
  };
};

// ==================== SALES MODULE KPIs ====================

export interface SalesKPIs {
  inquiriesThisMonth: number;
  conversionRate: number;
  jobOrdersThisMonth: number;
  metersInwarded: number;
  unbilledWork: number;
}

export const calculateSalesKPIs = (): SalesKPIs => {
  
  // 1. Inquiries This Month - New leads received this month (simplified for demo)
  const inquiriesThisMonth = Math.floor(mockLeads.length * 0.6); // Approximate 60% as current month

  // 2. Conversion Rate - Inquiry to Job Order conversion
  const totalInquiries = mockLeads.length;
  const convertedInquiries = mockLeads.filter(lead => 
    lead.conversionStatus?.includes('converted')
  ).length;
  const conversionRate = totalInquiries > 0 ? Math.round((convertedInquiries / totalInquiries) * 100) : 0;

  // 3. Job Orders This Month - Orders confirmed this month (simplified for demo)
  const jobOrdersThisMonth = Math.floor(mockJobOrders.length * 0.4); // Approximate 40% as current month

  // 4. Meters Inwarded - Total customer material received
  const metersInwarded = mockInwardEntries.reduce((sum, entry) => {
    if (entry.unit === 'meters' || entry.unit === 'yards') {
      return sum + entry.receivedQuantity;
    }
    return sum;
  }, 0);

  // 5. Unbilled Work - Completed orders not yet invoiced
  const completedNotInvoiced = mockJobOrders.filter(order => 
    ['service_completed', 'ready_for_invoice'].includes(order.status)
  );
  const unbilledWork = completedNotInvoiced.reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    inquiriesThisMonth,
    conversionRate,
    jobOrdersThisMonth,
    metersInwarded,
    unbilledWork
  };
};

// ==================== STORE/PROCUREMENT MODULE KPIs ====================

export interface StoreKPIs {
  lowStockItems: number;
  outOfStockItems: number;
  materialInwardThisMonth: number;
  purchaseOrdersRaised: number;
  purchaseOrdersPending: number;
}

export const calculateStoreKPIs = (): StoreKPIs => {
  // 1. Low Stock Items - Items below reorder level
  const lowStockItems = mockInventory.filter(item => {
    const reorderLevel = item.reorderLevel || 0;
    return item.onHandStock <= reorderLevel && item.onHandStock > 0;
  }).length;

  // 2. Out of Stock Items - Items with zero stock
  const outOfStockItems = mockInventory.filter(item => 
    item.onHandStock === 0
  ).length;

  // 3. Material Inward This Month - GRNs + Inward entries (simplified for demo)
  const materialInwardThisMonth = Math.floor((mockGoodsReceiptNotes.length + mockInwardEntries.length) * 0.3);

  // 4. Purchase Orders Raised - Total POs created this month (simplified for demo)
  const purchaseOrdersRaised = Math.floor(mockPurchaseOrders.length * 0.5);

  // 5. Purchase Orders Pending Delivery
  const purchaseOrdersPending = mockPurchaseOrders.filter(po => 
    po.status === 'open'
  ).length;

  return {
    lowStockItems,
    outOfStockItems,
    materialInwardThisMonth,
    purchaseOrdersRaised,
    purchaseOrdersPending
  };
};

// ==================== PROCESS/PRODUCTION MODULE KPIs ====================

export interface ProcessStageCount {
  dyeing: number;
  printing: number;
  finishing: number;
  qc: number;
  ready: number;
}

export interface ProcessKPIs {
  lotsByStage: ProcessStageCount;
  avgProcessingTime: number;
  delayedLots: number;
  readyNotDispatched: number;
  reworkPercentage: number;
}

export const calculateProcessKPIs = (): ProcessKPIs => {
  // 1. Lots by Stage - Count work orders by processing stage
  const dyeingLots = mockJobOrders.filter(job => job.serviceType === 'dyeing' && job.status === 'in_process').length;
  const printingLots = mockJobOrders.filter(job => job.serviceType === 'printing' && job.status === 'in_process').length;
  const finishingLots = mockJobOrders.filter(job => job.serviceType === 'finishing' && job.status === 'in_process').length;
  const qcLots = mockWorkOrders.filter(wo => wo.status === 'ready_qc').length;
  const readyLots = mockWorkOrders.filter(wo => wo.status === 'qc_approved' || wo.status === 'ready_for_delivery').length;

  const lotsByStage: ProcessStageCount = {
    dyeing: dyeingLots,
    printing: printingLots,
    finishing: finishingLots,
    qc: qcLots,
    ready: readyLots
  };

  // 2. Average Processing Time - Calculate from work orders with completion dates
  const completedWorkOrders = mockWorkOrders.filter(wo => 
    wo.startTime && wo.actualCompletion
  );
  
  let totalProcessingDays = 0;
  completedWorkOrders.forEach(wo => {
    const startDate = new Date(wo.startTime!);
    const endDate = new Date(wo.actualCompletion!);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalProcessingDays += diffDays;
  });

  const avgProcessingTime = completedWorkOrders.length > 0 
    ? Math.round((totalProcessingDays / completedWorkOrders.length) * 10) / 10 
    : 0;

  // 3. Delayed Lots - Work orders past estimated completion
  const delayedLots = mockWorkOrders.filter(wo => 
    wo.status === 'in_progress' && 
    wo.estimatedCompletion && 
    new Date(wo.estimatedCompletion) < new Date()
  ).length;

  // 4. Ready Not Dispatched - Completed work orders awaiting delivery
  const readyNotDispatched = mockWorkOrders.filter(wo => 
    wo.status === 'ready_for_delivery' || wo.status === 'completed'
  ).length;

  // 5. Rework Percentage - QC rejected items as percentage
  const totalQCItems = mockQCItems.length;
  const rejectedQCItems = mockQCItems.filter(qc => qc.status === 'rejected').length;
  const reworkPercentage = totalQCItems > 0 ? Math.round((rejectedQCItems / totalQCItems) * 100) : 0;

  return {
    lotsByStage,
    avgProcessingTime,
    delayedLots,
    readyNotDispatched,
    reworkPercentage
  };
};

// ==================== CUSTOMER MODULE KPIs ====================

export interface CustomerKPIs {
  activeParties: number;
  newPartiesThisMonth: number;
  repeatCustomerPercentage: number;
  topPartiesByBilling: Array<{ name: string; amount: number }>;
  topPartiesByOutstanding: Array<{ name: string; amount: number }>;
}

export const calculateCustomerKPIs = (): CustomerKPIs => {

  // 1. Active Parties - Customers with active business relationship
  const activeParties = mockBusinessProfiles.filter(bp => 
    bp.customerStatus === 'customer'
  ).length;

  // 2. New Parties This Month - New customers acquired this month (simplified for demo)
  const newPartiesThisMonth = Math.floor(activeParties * 0.2); // Approximate 20% as new this month

  // 3. Repeat Customer Percentage - Customers with multiple orders
  const customersWithOrders = mockBusinessProfiles.filter(bp => {
    const orderCount = mockJobOrders.filter(order => order.businessProfileId === bp.id).length;
    return orderCount > 1;
  }).length;
  
  const repeatCustomerPercentage = activeParties > 0 
    ? Math.round((customersWithOrders / activeParties) * 100) 
    : 0;

  // 4. Top Parties by Billing - Top customers by total invoice value
  const customerBilling = mockBusinessProfiles.map(bp => {
    const totalBilling = mockJobOrders
      .filter(order => order.businessProfileId === bp.id)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      name: bp.companyName,
      amount: totalBilling
    };
  }).filter(customer => customer.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // 5. Top Parties by Outstanding - Top customers by unpaid amounts
  const customerOutstanding = mockBusinessProfiles.map(bp => {
    const outstandingAmount = mockJobOrders
      .filter(order => 
        order.businessProfileId === bp.id && 
        (order.paymentStatus?.includes('pending') || order.paymentStatus?.includes('partial'))
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      name: bp.companyName,
      amount: outstandingAmount
    };
  }).filter(customer => customer.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return {
    activeParties,
    newPartiesThisMonth,
    repeatCustomerPercentage,
    topPartiesByBilling: customerBilling,
    topPartiesByOutstanding: customerOutstanding
  };
};

// ==================== COMPREHENSIVE DASHBOARD DATA ====================

export interface ComprehensiveDashboardData {
  globalKPIs: GlobalKPIs;
  salesKPIs: SalesKPIs;
  storeKPIs: StoreKPIs;
  processKPIs: ProcessKPIs;
  customerKPIs: CustomerKPIs;
}

export const calculateAllDashboardKPIs = (): ComprehensiveDashboardData => {
  return {
    globalKPIs: calculateGlobalKPIs(),
    salesKPIs: calculateSalesKPIs(),
    storeKPIs: calculateStoreKPIs(),
    processKPIs: calculateProcessKPIs(),
    customerKPIs: calculateCustomerKPIs()
  };
};

// ==================== UTILITY FUNCTIONS ====================

export const formatCurrency = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  } else {
    return `₹${amount}`;
  }
};

export const formatQuantity = (quantity: number, unit: string = ''): string => {
  if (quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)}K${unit}`;
  }
  return `${quantity}${unit}`;
};

export const getTrendIndicator = (current: number, previous: number): { icon: string; value: string; isPositive: boolean } => {
  const diff = current - previous;
  const isPositive = diff > 0;
  
  return {
    icon: isPositive ? '↑' : diff < 0 ? '↓' : '→',
    value: Math.abs(diff).toString(),
    isPositive
  };
};