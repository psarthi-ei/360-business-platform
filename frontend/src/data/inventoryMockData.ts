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
  materialOwnership: 'company' | 'client';
  clientId?: string;
  jobOrderId?: string;
  expiryDate?: string;
  // Enhanced properties for comprehensive inventory management
  category: 'chemicals' | 'yarns' | 'threads' | 'accessories' | 'packaging' | 'fabrics';
  subCategory?: string;
  maxStock?: number;
  safetyStock?: number;
  stockStatus: 'healthy' | 'low' | 'critical' | 'excess';
  averageCostPerUnit?: number;
  totalValue: number;
  monthlyConsumption?: number;
  turnoverRate?: number;
  daysSinceLastMovement?: number;
  batchNumber?: string;
  qualityGrade?: string;
  supplierId?: string;
  supplierName?: string;
  lastReceivedDate?: string;
  lastIssuedDate?: string;
}

// ==================== INVENTORY MOCK DATA ====================

export const mockInventory: InventoryItem[] = [
  // COMPANY-OWNED MATERIALS (Processing chemicals, threads, accessories)
  
  // Processing Chemicals - Company owned for job work services
  {
    materialName: 'Red Dye Chemical',
    onHandStock: 80,
    unit: 'kg',
    location: 'Chemical Storage - A1',
    reorderLevel: 20,
    costPerUnit: 160,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Store in cool, dry place',
    materialOwnership: 'company',
    expiryDate: '2026-03-15',
    category: 'chemicals',
    subCategory: 'Reactive Dyes',
    maxStock: 300,
    safetyStock: 30,
    stockStatus: 'healthy',
    averageCostPerUnit: 155,
    totalValue: 12800,
    monthlyConsumption: 25,
    turnoverRate: 3.2,
    daysSinceLastMovement: 5,
    batchNumber: 'RDC-2024-089',
    qualityGrade: 'A',
    supplierId: 'SUP-001',
    supplierName: 'Gujarat Chemical Co.',
    lastReceivedDate: '2025-10-15',
    lastIssuedDate: '2025-10-20'
  },
  {
    materialName: 'Blue Dye Chemical',
    onHandStock: 120,
    unit: 'kg',
    location: 'Chemical Storage - A2',
    reorderLevel: 25,
    costPerUnit: 155,
    lastUpdated: '2025-10-21T08:00:00Z',
    materialOwnership: 'company',
    expiryDate: '2026-02-28',
    category: 'chemicals',
    subCategory: 'Reactive Dyes',
    maxStock: 400,
    safetyStock: 35,
    stockStatus: 'healthy',
    averageCostPerUnit: 150,
    totalValue: 18600,
    monthlyConsumption: 30,
    turnoverRate: 4.0,
    daysSinceLastMovement: 3,
    batchNumber: 'BDC-2024-076',
    qualityGrade: 'A',
    supplierId: 'SUP-001',
    supplierName: 'Gujarat Chemical Co.',
    lastReceivedDate: '2025-10-18',
    lastIssuedDate: '2025-10-21'
  },
  {
    materialName: 'Sodium Hydroxide (Caustic Soda)',
    onHandStock: 200,
    unit: 'kg',
    location: 'Chemical Storage - B1',
    reorderLevel: 50,
    costPerUnit: 35,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'For bleaching and mercerizing processes',
    materialOwnership: 'company',
    expiryDate: '2027-01-31',
    category: 'chemicals',
    subCategory: 'Alkalis',
    maxStock: 500,
    safetyStock: 75,
    stockStatus: 'healthy',
    averageCostPerUnit: 33,
    totalValue: 7000,
    monthlyConsumption: 80,
    turnoverRate: 2.5,
    daysSinceLastMovement: 2,
    batchNumber: 'CS-2024-145',
    qualityGrade: 'Industrial',
    supplierId: 'SUP-002',
    supplierName: 'Tata Chemicals',
    lastReceivedDate: '2025-10-10',
    lastIssuedDate: '2025-10-21'
  },
  {
    materialName: 'Hydrogen Peroxide',
    onHandStock: 150,
    unit: 'kg',
    location: 'Chemical Storage - B2',
    reorderLevel: 40,
    costPerUnit: 45,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Bleaching agent - handle with care',
    materialOwnership: 'company',
    expiryDate: '2025-12-31',
    category: 'chemicals',
    subCategory: 'Bleaching Agents',
    maxStock: 300,
    safetyStock: 60,
    stockStatus: 'healthy',
    averageCostPerUnit: 42,
    totalValue: 6750,
    monthlyConsumption: 50,
    turnoverRate: 3.0,
    daysSinceLastMovement: 1,
    batchNumber: 'HP-2024-067',
    qualityGrade: 'A',
    supplierId: 'SUP-003',
    supplierName: 'Solvay Chemicals',
    lastReceivedDate: '2025-09-28',
    lastIssuedDate: '2025-10-21'
  },
  
  // Company threads and accessories for job work
  {
    materialName: 'Polyester Thread',
    onHandStock: 500,
    unit: 'kg',
    location: 'Warehouse B - Section 1',
    reorderLevel: 100,
    costPerUnit: 45,
    lastUpdated: '2025-10-21T08:00:00Z',
    materialOwnership: 'company',
    category: 'threads',
    subCategory: 'Synthetic Threads',
    maxStock: 1000,
    safetyStock: 150,
    stockStatus: 'healthy',
    averageCostPerUnit: 43,
    totalValue: 22500,
    monthlyConsumption: 120,
    turnoverRate: 4.2,
    daysSinceLastMovement: 3,
    batchNumber: 'PT-2024-234',
    qualityGrade: 'A',
    supplierId: 'SUP-004',
    supplierName: 'Vardhman Textiles',
    lastReceivedDate: '2025-10-12',
    lastIssuedDate: '2025-10-20'
  },
  {
    materialName: 'Cotton Thread - White',
    onHandStock: 45,
    unit: 'kg',
    location: 'Thread Storage',
    reorderLevel: 50,
    costPerUnit: 65,
    lastUpdated: '2025-10-21T08:00:00Z',
    materialOwnership: 'company',
    category: 'threads',
    subCategory: 'Cotton Threads',
    maxStock: 400,
    safetyStock: 75,
    stockStatus: 'low',
    averageCostPerUnit: 62,
    totalValue: 2925,
    monthlyConsumption: 60,
    turnoverRate: 13.3,
    daysSinceLastMovement: 1,
    batchNumber: 'CT-2024-156',
    qualityGrade: 'Premium',
    supplierId: 'SUP-005',
    supplierName: 'Welspun India',
    lastReceivedDate: '2025-09-15',
    lastIssuedDate: '2025-10-21'
  },
  {
    materialName: 'Zipper - Metal 12 inch',
    onHandStock: 80,
    unit: 'pieces',
    location: 'Accessories Storage',
    reorderLevel: 100,
    costPerUnit: 12,
    lastUpdated: '2025-10-21T08:00:00Z',
    materialOwnership: 'company',
    category: 'accessories',
    subCategory: 'Zippers',
    maxStock: 1000,
    safetyStock: 150,
    stockStatus: 'low',
    averageCostPerUnit: 11.5,
    totalValue: 960,
    monthlyConsumption: 200,
    turnoverRate: 2.4,
    daysSinceLastMovement: 7,
    batchNumber: 'ZIP-2024-089',
    qualityGrade: 'Standard',
    supplierId: 'SUP-006',
    supplierName: 'YKK India',
    lastReceivedDate: '2025-09-20',
    lastIssuedDate: '2025-10-15'
  },

  // CLIENT-OWNED MATERIALS (Fabrics received for processing)
  
  // Client materials from Job Order JO-2025-001 (Shree Ganesh Textiles)
  {
    materialName: 'Cotton Fabric - Grey 150 GSM',
    onHandStock: 1000,
    unit: 'meters',
    location: 'Client Storage - Zone A',
    lastUpdated: '2025-10-18T09:30:00Z',
    notes: 'Received for dyeing - Red color required',
    materialOwnership: 'client',
    clientId: 'CLT-001',
    jobOrderId: 'JO-2025-001',
    category: 'fabrics',
    subCategory: 'Cotton Fabrics',
    stockStatus: 'healthy',
    totalValue: 0,
    daysSinceLastMovement: 3,
    batchNumber: 'CF-CLT001-2025-01',
    qualityGrade: 'A',
    lastReceivedDate: '2025-10-18'
  },
  {
    materialName: 'Cotton Fabric - Plain Weave 120 GSM',
    onHandStock: 800,
    unit: 'meters',
    location: 'Client Storage - Zone A',
    lastUpdated: '2025-10-18T09:30:00Z',
    notes: 'Secondary fabric batch for same order',
    materialOwnership: 'client',
    clientId: 'CLT-001',
    jobOrderId: 'JO-2025-001',
    category: 'fabrics',
    subCategory: 'Cotton Fabrics',
    stockStatus: 'healthy',
    totalValue: 0,
    daysSinceLastMovement: 3,
    batchNumber: 'CF-CLT001-2025-02',
    qualityGrade: 'A',
    lastReceivedDate: '2025-10-18'
  },
  
  // Client materials from Job Order JO-2025-002 (Rajesh Fabrics)
  {
    materialName: 'Cotton Blend Fabric 180 GSM',
    onHandStock: 1500,
    unit: 'meters',
    location: 'Client Storage - Zone B',
    lastUpdated: '2025-10-19T14:15:00Z',
    notes: 'For mercerizing and finishing process',
    materialOwnership: 'client',
    clientId: 'CLT-002',
    jobOrderId: 'JO-2025-002',
    category: 'fabrics',
    subCategory: 'Cotton Blend Fabrics',
    stockStatus: 'healthy',
    totalValue: 0,
    daysSinceLastMovement: 2,
    batchNumber: 'CBF-CLT002-2025-01',
    qualityGrade: 'A',
    lastReceivedDate: '2025-10-19'
  },
  
  // Client materials from Job Order JO-2025-003 (Patel Industries)
  {
    materialName: 'Polyester Cotton Blend 200 GSM',
    onHandStock: 2000,
    unit: 'meters',
    location: 'Client Storage - Zone C',
    lastUpdated: '2025-10-20T11:00:00Z',
    notes: 'Premium fabric for printing process',
    materialOwnership: 'client',
    clientId: 'CLT-003',
    jobOrderId: 'JO-2025-003',
    category: 'fabrics',
    subCategory: 'Polyester Blend Fabrics',
    stockStatus: 'healthy',
    totalValue: 0,
    daysSinceLastMovement: 1,
    batchNumber: 'PCB-CLT003-2025-01',
    qualityGrade: 'Premium',
    lastReceivedDate: '2025-10-20'
  },

  // COMPANY-OWNED RAW MATERIALS (For own manufacturing)
  
  {
    materialName: 'Cotton Yarn 30s Count',
    onHandStock: 180,
    unit: 'kg',
    location: 'Warehouse A - Section 1',
    reorderLevel: 200,
    costPerUnit: 75,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'High-quality cotton for premium orders',
    materialOwnership: 'company',
    category: 'yarns',
    subCategory: 'Cotton Yarns',
    maxStock: 1500,
    safetyStock: 300,
    stockStatus: 'low',
    averageCostPerUnit: 73,
    totalValue: 13500,
    monthlyConsumption: 250,
    turnoverRate: 0.72,
    daysSinceLastMovement: 5,
    batchNumber: 'CY30-2024-123',
    qualityGrade: 'Premium',
    supplierId: 'SUP-007',
    supplierName: 'Trident Limited',
    lastReceivedDate: '2025-09-28',
    lastIssuedDate: '2025-10-19'
  },
  {
    materialName: 'Cotton Yarn 40s Count',
    onHandStock: 1200,
    unit: 'kg',
    location: 'Warehouse A - Section 2',
    reorderLevel: 300,
    costPerUnit: 85,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Most frequently used grade',
    materialOwnership: 'company',
    category: 'yarns',
    subCategory: 'Cotton Yarns',
    maxStock: 2000,
    safetyStock: 450,
    stockStatus: 'healthy',
    averageCostPerUnit: 82,
    totalValue: 102000,
    monthlyConsumption: 400,
    turnoverRate: 3.0,
    daysSinceLastMovement: 2,
    batchNumber: 'CY40-2024-178',
    qualityGrade: 'Premium',
    supplierId: 'SUP-007',
    supplierName: 'Trident Limited',
    lastReceivedDate: '2025-10-08',
    lastIssuedDate: '2025-10-21'
  },
  {
    materialName: 'Polyester Yarn 150D',
    onHandStock: 600,
    unit: 'kg',
    location: 'Warehouse B - Section 2',
    reorderLevel: 150,
    costPerUnit: 55,
    lastUpdated: '2025-10-21T08:00:00Z',
    materialOwnership: 'company',
    category: 'yarns',
    subCategory: 'Synthetic Yarns',
    maxStock: 1000,
    safetyStock: 225,
    stockStatus: 'healthy',
    averageCostPerUnit: 53,
    totalValue: 33000,
    monthlyConsumption: 180,
    turnoverRate: 3.6,
    daysSinceLastMovement: 4,
    batchNumber: 'PY150-2024-089',
    qualityGrade: 'A',
    supplierId: 'SUP-008',
    supplierName: 'Reliance Industries',
    lastReceivedDate: '2025-10-05',
    lastIssuedDate: '2025-10-20'
  },

  // CRITICAL STOCK SCENARIOS
  {
    materialName: 'Acetic Acid',
    onHandStock: 15,
    unit: 'kg',
    location: 'Chemical Storage - C1',
    reorderLevel: 40,
    costPerUnit: 28,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'CRITICAL: Order immediately!',
    materialOwnership: 'company',
    expiryDate: '2025-11-30',
    category: 'chemicals',
    subCategory: 'Acids',
    maxStock: 200,
    safetyStock: 60,
    stockStatus: 'critical',
    averageCostPerUnit: 26,
    totalValue: 420,
    monthlyConsumption: 35,
    turnoverRate: 2.3,
    daysSinceLastMovement: 8,
    batchNumber: 'AA-2024-045',
    qualityGrade: 'Industrial',
    supplierId: 'SUP-003',
    supplierName: 'Solvay Chemicals',
    lastReceivedDate: '2025-09-10',
    lastIssuedDate: '2025-10-15'
  },
  
  // EXCESS STOCK SCENARIO
  {
    materialName: 'Packaging Plastic Rolls',
    onHandStock: 2500,
    unit: 'meters',
    location: 'Packaging Storage',
    reorderLevel: 500,
    maxStock: 1000,
    costPerUnit: 8,
    lastUpdated: '2025-10-21T08:00:00Z',
    notes: 'Excess stock - consider alternative uses',
    materialOwnership: 'company',
    category: 'packaging',
    subCategory: 'Plastic Packaging',
    safetyStock: 200,
    stockStatus: 'excess',
    averageCostPerUnit: 7.5,
    totalValue: 20000,
    monthlyConsumption: 150,
    turnoverRate: 16.7,
    daysSinceLastMovement: 15,
    batchNumber: 'PP-2024-234',
    qualityGrade: 'Standard',
    supplierId: 'SUP-009',
    supplierName: 'Uflex Limited',
    lastReceivedDate: '2025-08-15',
    lastIssuedDate: '2025-10-08'
  },

  // ADDITIONAL CLIENT MATERIALS
  {
    materialName: 'Silk Fabric - Raw 80 GSM',
    onHandStock: 500,
    unit: 'meters',
    location: 'Client Storage - Zone D',
    lastUpdated: '2025-10-20T14:30:00Z',
    notes: 'Premium silk for luxury processing',
    materialOwnership: 'client',
    clientId: 'CLT-004',
    jobOrderId: 'JO-2025-004',
    category: 'fabrics',
    subCategory: 'Silk Fabrics',
    stockStatus: 'healthy',
    totalValue: 0,
    daysSinceLastMovement: 1,
    batchNumber: 'SF-CLT004-2025-01',
    qualityGrade: 'Premium',
    lastReceivedDate: '2025-10-20'
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
 * Filter inventory by various criteria
 */
export const filterInventory = (filter: string): InventoryItem[] => {
  switch(filter) {
    case 'all':
      return mockInventory;
    case 'company':
      return mockInventory.filter(item => item.materialOwnership === 'company');
    case 'client':
      return mockInventory.filter(item => item.materialOwnership === 'client');
    case 'lowstock':
      return mockInventory.filter(item => item.stockStatus === 'low' || item.stockStatus === 'critical');
    case 'expiring':
      return getExpiringChemicals();
    default:
      return mockInventory;
  }
};

/**
 * Get materials for specific job order
 */
export const getMaterialsForJobOrder = (jobOrderId: string): InventoryItem[] => {
  return mockInventory.filter(item => 
    item.materialOwnership === 'client' && item.jobOrderId === jobOrderId
  );
};

/**
 * Get client materials for specific client
 */
export const getClientMaterials = (clientId: string): InventoryItem[] => {
  return mockInventory.filter(item => 
    item.materialOwnership === 'client' && item.clientId === clientId
  );
};

/**
 * Get inventory summary statistics
 */
export const getInventorySummary = () => {
  const total = mockInventory.length;
  const company = mockInventory.filter(item => item.materialOwnership === 'company').length;
  const client = mockInventory.filter(item => item.materialOwnership === 'client').length;
  const lowStock = mockInventory.filter(item => item.stockStatus === 'low' || item.stockStatus === 'critical').length;
  const healthyStock = mockInventory.filter(item => item.stockStatus === 'healthy').length;
  const excessStock = mockInventory.filter(item => item.stockStatus === 'excess').length;
  
  const companyValue = mockInventory
    .filter(item => item.materialOwnership === 'company')
    .reduce((sum, item) => sum + item.totalValue, 0);
  
  return {
    totalItems: total,
    companyItemsCount: company,
    clientItemsCount: client,
    lowStockItems: lowStock,
    healthyStockItems: healthyStock,
    excessStockItems: excessStock,
    totalCompanyValue: companyValue
  };
};

/**
 * Get materials below reorder level
 */
export const getMaterialsBelowReorderLevel = (): InventoryItem[] => {
  return mockInventory.filter(item => 
    item.materialOwnership === 'company' && 
    item.reorderLevel && 
    item.onHandStock <= item.reorderLevel
  );
};

/**
 * Get expiring chemicals (within 60 days)
 */
export const getExpiringChemicals = (): InventoryItem[] => {
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
  
  return mockInventory.filter(item => 
    item.category === 'chemicals' && 
    item.expiryDate && 
    new Date(item.expiryDate) <= sixtyDaysFromNow
  );
};

/**
 * Get inventory by ownership type
 */
export const getInventoryByOwnership = (ownership: 'company' | 'client'): InventoryItem[] => {
  return mockInventory.filter(item => item.materialOwnership === ownership);
};

/**
 * Get total inventory value by ownership
 */
export const getInventoryValueByOwnership = () => {
  const companyValue = mockInventory
    .filter(item => item.materialOwnership === 'company')
    .reduce((sum, item) => sum + item.totalValue, 0);
  
  const clientValue = mockInventory
    .filter(item => item.materialOwnership === 'client')
    .reduce((sum, item) => sum + item.totalValue, 0);
  
  return {
    companyValue,
    clientValue,
    totalValue: companyValue + clientValue
  };
};

// ==================== JOB ORDER MATERIAL HELPER FUNCTIONS ====================
// ✅ Moved from salesMockData.ts to eliminate dependency

/**
 * Get all client materials for a specific job order
 * Alias for getMaterialsForJobOrder for backward compatibility
 */
export const getClientMaterialsForJobOrder = (jobOrderId: string): InventoryItem[] => {
  return getMaterialsForJobOrder(jobOrderId);
};

/**
 * Get all client materials for a specific customer
 * Alias for getClientMaterials for backward compatibility
 */
export const getClientMaterialsForCustomer = (clientId: string): InventoryItem[] => {
  return getClientMaterials(clientId);
};

/**
 * Check if job order has received all expected materials
 * Note: Works with available InventoryItem properties
 */
export const validateClientMaterialsReceived = (jobOrder: { id: string; expectedClientMaterialNames: string[] }): boolean => {
  const receivedMaterials = getMaterialsForJobOrder(jobOrder.id);
  return jobOrder.expectedClientMaterialNames.every(expectedMaterial =>
    receivedMaterials.some(item => 
      item.materialName.includes(expectedMaterial)
    )
  );
};

/**
 * Get material status summary for job order
 * Uses available inventory properties: stockStatus, daysSinceLastMovement
 */
export const getJobOrderMaterialStatus = (jobOrderId: string) => {
  const materials = getMaterialsForJobOrder(jobOrderId);
  
  return {
    totalMaterials: materials.length,
    // Map inventory stockStatus to processing status
    received: materials.filter(m => m.stockStatus === 'healthy' && m.daysSinceLastMovement && m.daysSinceLastMovement < 7).length,
    inProcess: materials.filter(m => m.stockStatus === 'healthy' && m.daysSinceLastMovement && m.daysSinceLastMovement >= 7).length,
    completed: materials.filter(m => m.notes?.includes('processed') || m.notes?.includes('completed')).length
  };
};

/**
 * Get material consumption summary for job order
 * Simplified version using available inventory properties
 */
export const getJobOrderMaterialConsumption = (jobOrderId: string) => {
  const materials = getMaterialsForJobOrder(jobOrderId);
  
  const consumption = materials.reduce((acc, material) => {
    return {
      totalReceived: acc.totalReceived + material.onHandStock,
      totalConsumed: acc.totalConsumed + 0, // Would need additional tracking
      totalWaste: acc.totalWaste + 0, // Would need additional tracking
      totalReturnable: acc.totalReturnable + material.onHandStock // Assuming all returnable
    };
  }, {
    totalReceived: 0,
    totalConsumed: 0,
    totalWaste: 0,
    totalReturnable: 0
  });
  
  return {
    ...consumption,
    wastePercentage: 0, // Would need waste tracking
    consumptionPercentage: 0 // Would need consumption tracking
  };
};