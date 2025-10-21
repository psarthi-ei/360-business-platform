// Stock Reservations Mock Data
// Tracks soft and hard reservations for material allocation management

// ==================== STOCK RESERVATION INTERFACES ====================

export interface StockReservation {
  id: string;
  orderId: string;
  workOrderId?: string;        // Present for hard reservations
  materialName: string;
  quantity: number;
  type: 'soft' | 'hard';
  status: 'active' | 'consumed' | 'released';
  createdDate: string;
  reservedBy: string;
  releasedDate?: string;
  consumedDate?: string;
  notes?: string;
}

// ==================== STOCK RESERVATION MOCK DATA ====================

export const mockStockReservations: StockReservation[] = [
  // Soft Reservations - Orders with advance payment received but production not started
  
  // SO-001 - Soft reserved (ready for production)
  {
    id: 'RES-001',
    orderId: 'SO-001',
    materialName: 'Cotton Yarn 40s Count',
    quantity: 300,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T09:00:00Z',
    reservedBy: 'system',
    notes: 'Premium customer - priority allocation'
  },
  
  // SO-002 - Soft reserved (multiple materials)
  {
    id: 'RES-002',
    orderId: 'SO-002',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 500,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T10:30:00Z',
    reservedBy: 'system'
  },
  {
    id: 'RES-003',
    orderId: 'SO-002',
    materialName: 'Red Dye Chemical',
    quantity: 50,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T10:30:00Z',
    reservedBy: 'system'
  },
  {
    id: 'RES-004',
    orderId: 'SO-002',
    materialName: 'Cotton Fabric 150 GSM',
    quantity: 1000,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T10:30:00Z',
    reservedBy: 'system'
  },
  
  // SO-004 - Soft reserved (seasonal collection)
  {
    id: 'RES-005',
    orderId: 'SO-004',
    materialName: 'Polyester Thread',
    quantity: 100,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T14:00:00Z',
    reservedBy: 'system'
  },
  {
    id: 'RES-006',
    orderId: 'SO-004',
    materialName: 'Cotton Fabric Base',
    quantity: 200,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T14:00:00Z',
    reservedBy: 'system'
  },
  {
    id: 'RES-007',
    orderId: 'SO-004',
    materialName: 'Zipper - Metal 12 inch',
    quantity: 200,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-20T14:00:00Z',
    reservedBy: 'system'
  },
  
  // Hard Reservations - Orders in production (materials physically blocked)
  
  // SO-005 - Soft reserved (competing for Cotton Yarn 40s)
  {
    id: 'RES-008',
    orderId: 'SO-005',
    materialName: 'Cotton Yarn 40s Count',
    quantity: 600,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-21T11:00:00Z',
    reservedBy: 'system',
    notes: 'Bulk order - high volume allocation'
  },
  {
    id: 'RES-009',
    orderId: 'SO-005',
    materialName: 'Blue Dye Chemical',
    quantity: 45,
    type: 'soft',
    status: 'active',
    createdDate: '2025-10-21T11:00:00Z',
    reservedBy: 'system'
  },

  // SO-003 - Hard reserved (production started)
  {
    id: 'RES-010',
    orderId: 'SO-003',
    workOrderId: 'WO-2025-003A',
    materialName: 'Polyester Yarn 150D',
    quantity: 400,
    type: 'hard',
    status: 'active',
    createdDate: '2025-10-19T08:00:00Z',
    reservedBy: 'production',
    notes: 'Production started - materials allocated to WO-2025-003A'
  },
  
  // Historical - Released reservations (cancelled orders)
  {
    id: 'RES-011',
    orderId: 'SO-007',
    materialName: 'Cotton Yarn 40s Count',
    quantity: 250,
    type: 'soft',
    status: 'released',
    createdDate: '2025-10-18T11:00:00Z',
    reservedBy: 'system',
    releasedDate: '2025-10-20T16:00:00Z',
    notes: 'Order cancelled by customer - materials released back to inventory'
  },
  
  // Historical - Consumed reservations (completed orders)
  {
    id: 'RES-012',
    orderId: 'SO-008',
    workOrderId: 'WO-2025-008A',
    materialName: 'Cotton Thread - White',
    quantity: 50,
    type: 'hard',
    status: 'consumed',
    createdDate: '2025-10-15T09:00:00Z',
    reservedBy: 'production',
    consumedDate: '2025-10-19T17:00:00Z',
    notes: 'Order completed and delivered - materials consumed'
  }
];

// ==================== STOCK RESERVATION HELPER FUNCTIONS ====================

/**
 * Get all active soft reservations for a material
 */
export const getSoftReservedQuantity = (materialName: string): number => {
  return mockStockReservations
    .filter(res => 
      res.materialName === materialName && 
      res.type === 'soft' && 
      res.status === 'active'
    )
    .reduce((total, res) => total + res.quantity, 0);
};

/**
 * Get all active hard reservations for a material
 */
export const getHardReservedQuantity = (materialName: string): number => {
  return mockStockReservations
    .filter(res => 
      res.materialName === materialName && 
      res.type === 'hard' && 
      res.status === 'active'
    )
    .reduce((total, res) => total + res.quantity, 0);
};

/**
 * Get total reserved quantity (soft + hard) for a material
 */
export const getTotalReservedQuantity = (materialName: string): number => {
  return getSoftReservedQuantity(materialName) + getHardReservedQuantity(materialName);
};

/**
 * Get all reservations for a specific order
 */
export const getOrderReservations = (orderId: string): StockReservation[] => {
  return mockStockReservations.filter(res => res.orderId === orderId);
};

/**
 * Get active reservations for a specific order
 */
export const getActiveOrderReservations = (orderId: string): StockReservation[] => {
  return mockStockReservations.filter(res => 
    res.orderId === orderId && res.status === 'active'
  );
};

/**
 * Check if order has any active reservations
 */
export const hasActiveReservations = (orderId: string): boolean => {
  return getActiveOrderReservations(orderId).length > 0;
};

/**
 * Get reservation type for an order (soft/hard/mixed/none)
 */
export const getOrderReservationType = (orderId: string): 'soft' | 'hard' | 'mixed' | 'none' => {
  const activeReservations = getActiveOrderReservations(orderId);
  
  if (activeReservations.length === 0) return 'none';
  
  const hasSoft = activeReservations.some(res => res.type === 'soft');
  const hasHard = activeReservations.some(res => res.type === 'hard');
  
  if (hasSoft && hasHard) return 'mixed';
  if (hasHard) return 'hard';
  return 'soft';
};

/**
 * Get reservation summary for dashboard
 */
export const getReservationSummary = () => {
  const activeReservations = mockStockReservations.filter(res => res.status === 'active');
  const softReservations = activeReservations.filter(res => res.type === 'soft').length;
  const hardReservations = activeReservations.filter(res => res.type === 'hard').length;
  
  return {
    totalActive: activeReservations.length,
    softReservations,
    hardReservations,
    lastUpdated: new Date().toISOString()
  };
};