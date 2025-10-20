// Procurement Domain Mock Data
// Contains: Material Requirements, Purchase Requests, Purchase Orders, Goods Receipt Notes

// ==================== PROCUREMENT INTERFACES ====================

export interface MaterialRequirement {
  id: string;
  orderId: string;
  materialName: string;
  requiredQuantity: number;
  currentStock: number;
  shortfall: number;
  unit: string;
  status: 'shortage' | 'available' | 'ordered';
  urgency: 'high' | 'medium' | 'low';
  requiredDate: string;
  notes?: string;
}

export interface PurchaseRequest {
  id: string;
  mrId: string; // Links to Material Requirement
  requestedBy: string;
  department: string;
  materialName: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  prId: string; // Links to Purchase Request
  supplierId: string;
  supplierName: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  status: 'open' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  notes?: string;
}

export interface GoodsReceiptNote {
  id: string;
  poId: string; // Links to Purchase Order
  receivedBy: string;
  materialName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  qualityStatus: 'pending' | 'approved' | 'rejected';
  receiptDate: string;
  inspectedBy?: string;
  inspectionDate?: string;
  notes?: string;
}

// ==================== PROCUREMENT MOCK DATA ====================

// Material Requirements grouped by Order - using proper sales order IDs
export const mockMaterialRequirements: MaterialRequirement[] = [
  // Order SO-002 — Mixed fabric for casual wear - Cotton Yarn Short
  {
    id: 'MR-001',
    orderId: 'SO-002', // References existing sales order
    materialName: 'Cotton Yarn 30s Count',
    requiredQuantity: 500,
    currentStock: 200,
    shortfall: 300,
    unit: 'kg',
    status: 'shortage',
    urgency: 'high',
    requiredDate: '2024-10-25',
    notes: 'Production blocked without this material'
  },
  
  // Order SO-004 — Updated seasonal collection - All Materials OK ✅
  {
    id: 'MR-002',
    orderId: 'SO-004', // References existing sales order
    materialName: 'Polyester Thread',
    requiredQuantity: 100,
    currentStock: 150,
    shortfall: 0,
    unit: 'kg',
    status: 'available',
    urgency: 'low',
    requiredDate: '2024-10-30'
  },
  {
    id: 'MR-002B',
    orderId: 'SO-004', // References existing sales order
    materialName: 'Cotton Fabric Base',
    requiredQuantity: 200,
    currentStock: 220,
    shortfall: 0,
    unit: 'meters',
    status: 'available',
    urgency: 'low',
    requiredDate: '2024-10-30'
  },
  
  // Order SO-002 — Mixed fabric batch 2 - Dye Shortage
  {
    id: 'MR-003',
    orderId: 'SO-002', // Second batch of same order
    materialName: 'Red Dye Chemical',
    requiredQuantity: 50,
    currentStock: 10,
    shortfall: 40,
    unit: 'kg',
    status: 'shortage',
    urgency: 'high',
    requiredDate: '2024-10-22',
    notes: 'Dyeing process cannot start without this'
  },
  
  // Additional orders for completeness - using work order materials
  {
    id: 'MR-004',
    orderId: 'SO-002', // Additional materials for large order
    materialName: 'Cotton Fabric 150 GSM',
    requiredQuantity: 1000,
    currentStock: 800,
    shortfall: 200,
    unit: 'meters',
    status: 'shortage',
    urgency: 'medium',
    requiredDate: '2024-11-01'
  },
  {
    id: 'MR-005',
    orderId: 'SO-004', // Accessories for seasonal collection
    materialName: 'Zipper - Metal 12 inch',
    requiredQuantity: 200,
    currentStock: 250,
    shortfall: 0,
    unit: 'pieces',
    status: 'available',
    urgency: 'low',
    requiredDate: '2024-11-05'
  }
];

// Purchase Requests matching Visual Design Spec format
export const mockPurchaseRequests: PurchaseRequest[] = [
  // PR#2024-089 — Cotton Yarn for SO-002
  {
    id: 'PR-2024-089',
    mrId: 'MR-001',
    requestedBy: 'Rajesh Kumar',
    department: 'Production',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 300,
    unit: 'kg',
    estimatedCost: 22500,
    justification: 'Critical shortage blocking Order SO-002 (Gujarat Garments)',
    status: 'pending',
    requestDate: '2024-10-15',
    notes: 'Urgent approval needed'
  },
  {
    id: 'PR-2024-090',
    mrId: 'MR-003',
    requestedBy: 'Priya Sharma',
    department: 'Dyeing',
    materialName: 'Red Dye Chemical',
    quantity: 40,
    unit: 'kg',
    estimatedCost: 8000,
    justification: 'Shortage for dyeing process Order SO-002 batch 2',
    status: 'approved',
    requestDate: '2024-10-18',
    reviewedBy: 'Suresh Patel',
    reviewDate: '2024-10-19',
    notes: 'Approved for immediate procurement'
  },
  {
    id: 'PR-2024-091',
    mrId: 'MR-004',
    requestedBy: 'Amit Jain',
    department: 'Production',
    materialName: 'Cotton Fabric 150 GSM',
    quantity: 200,
    unit: 'meters',
    estimatedCost: 12000,
    justification: 'Additional requirement for Order SO-002 (Gujarat Garments)',
    status: 'rejected',
    requestDate: '2024-10-17',
    reviewedBy: 'Suresh Patel',
    reviewDate: '2024-10-18',
    notes: 'Use existing stock from warehouse B'
  },
  {
    id: 'PR-2024-092',
    mrId: 'MR-001',
    requestedBy: 'Production Manager',
    department: 'Production',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 300,
    unit: 'kg',
    estimatedCost: 22500,
    justification: 'Urgent requirement for export order',
    status: 'pending',
    requestDate: '2024-10-19',
    notes: 'High priority - customer waiting'
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    prId: 'PR-002',
    supplierId: 'SUP-001',
    supplierName: 'Gujarat Chemical Industries',
    materialName: 'Red Fabric Dye',
    quantity: 40,
    unit: 'kg',
    unitPrice: 200,
    totalAmount: 8000,
    status: 'open',
    orderDate: '2024-10-19',
    expectedDelivery: '2024-10-21',
    notes: 'Rush order - production dependency'
  },
  {
    id: 'PO-002',
    prId: 'PR-004',
    supplierId: 'SUP-002',
    supplierName: 'Surat Yarn Mills',
    materialName: 'Cotton Yarn 40s Count',
    quantity: 500,
    unit: 'kg',
    unitPrice: 140,
    totalAmount: 70000,
    status: 'delivered',
    orderDate: '2024-10-15',
    expectedDelivery: '2024-10-18',
    actualDelivery: '2024-10-18',
    notes: 'Delivered on time, good quality'
  }
];

export const mockGoodsReceiptNotes: GoodsReceiptNote[] = [
  {
    id: 'GRN-001',
    poId: 'PO-002',
    receivedBy: 'Warehouse Team',
    materialName: 'Cotton Yarn 40s Count',
    orderedQuantity: 500,
    receivedQuantity: 500,
    unit: 'kg',
    qualityStatus: 'approved',
    receiptDate: '2024-10-18',
    inspectedBy: 'Quality Team',
    inspectionDate: '2024-10-18',
    notes: 'Good quality, no defects found'
  },
  {
    id: 'GRN-002',
    poId: 'PO-003',
    receivedBy: 'Warehouse Team',
    materialName: 'Polyester Thread',
    orderedQuantity: 200,
    receivedQuantity: 190,
    unit: 'kg',
    qualityStatus: 'pending',
    receiptDate: '2024-10-19',
    notes: 'Short delivery - 10kg less than ordered'
  },
  {
    id: 'GRN-003',
    poId: 'PO-001',
    receivedBy: 'Warehouse Team',
    materialName: 'Blue Dye Chemical',
    orderedQuantity: 50,
    receivedQuantity: 50,
    unit: 'kg',
    qualityStatus: 'rejected',
    receiptDate: '2024-10-17',
    inspectedBy: 'Quality Team',
    inspectionDate: '2024-10-17',
    notes: 'Color consistency issues - returned to supplier'
  },
  {
    id: 'GRN-004',
    poId: 'PO-004',
    receivedBy: 'Warehouse Team',
    materialName: 'Cotton Fabric 120 GSM',
    orderedQuantity: 300,
    receivedQuantity: 300,
    unit: 'meters',
    qualityStatus: 'approved',
    receiptDate: '2024-10-16',
    inspectedBy: 'Quality Team',
    inspectionDate: '2024-10-16',
    notes: 'Excellent quality, meets specifications'
  },
  {
    id: 'GRN-005',
    poId: 'PO-005',
    receivedBy: 'Warehouse Team',
    materialName: 'Metal Zippers 12 inch',
    orderedQuantity: 1000,
    receivedQuantity: 950,
    unit: 'pieces',
    qualityStatus: 'pending',
    receiptDate: '2024-10-20',
    notes: 'Partial delivery - 50 pieces short, quality check in progress'
  },
  {
    id: 'GRN-006',
    poId: 'PO-006',
    receivedBy: 'Warehouse Team',
    materialName: 'Reactive Dyes - Red',
    orderedQuantity: 25,
    receivedQuantity: 30,
    unit: 'kg',
    qualityStatus: 'approved',
    receiptDate: '2024-10-15',
    inspectedBy: 'Quality Team',
    inspectionDate: '2024-10-15',
    notes: 'Over delivery - bonus 5kg received, excellent quality'
  }
];