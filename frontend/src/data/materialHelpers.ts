// Material Availability Helper Functions
// Dynamic calculation functions for stock reservation and material allocation

import { mockConsolidatedMaterialRequirements, mockConsolidatedPurchaseRequests, ConsolidatedMaterialRequirement, MaterialItem, ConsolidatedPurchaseRequest } from './procurementMockData';
import { getOnHandStock } from './inventoryMockData';
import { getSoftReservedQuantity, getHardReservedQuantity, getActiveOrderReservations } from './stockReservationMockData';

// ==================== TYPES ====================

export interface MaterialAvailabilityCheck {
  materialName: string;
  required: number;
  onHand: number;
  softReserved: number;
  hardReserved: number;
  freeStock: number;
  shortage: number;
  status: 'available' | 'partial' | 'shortage';
  unit: string;
}

export interface OrderMaterialStatus {
  orderId: string;
  overallStatus: 'available' | 'partial' | 'shortage';
  materialChecks: MaterialAvailabilityCheck[];
  shortageItems: MaterialAvailabilityCheck[];
  availableItems: MaterialAvailabilityCheck[];
  totalShortage: number;
}

export interface MaterialConflict {
  materialName: string;
  totalDemand: number;
  freeStock: number;
  conflictingOrders: string[];
  recommendedAction: 'procure' | 'prioritize' | 'delay';
}

// ==================== CORE CALCULATION FUNCTIONS ====================

/**
 * Calculate Free Stock using the formula: On-hand - Soft Reserved - Hard Reserved
 */
export const calculateFreeStock = (materialName: string): number => {
  const onHand = getOnHandStock(materialName);
  const softReserved = getSoftReservedQuantity(materialName);
  const hardReserved = getHardReservedQuantity(materialName);
  
  return Math.max(0, onHand - softReserved - hardReserved);
};

/**
 * Check material availability for a specific material and quantity
 */
export const checkMaterialAvailability = (materialName: string, requiredQuantity: number, unit: string): MaterialAvailabilityCheck => {
  const onHand = getOnHandStock(materialName);
  const softReserved = getSoftReservedQuantity(materialName);
  const hardReserved = getHardReservedQuantity(materialName);
  const freeStock = calculateFreeStock(materialName);
  const shortage = Math.max(0, requiredQuantity - freeStock);
  
  let status: 'available' | 'partial' | 'shortage';
  if (freeStock >= requiredQuantity) {
    status = 'available';
  } else if (freeStock > 0) {
    status = 'partial';
  } else {
    status = 'shortage';
  }
  
  return {
    materialName,
    required: requiredQuantity,
    onHand,
    softReserved,
    hardReserved,
    freeStock,
    shortage,
    status,
    unit
  };
};

/**
 * Check material availability for an entire Sales Order
 */
export const checkOrderMaterialAvailability = (orderId: string): OrderMaterialStatus => {
  // Find consolidated material requirement for this order
  const consolidatedMR = mockConsolidatedMaterialRequirements.find(mr => mr.salesOrderId === orderId);
  
  if (!consolidatedMR) {
    // Return empty status if no material requirements found
    return {
      orderId,
      overallStatus: 'available',
      materialChecks: [],
      shortageItems: [],
      availableItems: [],
      totalShortage: 0
    };
  }
  
  // Extract individual materials from consolidated structure
  const materialChecks = consolidatedMR.materials.map(material => 
    checkMaterialAvailability(material.materialName, material.requiredQuantity, material.unit)
  );
  
  // Categorize materials
  const shortageItems = materialChecks.filter(check => check.status === 'shortage' || check.status === 'partial');
  const availableItems = materialChecks.filter(check => check.status === 'available');
  
  // Calculate overall status
  let overallStatus: 'available' | 'partial' | 'shortage';
  if (shortageItems.length === 0) {
    overallStatus = 'available';
  } else if (availableItems.length > 0) {
    overallStatus = 'partial';
  } else {
    overallStatus = 'shortage';
  }
  
  // Calculate total shortage value (could be used for procurement prioritization)
  const totalShortage = shortageItems.reduce((total, item) => total + item.shortage, 0);
  
  return {
    orderId,
    overallStatus,
    materialChecks,
    shortageItems,
    availableItems,
    totalShortage
  };
};

/**
 * Find material conflicts across multiple orders
 */
export const findMaterialConflicts = (orderIds: string[]): MaterialConflict[] => {
  const materialDemands = new Map<string, { demand: number; orders: string[] }>();
  
  // Collect all material demands from consolidated MRs
  orderIds.forEach(orderId => {
    const consolidatedMR = mockConsolidatedMaterialRequirements.find(mr => mr.salesOrderId === orderId);
    if (consolidatedMR) {
      consolidatedMR.materials.forEach(material => {
        const existing = materialDemands.get(material.materialName) || { demand: 0, orders: [] };
        materialDemands.set(material.materialName, {
          demand: existing.demand + material.requiredQuantity,
          orders: [...existing.orders, orderId]
        });
      });
    }
  });
  
  // Find conflicts
  const conflicts: MaterialConflict[] = [];
  materialDemands.forEach((data, materialName) => {
    const freeStock = calculateFreeStock(materialName);
    
    if (data.demand > freeStock && data.orders.length > 1) {
      let recommendedAction: 'procure' | 'prioritize' | 'delay';
      const shortfall = data.demand - freeStock;
      
      if (shortfall > freeStock * 0.5) {
        recommendedAction = 'procure';
      } else if (data.orders.length <= 3) {
        recommendedAction = 'prioritize';
      } else {
        recommendedAction = 'delay';
      }
      
      conflicts.push({
        materialName,
        totalDemand: data.demand,
        freeStock,
        conflictingOrders: data.orders,
        recommendedAction
      });
    }
  });
  
  return conflicts;
};

// ==================== BUSINESS LOGIC FUNCTIONS ====================

/**
 * Simulate soft reservation for an order (check if possible)
 */
export const canCreateSoftReservation = (orderId: string): { success: boolean; conflicts: MaterialConflict[] } => {
  const materialStatus = checkOrderMaterialAvailability(orderId);
  const conflicts = findMaterialConflicts([orderId]);
  
  const success = materialStatus.overallStatus === 'available';
  
  return { success, conflicts };
};

/**
 * Get material status display information for UI
 */
export const getMaterialStatusDisplay = (orderId: string) => {
  const status = checkOrderMaterialAvailability(orderId);
  const hasReservations = getActiveOrderReservations(orderId).length > 0;
  
  switch (status.overallStatus) {
    case 'available':
      return {
        icon: '✅',
        text: hasReservations ? 'Available (Reserved)' : 'Available',
        cardClass: 'ds-card-status-active',
        actionText: hasReservations ? 'Start Production' : 'Reserve Materials'
      };
    case 'partial':
      return {
        icon: '⚠️',
        text: `Partial (${status.availableItems.length}/${status.materialChecks.length} materials)`,
        cardClass: 'ds-card-status-pending',
        actionText: 'Review Shortages'
      };
    case 'shortage':
      const shortageCount = status.shortageItems.length;
      return {
        icon: '❌',
        text: `Shortage (${shortageCount} materials)`,
        cardClass: 'ds-card-status-inactive',
        actionText: 'Go to Procurement'
      };
    default:
      return {
        icon: '❓',
        text: 'Status Unknown',
        cardClass: 'ds-card-status-inactive',
        actionText: 'Check Materials'
      };
  }
};

/**
 * Get shortage details for procurement planning
 */
export const getShortageDetails = (orderId: string) => {
  const status = checkOrderMaterialAvailability(orderId);
  
  return status.shortageItems.map(item => ({
    materialName: item.materialName,
    required: item.required,
    available: item.freeStock,
    shortage: item.shortage,
    unit: item.unit,
    procurementPriority: item.shortage > item.freeStock ? 'high' : 'medium'
  }));
};

/**
 * Get priority order queue for a material (for supervisor decision making)
 */
export const getMaterialOrderQueue = (materialName: string) => {
  const orders: Array<{
    orderId: string;
    required: number;
    urgency: 'high' | 'medium' | 'low';
    requiredDate: string;
    hasReservation: boolean;
  }> = [];
  
  // Extract material requirements from consolidated MRs
  mockConsolidatedMaterialRequirements.forEach(consolidatedMR => {
    consolidatedMR.materials.forEach(material => {
      if (material.materialName === materialName) {
        orders.push({
          orderId: consolidatedMR.salesOrderId,
          required: material.requiredQuantity,
          urgency: material.urgency,
          requiredDate: consolidatedMR.requiredDate,
          hasReservation: getActiveOrderReservations(consolidatedMR.salesOrderId).length > 0
        });
      }
    });
  });
  
  // Sort by urgency first, then by required date
  orders.sort((a, b) => {
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    return new Date(a.requiredDate).getTime() - new Date(b.requiredDate).getTime();
  });
  
  const freeStock = calculateFreeStock(materialName);
  let remainingStock = freeStock;
  
  return orders.map(order => {
    const canFulfill = remainingStock >= order.required;
    if (canFulfill) {
      remainingStock -= order.required;
    }
    
    return {
      ...order,
      canFulfill,
      queuePosition: canFulfill ? 'allocated' : 'queued',
      remainingStockAfter: Math.max(0, remainingStock)
    };
  });
};

// ==================== DASHBOARD SUMMARY FUNCTIONS ====================

/**
 * Get material allocation summary for dashboard
 */
export const getMaterialAllocationSummary = () => {
  const allOrders = mockConsolidatedMaterialRequirements.map(mr => mr.salesOrderId);
  const statusCounts = { available: 0, partial: 0, shortage: 0 };
  
  allOrders.forEach(orderId => {
    const status = checkOrderMaterialAvailability(orderId);
    statusCounts[status.overallStatus]++;
  });
  
  return {
    totalOrders: allOrders.length,
    ...statusCounts,
    lastUpdated: new Date().toISOString()
  };
};

// ==================== PURCHASE REQUEST LINKING FUNCTIONS ====================

/**
 * Find Purchase Request linked to a specific order's material requirements
 */
export const getLinkedPurchaseRequest = (orderId: string) => {
  // Find consolidated material requirement for this order
  const consolidatedMR = mockConsolidatedMaterialRequirements.find(mr => mr.salesOrderId === orderId);
  
  if (!consolidatedMR || !consolidatedMR.linkedPR) {
    return null;
  }
  
  // Find PR by the linkedPR ID
  const linkedPR = mockConsolidatedPurchaseRequests.find(pr => pr.id === consolidatedMR.linkedPR);
  
  return linkedPR || null;
};

/**
 * Check if an order has a linked Purchase Request
 */
export const hasLinkedPR = (orderId: string): boolean => {
  return getLinkedPurchaseRequest(orderId) !== null;
};

/**
 * Get PR status for an order (for display purposes)
 */
export const getPRStatus = (orderId: string) => {
  // Find consolidated material requirement for this order
  const consolidatedMR = mockConsolidatedMaterialRequirements.find(mr => mr.salesOrderId === orderId);
  
  if (!consolidatedMR || !consolidatedMR.linkedPR) {
    return {
      hasPR: false,
      status: null,
      prId: null,
      canCreatePR: true
    };
  }
  
  return {
    hasPR: true,
    status: 'linked', // Simple status since we're not checking actual PR data
    prId: consolidatedMR.linkedPR,
    canCreatePR: false
  };
};

/**
 * Generate new PR ID for auto-creation
 */
export const generatePRId = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `PR-${year}-${timestamp}`;
};

// ==================== CONSOLIDATED PURCHASE REQUEST HELPERS (PHASE 3) ====================

/**
 * Generate consolidated PR from consolidated MR
 */
export const generateConsolidatedPRFromMR = (consolidatedMR: ConsolidatedMaterialRequirement): ConsolidatedPurchaseRequest => {
  
  return {
    id: `PR-${consolidatedMR.salesOrderId}-CONSOLIDATED`,
    consolidatedMrId: consolidatedMR.id,
    salesOrderId: consolidatedMR.salesOrderId,
    customerName: consolidatedMR.customerName,
    orderValue: consolidatedMR.orderValue,
    materials: consolidatedMR.materials.map((material: MaterialItem) => ({
      materialName: material.materialName,
      requiredQuantity: material.requiredQuantity,
      unit: material.unit,
      estimatedUnitCost: 0, // To be filled by procurement team
      estimatedTotalCost: 0, // To be filled by procurement team
      forOrderItems: [], // To be linked by procurement team
      urgency: material.urgency,
      preferredVendor: 'TBD', // To be determined by procurement team
      qualitySpecs: 'Standard', // Default - to be specified by procurement team
      deliveryRequirement: `Deliver by ${consolidatedMR.requiredDate}`,
      notes: material.notes || 'Material requirement from production planning'
    })),
    totalEstimatedCost: 0, // To be calculated by procurement team
    businessJustification: `Customer ${consolidatedMR.customerName} delivery commitment requires material procurement by ${consolidatedMR.requiredDate}`,
    urgency: consolidatedMR.urgency,
    requiredDate: consolidatedMR.requiredDate,
    status: 'pending',
    requestedBy: 'Production Planning',
    requestDate: new Date().toISOString().split('T')[0]
  };
};

/**
 * Calculate business impact level based on cost and order value
 */
export const calculatePRImpactLevel = (totalCost: number, orderValue: number): 'low' | 'medium' | 'high' => {
  const percentage = (totalCost / orderValue) * 100;
  
  if (percentage > 60 || totalCost > 400000) return 'high';
  if (percentage > 30 || totalCost > 200000) return 'medium';
  return 'low';
};

/**
 * Get vendor breakdown summary from materials
 */
export const getVendorBreakdown = (materials: MaterialItem[]): string => {
  // Since MaterialItem doesn't have cost info, return a placeholder breakdown
  const materialCount = materials.length;
  return `${materialCount} materials - Vendor quotes pending`;
};

/**
 * Calculate investment percentage of total cost vs order value
 */
export const getInvestmentPercentage = (totalCost: number, orderValue: number): number => {
  return Math.round((totalCost / orderValue) * 100);
};

/**
 * Get impact level display with proper styling
 */
export const getImpactLevelDisplay = (totalCost: number, orderValue: number): string => {
  const level = calculatePRImpactLevel(totalCost, orderValue);
  const percentage = getInvestmentPercentage(totalCost, orderValue);
  
  switch (level) {
    case 'high':
      return `🔥 High Impact (${percentage}%)`;
    case 'medium':
      return `⚡ Medium Impact (${percentage}%)`;
    default:
      return `📊 Standard (${percentage}%)`;
  }
};

/**
 * Calculate consolidated PR counts for filter system
 */
export const calculateConsolidatedPRCounts = () => {
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return {
    all: mockConsolidatedPurchaseRequests.length,
    pending_approval: mockConsolidatedPurchaseRequests.filter((pr: ConsolidatedPurchaseRequest) => pr.status === 'pending').length,
    high_impact: mockConsolidatedPurchaseRequests.filter((pr: ConsolidatedPurchaseRequest) => 
      calculatePRImpactLevel(pr.totalEstimatedCost, pr.orderValue) === 'high'
    ).length,
    urgent_delivery: mockConsolidatedPurchaseRequests.filter((pr: ConsolidatedPurchaseRequest) => 
      new Date(pr.requiredDate) <= nextWeek
    ).length,
    approved: mockConsolidatedPurchaseRequests.filter((pr: ConsolidatedPurchaseRequest) => pr.status === 'approved').length
  };
};

/**
 * Approve consolidated purchase request
 */
export const approveConsolidatedPR = (prId: string, approvedBy: string, reasoning?: string) => {
  const pr = mockConsolidatedPurchaseRequests.find((pr: ConsolidatedPurchaseRequest) => pr.id === prId);
  if (!pr) return null;
  
  pr.status = 'approved';
  pr.reviewedBy = approvedBy;
  pr.reviewDate = new Date().toISOString().split('T')[0];
  pr.approvalReasoning = reasoning || `Materials approved for ${pr.customerName} order delivery timeline`;
  
  return pr;
};

/**
 * Reject consolidated purchase request
 */
export const rejectConsolidatedPR = (prId: string, rejectedBy: string, reasoning: string) => {
  const pr = mockConsolidatedPurchaseRequests.find((pr: ConsolidatedPurchaseRequest) => pr.id === prId);
  if (!pr) return null;
  
  pr.status = 'rejected';
  pr.reviewedBy = rejectedBy;
  pr.reviewDate = new Date().toISOString().split('T')[0];
  pr.approvalReasoning = reasoning;
  
  return pr;
};