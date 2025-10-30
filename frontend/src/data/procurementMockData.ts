// Procurement Domain Mock Data
// Contains: Material Requirements, Purchase Requests, Purchase Orders, Goods Receipt Notes

// ==================== PROCUREMENT INTERFACES ====================


export interface PurchaseOrder {
  id: string;
  consolidatedPrId: string; // Links to Consolidated Purchase Request
  salesOrderId: string;     // Customer sales order reference
  customerName: string;     // Customer business context
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

export interface PurchaseRequestItem {
  materialName: string;           // "Cotton Yarn 30s Count"
  requiredQuantity: number;       // 500
  unit: string;                  // "kg"
  estimatedUnitCost: number;     // 370
  estimatedTotalCost: number;    // 185,000
  forOrderItems: string[];       // ["TEX-PREM-001"] - which products need this
  urgency: 'high' | 'medium' | 'low';
  preferredVendor?: string;      // "Surat Yarn Mills"
  qualitySpecs?: string;         // "Premium Grade, 30s Count"
  deliveryRequirement?: string;  // "Deliver by Oct 25"
  notes?: string;
}

export interface ConsolidatedPurchaseRequest {
  id: string;                     // "PR-SO-002-CONSOLIDATED"
  consolidatedMrId: string;       // Links to consolidated MR
  salesOrderId: string;           // "SO-002"
  customerName: string;           // "Gujarat Garments"
  orderValue: number;             // ₹400,000 (customer order context)
  materials: PurchaseRequestItem[]; // Array of all materials
  totalEstimatedCost: number;     // ₹255,000 (total material investment)
  businessJustification: string;  // "Customer delivery commitment requires material procurement by Oct 20"
  urgency: 'high' | 'medium' | 'low';
  requiredDate: string;           // Procurement deadline
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;            // "Production Planning"
  requestDate: string;            // Creation date
  reviewedBy?: string;            // Who approved/rejected
  reviewDate?: string;            // When approved/rejected
  approvalReasoning?: string;     // Business decision context
  notes?: string;
}

// ==================== PROCUREMENT MOCK DATA ====================


export const mockPurchaseOrders: PurchaseOrder[] = [
  // Gujarat Garments Order (PR-SO-001-CONSOLIDATED) - 3 vendors
  {
    id: 'PO-001',
    consolidatedPrId: 'PR-SO-001-CONSOLIDATED',
    salesOrderId: 'SO-001',
    customerName: 'Gujarat Garments',
    supplierId: 'SUP-001',
    supplierName: 'Gujarat Chemical Industries',
    materialName: 'Red Fabric Dye',
    quantity: 25,
    unit: 'kg',
    unitPrice: 320,
    totalAmount: 8000,
    status: 'open',
    orderDate: '2025-10-20',
    expectedDelivery: '2025-10-25',
    notes: 'Part of Gujarat Garments export order materials'
  },
  {
    id: 'PO-002',
    consolidatedPrId: 'PR-SO-001-CONSOLIDATED',
    salesOrderId: 'SO-001',
    customerName: 'Gujarat Garments',
    supplierId: 'SUP-002',
    supplierName: 'Surat Yarn Mills',
    materialName: 'Cotton Yarn 30s Count',
    quantity: 500,
    unit: 'kg',
    unitPrice: 370,
    totalAmount: 185000,
    status: 'open',
    orderDate: '2025-10-20',
    expectedDelivery: '2025-10-28',
    notes: 'Premium grade for export order'
  },
  {
    id: 'PO-003',
    consolidatedPrId: 'PR-SO-001-CONSOLIDATED',
    salesOrderId: 'SO-001',
    customerName: 'Gujarat Garments',
    supplierId: 'SUP-003',
    supplierName: 'Local Thread Supplier',
    materialName: 'Cotton Thread',
    quantity: 110,
    unit: 'kg',
    unitPrice: 400,
    totalAmount: 44000,
    status: 'delivered',
    orderDate: '2025-10-20',
    expectedDelivery: '2025-10-23',
    actualDelivery: '2025-10-23',
    notes: 'Delivered on time for Gujarat Garments order'
  },
  
  // Baroda Fashion House Order (PR-SO-002-CONSOLIDATED) - 2 vendors
  {
    id: 'PO-004',
    consolidatedPrId: 'PR-SO-002-CONSOLIDATED',
    salesOrderId: 'SO-002',
    customerName: 'Baroda Fashion House',
    supplierId: 'SUP-004',
    supplierName: 'Mulberry Silk Mills',
    materialName: 'Premium Silk Yarn',
    quantity: 200,
    unit: 'kg',
    unitPrice: 2500,
    totalAmount: 500000,
    status: 'open',
    orderDate: '2025-10-22',
    expectedDelivery: '2025-11-05',
    notes: 'Luxury collection - premium quality required'
  },
  {
    id: 'PO-005',
    consolidatedPrId: 'PR-SO-002-CONSOLIDATED',
    salesOrderId: 'SO-002',
    customerName: 'Baroda Fashion House',
    supplierId: 'SUP-005',
    supplierName: 'Premium Dye Works',
    materialName: 'Gold Metallic Dye',
    quantity: 15,
    unit: 'kg',
    unitPrice: 3833,
    totalAmount: 57500,
    status: 'open',
    orderDate: '2025-10-22',
    expectedDelivery: '2025-11-01',
    notes: 'Special metallic finish for luxury collection'
  },

  // Independent PO (not from consolidated PR)
  {
    id: 'PO-006',
    consolidatedPrId: 'PR-005',
    salesOrderId: 'SO-005',
    customerName: 'Wholesale Garments Ltd',
    supplierId: 'SUP-006',
    supplierName: 'Economy Yarn Mills',
    materialName: 'Basic Cotton Yarn',
    quantity: 800,
    unit: 'kg',
    unitPrice: 160,
    totalAmount: 128000,
    status: 'delivered',
    orderDate: '2025-10-25',
    expectedDelivery: '2025-10-30',
    actualDelivery: '2025-10-29',
    notes: 'Standard quality for wholesale order'
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

// ==================== CONSOLIDATED PURCHASE REQUESTS (PHASE 3) ====================

export const mockConsolidatedPurchaseRequests: ConsolidatedPurchaseRequest[] = [
  // Gujarat Garments - Large Cotton Fabric Order
  {
    id: "PR-SO-001-CONSOLIDATED",
    consolidatedMrId: "MR-SO-001-CONSOLIDATED",
    salesOrderId: "SO-001",
    customerName: "Gujarat Garments",
    orderValue: 1480000,
    materials: [
      {
        materialName: "Cotton Yarn 30s Count",
        requiredQuantity: 500,
        unit: "kg",
        estimatedUnitCost: 370,
        estimatedTotalCost: 185000,
        forOrderItems: ["TEX-IND-001"],
        urgency: "high",
        preferredVendor: "Surat Yarn Mills",
        qualitySpecs: "Premium Grade, 30s Count, Ring Spun",
        deliveryRequirement: "Deliver by Nov 10",
        notes: "Critical for export quality requirements"
      },
      {
        materialName: "Blue Reactive Dye",
        requiredQuantity: 40,
        unit: "kg",
        estimatedUnitCost: 850,
        estimatedTotalCost: 34000,
        forOrderItems: ["TEX-IND-001"],
        urgency: "high",
        preferredVendor: "Chemical Solutions Ltd",
        qualitySpecs: "Reactive Blue 19, Export Grade",
        deliveryRequirement: "Deliver by Nov 10",
        notes: "Color fastness critical for export"
      },
      {
        materialName: "Fixing Agent Chemicals",
        requiredQuantity: 15,
        unit: "kg",
        estimatedUnitCost: 1200,
        estimatedTotalCost: 18000,
        forOrderItems: ["TEX-IND-001"],
        urgency: "medium",
        preferredVendor: "Chemical Solutions Ltd",
        qualitySpecs: "Industrial Grade Fixing Agent",
        deliveryRequirement: "Deliver by Nov 10"
      }
    ],
    totalEstimatedCost: 237000,
    businessJustification: "Customer Gujarat Garments delivery commitment Nov 15 requires material procurement by Nov 10 to meet production timeline",
    urgency: "high",
    requiredDate: "2025-11-10",
    status: "pending",
    requestedBy: "Production Planning",
    requestDate: "2025-10-20",
    notes: "Export quality requirements - cannot compromise on material standards"
  },

  // Baroda Fashion House - Premium Silk Order  
  {
    id: "PR-SO-004-CONSOLIDATED",
    consolidatedMrId: "MR-SO-004-CONSOLIDATED",
    salesOrderId: "SO-004",
    customerName: "Baroda Fashion House",
    orderValue: 1575000,
    materials: [
      {
        materialName: "Raw Silk Threads",
        requiredQuantity: 200,
        unit: "kg", 
        estimatedUnitCost: 2500,
        estimatedTotalCost: 500000,
        forOrderItems: ["TEX-SILK-001"],
        urgency: "high",
        preferredVendor: "Karnataka Silk Board",
        qualitySpecs: "Grade A Raw Silk, Mulberry",
        deliveryRequirement: "Deliver by Nov 20",
        notes: "Premium quality for luxury fashion line"
      },
      {
        materialName: "Gold Metallic Dye",
        requiredQuantity: 10,
        unit: "kg",
        estimatedUnitCost: 3500,
        estimatedTotalCost: 35000,
        forOrderItems: ["TEX-SILK-001"],
        urgency: "high",
        preferredVendor: "Luxury Chemicals Co",
        qualitySpecs: "Metallic Gold, Fashion Grade",
        deliveryRequirement: "Deliver by Nov 20"
      },
      {
        materialName: "Polyester Reinforcement Thread",
        requiredQuantity: 50,
        unit: "kg",
        estimatedUnitCost: 450,
        estimatedTotalCost: 22500,
        forOrderItems: ["TEX-SILK-001"],
        urgency: "medium",
        preferredVendor: "Thread Masters Ltd",
        qualitySpecs: "High Tensile Strength, Fashion Grade",
        deliveryRequirement: "Deliver by Nov 20"
      }
    ],
    totalEstimatedCost: 557500,
    businessJustification: "Premium silk order for Baroda Fashion House luxury collection requires high-value materials for fashion-grade quality standards",
    urgency: "high",
    requiredDate: "2025-11-20",
    status: "pending",
    requestedBy: "Production Planning",
    requestDate: "2025-10-22",
    notes: "Luxury fashion requirements - premium materials justify higher cost percentage"
  },

  // Gujarat Garments - Standard Cotton Order (Approved Example)
  {
    id: "PR-SO-002-CONSOLIDATED",
    consolidatedMrId: "MR-SO-002-CONSOLIDATED",
    salesOrderId: "SO-002",
    customerName: "Gujarat Garments",
    orderValue: 1155000,
    materials: [
      {
        materialName: "Cotton Yarn 40s Count",
        requiredQuantity: 300,
        unit: "kg",
        estimatedUnitCost: 320,
        estimatedTotalCost: 96000,
        forOrderItems: ["TEX-STD-001"],
        urgency: "medium",
        preferredVendor: "Surat Yarn Mills",
        qualitySpecs: "Standard Grade, 40s Count",
        deliveryRequirement: "Deliver by Nov 5",
        notes: "Regular domestic quality"
      },
      {
        materialName: "Red Reactive Dye",
        requiredQuantity: 25,
        unit: "kg",
        estimatedUnitCost: 750,
        estimatedTotalCost: 18750,
        forOrderItems: ["TEX-STD-001"],
        urgency: "medium",
        preferredVendor: "Local Dye House",
        qualitySpecs: "Standard Grade Red",
        deliveryRequirement: "Deliver by Nov 5"
      },
      {
        materialName: "Common Salt for Dyeing",
        requiredQuantity: 100,
        unit: "kg",
        estimatedUnitCost: 25,
        estimatedTotalCost: 2500,
        forOrderItems: ["TEX-STD-001"],
        urgency: "low",
        preferredVendor: "Local Supplier",
        qualitySpecs: "Industrial Grade Salt",
        deliveryRequirement: "Deliver by Nov 5"
      }
    ],
    totalEstimatedCost: 117250,
    businessJustification: "Standard domestic order for Gujarat Garments with immediate procurement to maintain production schedule",
    urgency: "medium",
    requiredDate: "2025-11-05",
    status: "approved",
    requestedBy: "Production Planning",
    requestDate: "2025-10-15",
    reviewedBy: "Production Manager",
    reviewDate: "2025-10-18",
    approvalReasoning: "Standard domestic quality materials approved for efficient cost management",
    notes: "Standard domestic quality - cost-efficient materials"
  },

  // Baroda Fashion House - High Priority Rush Order
  {
    id: "PR-SO-003-CONSOLIDATED", 
    consolidatedMrId: "MR-SO-003-CONSOLIDATED",
    salesOrderId: "SO-003",
    customerName: "Baroda Fashion House",
    orderValue: 892500,
    materials: [
      {
        materialName: "Heavy Canvas Fabric Base",
        requiredQuantity: 400,
        unit: "meters",
        estimatedUnitCost: 180,
        estimatedTotalCost: 72000,
        forOrderItems: ["TEX-CAN-001"],
        urgency: "high",
        preferredVendor: "Industrial Fabrics Co",
        qualitySpecs: "Heavy Duty Canvas, 350 GSM",
        deliveryRequirement: "URGENT: Deliver by Oct 30",
        notes: "Industrial strength required"
      },
      {
        materialName: "Waterproof Coating Wax",
        requiredQuantity: 50,
        unit: "kg",
        estimatedUnitCost: 850,
        estimatedTotalCost: 42500,
        forOrderItems: ["TEX-CAN-001"],
        urgency: "high",
        preferredVendor: "Specialty Chemicals",
        qualitySpecs: "Marine Grade Waterproofing",
        deliveryRequirement: "URGENT: Deliver by Oct 30"
      },
      {
        materialName: "Heavy Duty Thread",
        requiredQuantity: 30,
        unit: "kg",
        estimatedUnitCost: 650,
        estimatedTotalCost: 19500,
        forOrderItems: ["TEX-CAN-001"],
        urgency: "high",
        preferredVendor: "Thread Masters Ltd",
        qualitySpecs: "Industrial Strength, Polyester Core",
        deliveryRequirement: "URGENT: Deliver by Oct 30"
      }
    ],
    totalEstimatedCost: 134000,
    businessJustification: "URGENT: Rush order for Baroda Fashion House customer needs delivery by November 5 for their urgent project",
    urgency: "high",
    requiredDate: "2025-10-30",
    status: "pending",
    requestedBy: "Production Planning",
    requestDate: "2025-10-25",
    notes: "RUSH ORDER - Premium pricing acceptable for urgent delivery"
  },

  // Surat Wholesale - Low Cost Example
  {
    id: "PR-SO-005-CONSOLIDATED",
    consolidatedMrId: "MR-SO-005-CONSOLIDATED", 
    salesOrderId: "SO-005",
    customerName: "Surat Wholesale Market",
    orderValue: 675000,
    materials: [
      {
        materialName: "Cotton Yarn 20s Count",
        requiredQuantity: 400,
        unit: "kg",
        estimatedUnitCost: 280,
        estimatedTotalCost: 112000,
        forOrderItems: ["TEX-WHL-001"],
        urgency: "low",
        preferredVendor: "Economy Yarn Mills",
        qualitySpecs: "Basic Grade, 20s Count",
        deliveryRequirement: "Deliver by Nov 25",
        notes: "Cost-optimized for wholesale market"
      },
      {
        materialName: "Mixed Basic Dyes",
        requiredQuantity: 35,
        unit: "kg",
        estimatedUnitCost: 450,
        estimatedTotalCost: 15750,
        forOrderItems: ["TEX-WHL-001"],
        urgency: "low",
        preferredVendor: "Budget Dyes Co",
        qualitySpecs: "Basic Color Mix for Wholesale",
        deliveryRequirement: "Deliver by Nov 25"
      }
    ],
    totalEstimatedCost: 127750,
    businessJustification: "New wholesale customer order with cost-efficient materials for competitive pricing and standard delivery timeline",
    urgency: "low",
    requiredDate: "2025-11-25",
    status: "pending",
    requestedBy: "Production Planning",
    requestDate: "2025-10-28",
    notes: "Price-sensitive wholesale order - focus on cost optimization"
  }
];