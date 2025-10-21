// Inventory Management Mock Data
// Central inventory tracking for all materials with real-time stock levels

// ==================== INVENTORY INTERFACES ====================

export interface InventoryItem {
  materialName: string;
  onHandStock: number;
  unit: string;
  location?: string;
  reorderLevel?: number;
  costPerUnit?: number;
  lastUpdated: string;
  notes?: string;
}

// ==================== INVENTORY MOCK DATA ====================

export const mockInventory: InventoryItem[] = [
  // Cotton Yarns - Core materials for textile manufacturing
  {
    materialName: 'Cotton Yarn 30s Count',
    onHandStock: 800,
    unit: 'kg',
    location: 'Warehouse A - Section 1',
    reorderLevel: 200,
    costPerUnit: 75,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'High-quality cotton for premium orders'
  },
  {
    materialName: 'Cotton Yarn 40s Count',
    onHandStock: 1200,
    unit: 'kg',
    location: 'Warehouse A - Section 2',
    reorderLevel: 300,
    costPerUnit: 85,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Most frequently used grade'
  },
  
  // Polyester Materials
  {
    materialName: 'Polyester Thread',
    onHandStock: 500,
    unit: 'kg',
    location: 'Warehouse B - Section 1',
    reorderLevel: 100,
    costPerUnit: 45,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  {
    materialName: 'Polyester Yarn 150D',
    onHandStock: 600,
    unit: 'kg',
    location: 'Warehouse B - Section 2',
    reorderLevel: 150,
    costPerUnit: 55,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  
  // Dyes and Chemicals
  {
    materialName: 'Red Dye Chemical',
    onHandStock: 80,
    unit: 'kg',
    location: 'Chemical Storage - A1',
    reorderLevel: 20,
    costPerUnit: 160,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Store in cool, dry place'
  },
  {
    materialName: 'Blue Dye Chemical',
    onHandStock: 120,
    unit: 'kg',
    location: 'Chemical Storage - A2',
    reorderLevel: 25,
    costPerUnit: 155,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  
  // Fabric Materials
  {
    materialName: 'Cotton Fabric Base',
    onHandStock: 800,
    unit: 'meters',
    location: 'Fabric Storage - F1',
    reorderLevel: 200,
    costPerUnit: 25,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  {
    materialName: 'Cotton Fabric 150 GSM',
    onHandStock: 1200,
    unit: 'meters',
    location: 'Fabric Storage - F2',
    reorderLevel: 300,
    costPerUnit: 30,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  
  // Accessories
  {
    materialName: 'Zipper - Metal 12 inch',
    onHandStock: 500,
    unit: 'pieces',
    location: 'Accessories Storage',
    reorderLevel: 100,
    costPerUnit: 12,
    lastUpdated: '2025-10-21T08:00:00Z'
  },
  {
    materialName: 'Cotton Thread - White',
    onHandStock: 300,
    unit: 'kg',
    location: 'Thread Storage',
    reorderLevel: 50,
    costPerUnit: 65,
    lastUpdated: '2025-10-21T08:00:00Z'
  }
];

// ==================== INVENTORY HELPER FUNCTIONS ====================

/**
 * Get inventory item by material name
 */
export const getInventoryItem = (materialName: string): InventoryItem | undefined => {
  return mockInventory.find(item => item.materialName === materialName);
};

/**
 * Get current on-hand stock for a material
 */
export const getOnHandStock = (materialName: string): number => {
  const item = getInventoryItem(materialName);
  return item ? item.onHandStock : 0;
};

/**
 * Check if material is below reorder level
 */
export const isBelowReorderLevel = (materialName: string): boolean => {
  const item = getInventoryItem(materialName);
  if (!item || !item.reorderLevel) return false;
  return item.onHandStock <= item.reorderLevel;
};

/**
 * Get all materials below reorder level
 */
export const getMaterialsBelowReorderLevel = (): InventoryItem[] => {
  return mockInventory.filter(item => 
    item.reorderLevel && item.onHandStock <= item.reorderLevel
  );
};

/**
 * Get inventory summary for dashboard
 */
export const getInventorySummary = () => {
  const totalItems = mockInventory.length;
  const lowStockItems = getMaterialsBelowReorderLevel().length;
  const totalValue = mockInventory.reduce((sum, item) => {
    const cost = item.costPerUnit || 0;
    return sum + (item.onHandStock * cost);
  }, 0);
  
  return {
    totalItems,
    lowStockItems,
    totalValue,
    lastUpdated: new Date().toISOString()
  };
};