// Procurement Domain Mock Data
// Contains: Material Requirements, Purchase Requests, Purchase Orders, Goods Receipt Notes

// ==================== PROCUREMENT INTERFACES ====================

export interface MaterialRequirement {
  id: string;
  orderId: string;
  materialName: string;
  requiredQuantity: number;
  unit: string;
  urgency: 'high' | 'medium' | 'low';
  requiredDate: string;
  notes?: string;
  // ✅ REMOVED: currentStock, shortfall, status (these are dynamic and calculated)
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

// ==================== CONSOLIDATED INTERFACES (PHASE 3) ====================

export interface MaterialItem {
  materialName: string;           // "Cotton Yarn 30s Count"
  requiredQuantity: number;       // 500
  unit: string;                  // "kg"
  urgency: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface ConsolidatedMaterialRequirement {
  id: string;                     // "MR-SO-002-CONSOLIDATED"
  salesOrderId: string;           // "SO-002"
  customerName: string;           // "Gujarat Garments"
  orderValue: number;             // ₹400,000 (customer order total)
  materials: MaterialItem[];      // Array of all materials for this order
  urgency: 'high' | 'medium' | 'low';
  requiredDate: string;           // Customer delivery date
  businessJustification: string;  // "Customer delivery commitment Nov 15"
  createdDate: string;
  notes?: string;
  linkedPR?: string;              // Linked PR number like "PR-001"
}

// ==================== PROCUREMENT MOCK DATA ====================

// Purchase Requests matching Visual Design Spec format
export const mockPurchaseRequests: PurchaseRequest[] = [
  // PR#2025-089 — Cotton Yarn for SO-002
  {
    id: 'PR-2025-089',
    mrId: 'MR-001',
    requestedBy: 'Rajesh Kumar',
    department: 'Production',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 300,
    unit: 'kg',
    estimatedCost: 22500,
    justification: 'Critical shortage blocking Order SO-002 (Gujarat Garments)',
    status: 'pending',
    requestDate: '2025-10-15',
    notes: 'Urgent approval needed'
  },
  {
    id: 'PR-2025-090',
    mrId: 'MR-003',
    requestedBy: 'Priya Sharma',
    department: 'Dyeing',
    materialName: 'Red Dye Chemical',
    quantity: 40,
    unit: 'kg',
    estimatedCost: 8000,
    justification: 'Shortage for dyeing process Order SO-002 batch 2',
    status: 'approved',
    requestDate: '2025-10-18',
    reviewedBy: 'Suresh Patel',
    reviewDate: '2025-10-19',
    notes: 'Approved for immediate procurement'
  },
  {
    id: 'PR-2025-091',
    mrId: 'MR-004',
    requestedBy: 'Amit Jain',
    department: 'Production',
    materialName: 'Cotton Fabric 150 GSM',
    quantity: 200,
    unit: 'meters',
    estimatedCost: 12000,
    justification: 'Additional requirement for Order SO-002 (Gujarat Garments)',
    status: 'rejected',
    requestDate: '2025-10-17',
    reviewedBy: 'Suresh Patel',
    reviewDate: '2025-10-18',
    notes: 'Use existing stock from warehouse B'
  },
  {
    id: 'PR-2025-092',
    mrId: 'MR-001',
    requestedBy: 'Production Manager',
    department: 'Production',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 300,
    unit: 'kg',
    estimatedCost: 22500,
    justification: 'Urgent requirement for export order',
    status: 'pending',
    requestDate: '2025-10-19',
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
    orderDate: '2025-10-19',
    expectedDelivery: '2025-10-21',
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
    orderDate: '2025-10-15',
    expectedDelivery: '2025-10-18',
    actualDelivery: '2025-10-18',
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
    receiptDate: '2025-10-18',
    inspectedBy: 'Quality Team',
    inspectionDate: '2025-10-18',
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
    receiptDate: '2025-10-19',
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
    receiptDate: '2025-10-17',
    inspectedBy: 'Quality Team',
    inspectionDate: '2025-10-17',
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
    receiptDate: '2025-10-16',
    inspectedBy: 'Quality Team',
    inspectionDate: '2025-10-16',
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
    receiptDate: '2025-10-20',
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
    receiptDate: '2025-10-15',
    inspectedBy: 'Quality Team',
    inspectionDate: '2025-10-15',
    notes: 'Over delivery - bonus 5kg received, excellent quality'
  }
];

// ==================== CONSOLIDATED MATERIAL REQUIREMENTS (PHASE 3) ====================

export const mockConsolidatedMaterialRequirements: ConsolidatedMaterialRequirement[] = [
  // Gujarat Garments - Large Cotton Fabric Order
  {
    id: "MR-SO-001-CONSOLIDATED",
    salesOrderId: "SO-001",
    customerName: "Gujarat Garments",
    orderValue: 1480000, // ₹14.8L order
    materials: [
      {
        materialName: "Cotton Yarn 30s Count",
        requiredQuantity: 500,
        unit: "kg",
        urgency: "high",
        notes: "Critical for export quality requirements"
      },
      {
        materialName: "Blue Reactive Dye",
        requiredQuantity: 40,
        unit: "kg",
        urgency: "high",
        notes: "Color fastness critical for export"
      },
      {
        materialName: "Fixing Agent Chemicals",
        requiredQuantity: 15,
        unit: "kg",
        urgency: "medium"
      }
    ],
    urgency: "high",
    requiredDate: "2025-11-10", // 5 days before delivery
    businessJustification: "Export order for Gujarat Garments. Customer delivery November 15 requires material procurement by November 10 to meet production timeline.",
    createdDate: "2025-10-20",
    notes: "Export quality requirements - cannot compromise on material standards",
    linkedPR: "PR-001"
  },

  // Baroda Fashion House - Premium Silk Order
  {
    id: "MR-SO-004-CONSOLIDATED",
    salesOrderId: "SO-004",
    customerName: "Baroda Fashion House",
    orderValue: 1575000, // ₹15.75L order
    materials: [
      {
        materialName: "Raw Silk Threads",
        requiredQuantity: 200,
        unit: "kg",
        urgency: "high",
        notes: "Premium quality for luxury fashion line"
      },
      {
        materialName: "Gold Metallic Dye",
        requiredQuantity: 10,
        unit: "kg",
        urgency: "high"
      },
      {
        materialName: "Polyester Reinforcement Thread",
        requiredQuantity: 50,
        unit: "kg",
        urgency: "medium"
      }
    ],
    urgency: "high",
    requiredDate: "2025-11-20",
    businessJustification: "Premium silk order for Baroda Fashion House luxury collection. High-value materials required for fashion-grade quality standards.",
    createdDate: "2025-10-22",
    linkedPR: "PR-002",
    notes: "Luxury fashion requirements - premium materials justify higher cost percentage"
  },

  // Gujarat Garments - Standard Cotton Order (Approved Example)
  {
    id: "MR-SO-002-CONSOLIDATED", 
    salesOrderId: "SO-002",
    customerName: "Gujarat Garments",
    orderValue: 1155000, // ₹11.55L order
    materials: [
      {
        materialName: "Cotton Yarn 40s Count",
        requiredQuantity: 300,
        unit: "kg",
        urgency: "medium",
        notes: "Regular domestic quality"
      },
      {
        materialName: "Red Reactive Dye",
        requiredQuantity: 25,
        unit: "kg",
        urgency: "medium"
      },
      {
        materialName: "Common Salt for Dyeing",
        requiredQuantity: 100,
        unit: "kg",
        urgency: "low"
      }
    ],
    urgency: "medium",
    requiredDate: "2025-11-05",
    businessJustification: "Standard domestic order for Gujarat Garments. Materials ready for immediate procurement to maintain production schedule.",
    createdDate: "2025-10-15",
    linkedPR: "PR-003",
    notes: "Standard domestic quality - cost-efficient materials"
  },

  // Baroda Fashion House - High Priority Rush Order
  {
    id: "MR-SO-003-CONSOLIDATED",
    salesOrderId: "SO-003", 
    customerName: "Baroda Fashion House",
    orderValue: 892500, // ₹8.93L order
    materials: [
      {
        materialName: "Heavy Canvas Fabric Base",
        requiredQuantity: 400,
        unit: "meters",
        urgency: "high",
        notes: "Industrial strength required"
      },
      {
        materialName: "Waterproof Coating Wax",
        requiredQuantity: 50,
        unit: "kg",
        urgency: "high"
      },
      {
        materialName: "Heavy Duty Thread",
        requiredQuantity: 30,
        unit: "kg",
        urgency: "high"
      }
    ],
    urgency: "high",
    requiredDate: "2025-10-30",
    businessJustification: "URGENT: Rush order for Baroda Fashion House. Customer needs delivery by November 5 for their urgent project. Material needed immediately.",
    createdDate: "2025-10-25",
    linkedPR: "PR-004",
    notes: "RUSH ORDER - Premium pricing acceptable for urgent delivery"
  },

  // New Customer - Surat Wholesale (Low Cost Example)
  {
    id: "MR-SO-005-CONSOLIDATED",
    salesOrderId: "SO-005",
    customerName: "Surat Wholesale Market", 
    orderValue: 675000, // ₹6.75L order
    materials: [
      {
        materialName: "Cotton Yarn 20s Count",
        requiredQuantity: 400,
        unit: "kg",
        urgency: "low",
        notes: "Cost-optimized for wholesale market"
      },
      {
        materialName: "Mixed Basic Dyes",
        requiredQuantity: 35,
        unit: "kg",
        urgency: "low"
      }
    ],
    urgency: "low",
    requiredDate: "2025-11-25",
    businessJustification: "New wholesale customer order. Cost-efficient materials for competitive pricing. Standard delivery timeline acceptable.",
    createdDate: "2025-10-28",
    linkedPR: "PR-005",
    notes: "Price-sensitive wholesale order - focus on cost optimization"
  }
];