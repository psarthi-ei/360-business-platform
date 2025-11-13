// Dashboard KPI Calculations - Enterprise Business Intelligence
// Fixed data calculations + Regional terminology compliance

import { mockLeads, mockJobOrders, mockFinalInvoices } from '../data/salesMockData';
import { mockWorkOrders } from '../data/productionMockData';
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
  // 1. Active Job Orders - Orders currently being processed
  const actualActiveOrders = mockJobOrders.filter(job => 
    !['completed', 'delivered', 'cancelled'].includes(job.status)
  ).length;
  
  // Ensure realistic number for demo (minimum 8 active orders)
  const activeJobOrders = Math.max(actualActiveOrders, 8);

  // 2. Lots in Process (WIP) - Work orders actively being worked on
  const lotsInProcess = mockWorkOrders.filter(wo => 
    ['in_progress', 'pending', 'ready_qc', 'rework_required'].includes(wo.status)
  ).length;

  // 3. Billed This Month - Realistic revenue calculation
  const completedOrders = mockJobOrders.filter(job => 
    ['delivered', 'completed', 'service_completed'].includes(job.status)
  );
  const billedThisMonth = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // 4. Outstanding Amount - Realistic pending payments
  const unpaidInvoices = mockFinalInvoices
    .filter(invoice => invoice.paymentDetails.balanceDue > 0)
    .reduce((sum, invoice) => sum + invoice.paymentDetails.balanceDue, 0);
  
  const pendingOrderPayments = mockJobOrders
    .filter(order => 
      order.paymentStatus === 'pending' || 
      order.paymentStatus === 'partial' ||
      order.paymentStatus === 'advance_received'
    )
    .reduce((sum, order) => {
      // Calculate remaining amount if advance was paid
      const advancePaid = order.paymentStatus === 'partial' ? order.totalAmount * 0.3 : 0;
      return sum + (order.totalAmount - advancePaid);
    }, 0);

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
  leadsThisMonth: number;
  conversionRate: number;
  ordersThisMonth: number;
  materialInwarded: number;
  unbilledWork: number;
}

export const calculateSalesKPIs = (): SalesKPIs => {
  
  // 1. Leads This Month - Active leads and recent inquiries
  const activeLeads = mockLeads.filter(lead => 
    ['active_lead', 'quote_sent', 'negotiation'].includes(lead.conversionStatus)
  ).length;
  
  const leadsThisMonth = Math.max(activeLeads, Math.floor(mockLeads.length * 0.6));

  // 2. Conversion Rate - Lead to order conversion (realistic calculation)
  const totalLeads = mockLeads.length;
  const convertedLeads = mockLeads.filter(lead => 
    lead.conversionStatus === 'converted_to_order'
  ).length;
  
  // Calculate realistic conversion rate based on business logic
  const approvedQuotes = mockLeads.filter(lead => 
    ['verbally_approved', 'proforma_sent', 'converted_to_order'].includes(lead.conversionStatus)
  ).length;
  
  const conversionRate = totalLeads > 0 
    ? Math.round((Math.max(convertedLeads, approvedQuotes) / totalLeads) * 100)
    : 68; // Realistic textile industry average

  // 3. New Orders This Month - Orders created in current month (simulated)
  const ordersThisMonth = Math.max(
    Math.floor(activeLeads * 0.4), // Realistic conversion from leads to orders
    Math.floor(mockJobOrders.length * 0.3) // Alternative: 30% of total orders as "new this month"
  );

  // 4. Material Inwarded - Customer material received
  const materialInwarded = mockInwardEntries.reduce((sum, entry) => {
    if (entry.unit === 'meters') {
      return sum + entry.receivedQuantity;
    } else if (entry.unit === 'yards') {
      return sum + (entry.receivedQuantity * 0.9144); // Convert yards to meters
    }
    return sum;
  }, 0);

  // 5. Unbilled Work - Completed work awaiting invoicing
  const completedNotInvoiced = mockJobOrders.filter(order => 
    ['service_completed', 'ready_for_invoice', 'ready_to_ship'].includes(order.status)
  );
  const unbilledWork = completedNotInvoiced.reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    leadsThisMonth,
    conversionRate,
    ordersThisMonth,
    materialInwarded: Math.round(materialInwarded),
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
  // 1. Low Stock Items - Items below safety/reorder levels
  const lowStockItems = mockInventory.filter(item => {
    const reorderLevel = item.reorderLevel || item.safetyStock || 10;
    return (item.onHandStock <= reorderLevel && item.onHandStock > 0) || 
           item.stockStatus === 'low';
  }).length;

  // 2. Out of Stock Items - Critical stock situations
  const outOfStockItems = mockInventory.filter(item => 
    item.onHandStock === 0 || item.stockStatus === 'critical'
  ).length;

  // 3. Material Inward This Month - Recent receipts
  const recentGRNs = mockGoodsReceiptNotes.filter(grn => 
    grn.qualityStatus === 'approved' || grn.qualityStatus === 'pending'
  ).length;
  
  const recentInwards = mockInwardEntries.filter(entry => 
    !entry.qualityAssessment || entry.qualityAssessment !== 'Rejected'
  ).length;
  
  const materialInwardThisMonth = recentGRNs + recentInwards;

  // 4. Purchase Orders Raised - Total active POs
  const purchaseOrdersRaised = mockPurchaseOrders.length;

  // 5. Purchase Orders Pending Delivery
  const purchaseOrdersPending = mockPurchaseOrders.filter(po => 
    po.status === 'open' && !po.actualDelivery
  ).length;

  return {
    lowStockItems: Math.max(lowStockItems, 3), // Ensure realistic numbers
    outOfStockItems: Math.max(outOfStockItems, 1),
    materialInwardThisMonth: Math.max(materialInwardThisMonth, 15),
    purchaseOrdersRaised: Math.max(purchaseOrdersRaised, 18),
    purchaseOrdersPending: Math.max(purchaseOrdersPending, 4)
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
  // 1. Lots by Stage - Analyze work orders by service type and status
  const inProgressOrders = mockWorkOrders.filter(wo => 
    ['in_progress', 'pending', 'ready_qc'].includes(wo.status)
  );
  
  // Count by service type based on product description
  const dyeingLots = inProgressOrders.filter(wo => 
    wo.product.toLowerCase().includes('dye') || 
    wo.product.toLowerCase().includes('dyeing') ||
    wo.product.toLowerCase().includes('blue') ||
    wo.product.toLowerCase().includes('reactive')
  ).length;
  
  const printingLots = inProgressOrders.filter(wo => 
    wo.product.toLowerCase().includes('print') || 
    wo.product.toLowerCase().includes('printing') ||
    wo.product.toLowerCase().includes('color') ||
    wo.product.toLowerCase().includes('design')
  ).length;
  
  const finishingLots = inProgressOrders.filter(wo => 
    wo.product.toLowerCase().includes('finish') || 
    wo.product.toLowerCase().includes('finishing') ||
    wo.product.toLowerCase().includes('cotton')
  ).length;
  
  const qcLots = mockWorkOrders.filter(wo => 
    wo.status === 'ready_qc' || wo.status === 'qc_rejected'
  ).length;
  
  const readyLots = mockWorkOrders.filter(wo => 
    wo.status === 'qc_approved' || wo.status === 'ready_for_delivery'
  ).length;

  const lotsByStage: ProcessStageCount = {
    dyeing: Math.max(dyeingLots, 5),
    printing: Math.max(printingLots, 7),
    finishing: Math.max(finishingLots, 4),
    qc: Math.max(qcLots, 3),
    ready: Math.max(readyLots, 6)
  };

  // 2. Average Processing Time
  const completedWorkOrders = mockWorkOrders.filter(wo => 
    wo.actualCompletion && wo.createdDate
  );
  
  let totalProcessingDays = 0;
  completedWorkOrders.forEach(wo => {
    const startDate = new Date(wo.createdDate);
    const endDate = new Date(wo.actualCompletion!);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalProcessingDays += diffDays;
  });

  const avgProcessingTime = completedWorkOrders.length > 0 
    ? Math.round((totalProcessingDays / completedWorkOrders.length) * 10) / 10 
    : 6.8; // Realistic industry average

  // 3. Delayed Lots - Orders with issues or overdue
  const delayedLots = mockWorkOrders.filter(wo => 
    wo.status === 'rework_required' || 
    wo.status === 'on_hold' ||
    (wo.issues && wo.issues.length > 0) ||
    wo.status === 'qc_rejected'
  ).length;

  // 4. Ready Not Dispatched
  const readyNotDispatched = mockWorkOrders.filter(wo => 
    wo.status === 'ready_for_delivery' || wo.status === 'qc_approved'
  ).length;

  // 5. Rework Percentage
  const totalProcessedItems = mockWorkOrders.filter(wo => 
    !['pending', 'in_progress'].includes(wo.status)
  ).length;
  
  const reworkItems = mockWorkOrders.filter(wo => 
    wo.status === 'qc_rejected' || wo.status === 'rework_required'
  ).length;
  
  const reworkPercentage = totalProcessedItems > 0 
    ? Math.round((reworkItems / totalProcessedItems) * 100) 
    : 8; // Realistic industry average

  return {
    lotsByStage,
    avgProcessingTime,
    delayedLots: Math.max(delayedLots, 2),
    readyNotDispatched: Math.max(readyNotDispatched, 4),
    reworkPercentage: Math.max(reworkPercentage, 5)
  };
};

// ==================== CUSTOMER MODULE KPIs ====================

export interface CustomerKPIs {
  activeCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomerPercentage: number;
  topCustomersByRevenue: Array<{ name: string; amount: number }>;
  topCustomersByOutstanding: Array<{ name: string; amount: number }>;
}

export const calculateCustomerKPIs = (): CustomerKPIs => {
  // 1. Active Customers - Business partners with current orders
  const activeCustomers = mockBusinessProfiles.filter(bp => 
    bp.customerStatus === 'customer'
  ).length;

  // 2. New Customers This Month - Growth rate
  const newCustomersThisMonth = Math.max(2, Math.floor(activeCustomers * 0.15));

  // 3. Repeat Customer Percentage
  const customersWithMultipleOrders = mockBusinessProfiles.filter(bp => {
    const orderCount = mockJobOrders.filter(order => order.businessProfileId === bp.id).length;
    return orderCount > 1;
  }).length;
  
  const repeatCustomerPercentage = activeCustomers > 0 
    ? Math.round((customersWithMultipleOrders / activeCustomers) * 100) 
    : 74; // Realistic industry average

  // 4. Top Customers by Revenue
  const customerRevenue = mockBusinessProfiles.map(bp => {
    const totalRevenue = mockJobOrders
      .filter(order => order.businessProfileId === bp.id)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      name: bp.companyName.split(' ')[0], // First word only
      amount: totalRevenue
    };
  }).filter(customer => customer.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // 5. Top Customers by Outstanding
  const customerOutstanding = mockBusinessProfiles.map(bp => {
    const outstandingAmount = mockJobOrders
      .filter(order => 
        order.businessProfileId === bp.id && 
        ['pending', 'partial', 'advance_pending'].includes(order.paymentStatus || '')
      )
      .reduce((sum, order) => sum + (order.totalAmount * 0.7), 0); // Assume 30% advance paid
    
    return {
      name: bp.companyName.split(' ')[0],
      amount: outstandingAmount
    };
  }).filter(customer => customer.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Fallback data for demonstration
  const defaultBilling = [
    { name: 'Surat', amount: 485000 },
    { name: 'Mumbai', amount: 372000 },
    { name: 'Bharuch', amount: 298000 }
  ];

  const defaultOutstanding = [
    { name: 'Bharuch', amount: 145000 },
    { name: 'Surat', amount: 98000 },
    { name: 'Mumbai', amount: 76000 }
  ];

  return {
    activeCustomers,
    newCustomersThisMonth,
    repeatCustomerPercentage,
    topCustomersByRevenue: customerRevenue.length >= 3 ? customerRevenue : defaultBilling,
    topCustomersByOutstanding: customerOutstanding.length >= 3 ? customerOutstanding : defaultOutstanding
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