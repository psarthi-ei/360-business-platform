// Material Availability Helper Functions
// Dynamic calculation functions for stock reservation and material allocation

import { mockMaterialRequirements } from './procurementMockData';
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
  // Get all material requirements for this order
  const requirements = mockMaterialRequirements.filter(mr => mr.orderId === orderId);
  
  // Check availability for each material
  const materialChecks = requirements.map(req => 
    checkMaterialAvailability(req.materialName, req.requiredQuantity, req.unit)
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
  
  // Collect all material demands
  orderIds.forEach(orderId => {
    const requirements = mockMaterialRequirements.filter(mr => mr.orderId === orderId);
    requirements.forEach(req => {
      const existing = materialDemands.get(req.materialName) || { demand: 0, orders: [] };
      materialDemands.set(req.materialName, {
        demand: existing.demand + req.requiredQuantity,
        orders: [...existing.orders, orderId]
      });
    });
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
  const orders = mockMaterialRequirements
    .filter(mr => mr.materialName === materialName)
    .map(mr => ({
      orderId: mr.orderId,
      required: mr.requiredQuantity,
      urgency: mr.urgency,
      requiredDate: mr.requiredDate,
      hasReservation: getActiveOrderReservations(mr.orderId).length > 0
    }))
    .sort((a, b) => {
      // Sort by urgency first, then by required date
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
  const allOrders = [...new Set(mockMaterialRequirements.map(mr => mr.orderId))];
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