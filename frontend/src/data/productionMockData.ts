// productionMockData.ts - Comprehensive Production Data Based on Visual Design Specification

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'busy' | 'maintenance' | 'setup';
  capacity: string; // e.g., "100m/h"
  currentWorkOrder?: string;
  assignedWorker?: string;
  efficiency?: number; // percentage
  nextAvailable?: string;
  estimatedCompletion?: string;
  maintenanceReason?: string;
  output?: string; // current output rate
}

export interface WorkOrder {
  id: string;
  productionOrderId: string; // Links to ProductionOrder (ERP standard)
  salesOrderId: string;
  product: string;
  customer: string;
  batchNumber: string;
  targetQuantity: string;
  producedQuantity: string;
  remainingQuantity: string;
  progress: number; // percentage
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'ready_qc' | 'qc_approved' | 'qc_rejected' | 'ready_for_delivery' | 'dispatched' | 'delivered' | 'rework_required';
  assignedMachine: string;
  assignedWorker: string;
  startTime?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  priority: 'normal' | 'urgent' | 'high';
  materialAllocations?: WorkOrderMaterialAllocation[];
  statusHistory?: StatusHistoryEntry[];
  qualityGrade?: string;
  notes?: string;
  issues?: string[];
  createdDate: string;
}

// Job Work Production - Customer Fabric Tracking for Surat Processing
export interface ProductionOrder {
  id: string;
  salesOrderId: string; // Links to Job Order (customer order)
  customerId: string;   // Customer who provided fabric
  customerName: string; // For display purposes
  fabricDetails: {
    type: string;       // Cotton, Silk, Polyester, etc.
    quantity: number;   // Total fabric quantity
    unit: 'meters' | 'yards' | 'kg';
    challanReference: string; // Customer's delivery challan
    qualityGrade?: string;    // A-Grade, B-Grade, etc.
    colors?: string[];        // If pre-dyed fabric
    specialInstructions?: string; // Customer requirements
  };
  workOrderIds: string[];     // Multiple lots created from this production order
  status: 'awaiting_material' | 'material_received' | 'awaiting_work_order_creation' | 'ready_for_production' | 'in_progress' | 'completed' | 'awaiting_qc' | 'quality_issues' | 'ready_for_delivery' | 'partial_delivery';
  inwardEntryId?: string;    // Links to inward entry for customer fabric receipt
  createdDate: string;
  receivedDate?: string;     // When customer fabric was received
  completedDate?: string;    // When all lots are completed
  notes?: string;
}

export interface MaterialRequirement {
  material: string;
  required: string;
  available: string;
  shortage: string;
  unit: string;
}

export interface WorkOrderMaterialAllocation {
  material: string;
  allocatedQuantity: string;
  consumedQuantity: string;
  remainingQuantity: string;
  unit: string;
  allocationDate: string;
  reservationType: 'soft_reserved' | 'hard_reserved' | 'consumed';
}

export interface StatusHistoryEntry {
  timestamp: string;
  fromStatus: string;
  toStatus: string;
  user: string;
  reason?: string;
  notes?: string;
}

export interface QualityControlItem {
  id: string;                    // QC#301
  workOrderId: string;           // WO#451 (1:1 mapping)
  status: 'pending_inspection' | 'in_progress' | 'approved' | 'rejected';
  inspector?: string;            // Ravi Sharma
  grade?: 'A Grade' | 'B Grade' | 'C Grade' | 'Reject';
  notes?: string;               // QC inspection notes
  photos?: string[];            // Photo evidence
  checklist?: QCChecklistItem[];// Quality checklist results
  startedTime?: string;         // When QC inspection started
  completedTime?: string;       // When QC completed
  priority: 'normal' | 'high' | 'urgent';
  
  // QC-specific quality specifications
  qualitySpecs: {
    targetGrade: string;         // A Grade
    colorCode: string;           // Pantone 19-4052
    gsmTarget: string;           // 180 ± 5
    widthTarget: string;         // 58" ± 0.5"
    shrinkageLimit: string;      // <3%
  };
  specialInstructions?: string[];
  
  // Batch information for QC context
  batchInfo?: {
    batchNumber: string;         // B2025-045
    rawMaterial: string;         // Cotton Yarn 30s
    dyeLot?: string;            // DL-2025-089
    productionDates: string;     // 20-22 Dec 2025
  };
}

export interface QCChecklistItem {
  item: string;
  checked: boolean;
  required: boolean;
}

// Delivery-related interfaces moved to deliveryMockData.ts

export interface ProductionWorker {
  id: string;
  name: string;
  shift: 'day' | 'night';
  status: 'active' | 'break' | 'overtime' | 'off';
  assignedMachine?: string;
  efficiency: number;
  targetDaily: string;
  completedToday: string;
  startTime: string;
  breakTime?: string;
}

// MOCK DATA BASED ON VISUAL DESIGN SPECIFICATION

export const mockMachines: Machine[] = [
  {
    id: 'LOOM-A1',
    name: 'Loom A1',
    type: 'Weaving',
    status: 'busy',
    capacity: '100m/h',
    currentWorkOrder: 'WO#451',
    assignedWorker: 'Priya',
    efficiency: 85,
    output: '142m/h',
    estimatedCompletion: '11:30 AM'
  },
  {
    id: 'LOOM-B1',
    name: 'Loom B1',
    type: 'Weaving',
    status: 'setup',
    capacity: '80m/h',
    nextAvailable: '3:15 PM',
    assignedWorker: 'Rahul'
  },
  {
    id: 'DYE-D1',
    name: 'Dye Unit D1',
    type: 'Dyeing',
    status: 'busy',
    capacity: '200kg/h',
    currentWorkOrder: 'WO#454',
    assignedWorker: 'Suresh',
    efficiency: 92,
    output: '180kg/h',
    estimatedCompletion: '2:00 PM'
  },
  {
    id: 'FINISH-F1',
    name: 'Finishing Unit F1',
    type: 'Finishing',
    status: 'available',
    capacity: '150m/h',
    assignedWorker: 'Vikram'
  }
];

// Mock ProductionOrder Data - Customer Fabric Processing Tracking
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 'PROD-JO-2025-001-01',
    salesOrderId: 'JO-2025-001',
    customerId: 'bp-surat-processors',
    customerName: 'Surat Processors',
    fabricDetails: {
      type: 'Cotton Grey Fabric',
      quantity: 2000,
      unit: 'meters',
      challanReference: 'CH-SP-2025-001',
      qualityGrade: 'A-Grade',
      colors: ['Navy Blue'],
      specialInstructions: 'Ensure color fastness as per export standards'
    },
    workOrderIds: ['WO-2025-001-A'], 
    status: 'awaiting_qc',
    createdDate: '2025-10-15',
    receivedDate: '2025-10-16',
    notes: 'Production Order for dyeing service - Navy Blue reactive dyeing'
  },
  {
    id: 'PROD-JO-2025-002-01',
    salesOrderId: 'JO-2025-002',
    customerId: 'bp-ahmedabad-finishers',
    customerName: 'Ahmedabad Finishers',
    fabricDetails: {
      type: 'Cotton Dyed Fabric',
      quantity: 1500,
      unit: 'meters',
      challanReference: 'CH-AF-2025-002',
      qualityGrade: 'Standard',
      specialInstructions: 'Softening & Anti-wrinkle finishing required'
    },
    workOrderIds: ['WO-2025-002-A'],
    status: 'awaiting_qc',
    createdDate: '2025-10-18',
    receivedDate: '2025-10-19',
    notes: 'Production Order for finishing service - Softening & Anti-wrinkle'
  },
  {
    id: 'PROD-JO-2025-003-01',
    salesOrderId: 'JO-2025-003',
    customerId: 'bp-mumbai-printers',
    customerName: 'Mumbai Printers',
    fabricDetails: {
      type: 'Polyester Fabric',
      quantity: 3000,
      unit: 'meters',
      challanReference: 'CH-MP-2025-003',
      qualityGrade: 'Export-Grade',
      colors: ['Red', 'Blue', 'Green', 'Yellow'],
      specialInstructions: 'Multi-color printing with precise registration'
    },
    workOrderIds: ['WO-2025-003-A', 'WO-2025-003-B', 'WO-2025-003-E', 'WO-2025-003-F'],
    status: 'quality_issues',
    createdDate: '2025-10-21',
    notes: 'Production Order for printing service - Multi-color printing job'
  },

  // Updated ProductionOrders with Status Variety for Demo
  {
    id: 'PROD-JO-2025-004-01',
    salesOrderId: 'JO-2025-004',
    customerId: 'bp-rajkot-textiles',
    customerName: 'Rajkot Textiles Ltd.',
    fabricDetails: {
      type: 'Cotton Grey Fabric',
      quantity: 2400,
      unit: 'meters',
      challanReference: 'CH-RT-2025-004',
      qualityGrade: 'A-Grade',
      colors: ['Red', 'Blue'],
      specialInstructions: 'Two-color dyeing - separate lots for each color required'
    },
    workOrderIds: ['WO-2025-004-A', 'WO-2025-004-B'],
    status: 'material_received',
    createdDate: '2025-11-10',
    receivedDate: '2025-11-11',
    notes: 'Customer fabric received and inspected. Quality verified. Ready for work order creation.'
  },

  {
    id: 'PROD-JO-2025-005-01',
    salesOrderId: 'JO-2025-005',
    customerId: 'bp-vadodara-mills',
    customerName: 'Vadodara Processing Mills',
    fabricDetails: {
      type: 'Cotton Dyed Fabric',
      quantity: 3500,
      unit: 'meters',
      challanReference: 'CH-VM-2025-005',
      qualityGrade: 'Premium',
      specialInstructions: 'Multi-treatment finishing - anti-wrinkle, softening, water-repellent processes'
    },
    workOrderIds: ['WO-2025-005-A'],
    status: 'completed',
    createdDate: '2025-11-08',
    receivedDate: '2025-11-09',
    completedDate: '2025-11-12',
    notes: 'Multi-treatment finishing completed successfully. Premium quality achieved for customer delivery.'
  },

  {
    id: 'PROD-JO-2025-006-01',
    salesOrderId: 'JO-2025-006',
    customerId: 'bp-bharuch-printers',
    customerName: 'Bharuch Digital Printers',
    fabricDetails: {
      type: 'Polyester Fabric',
      quantity: 4000,
      unit: 'meters',
      challanReference: 'CH-BD-2025-006',
      qualityGrade: 'Export-Grade',
      colors: ['Royal Blue', 'Gold', 'White', 'Silver'],
      specialInstructions: 'High-resolution digital printing with precise color matching - complex geometric patterns'
    },
    workOrderIds: ['WO-2025-006-A'],
    status: 'ready_for_delivery',
    createdDate: '2025-11-12',
    receivedDate: '2025-11-12',
    completedDate: '2025-11-12',
    notes: 'High-resolution digital printing completed and dispatched. Customer delivery in progress.'
  },

  // Production Order requiring Work Order Creation (Demo) - Additional batch for JO-2025-001
  {
    id: 'PROD-JO-2025-001-02',
    salesOrderId: 'JO-2025-001',
    customerId: 'bp-surat-processors',
    customerName: 'Surat Processors',
    fabricDetails: {
      type: 'Cotton Grey Fabric',
      quantity: 1800,
      unit: 'meters',
      challanReference: 'CH-SP-2025-001-B',
      qualityGrade: 'A-Grade',
      colors: ['Royal Blue'],
      specialInstructions: 'Second batch for royal blue dyeing - same quality as first batch required'
    },
    workOrderIds: [],
    status: 'awaiting_work_order_creation',
    createdDate: '2025-11-12',
    receivedDate: '2025-11-12',
    notes: 'Second batch received from Surat Processors. Quality verified. Ready for work order creation for royal blue dyeing.'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  // Work Orders for JO-2025-001 (Dyeing Service - Navy Blue)
  {
    id: 'WO-2025-001-A',
    productionOrderId: 'PROD-JO-2025-001-01',
    salesOrderId: 'JO-2025-001',
    product: 'Navy Blue Reactive Dyeing - Lot A',
    customer: 'Surat Processors',
    batchNumber: 'DYE-001-A',
    targetQuantity: '2000m',
    producedQuantity: '2000m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'delivered',
    assignedMachine: 'DYE-D1',
    assignedWorker: 'Suresh',
    startTime: '08:00 AM',
    estimatedCompletion: '02:00 PM',
    priority: 'normal',
    createdDate: '2025-10-16',
    materialAllocations: [
      {
        material: 'Reactive Dye - Navy Blue',
        allocatedQuantity: '50L',
        consumedQuantity: '30L',
        remainingQuantity: '20L',
        unit: 'L',
        allocationDate: '2025-10-16 07:30',
        reservationType: 'hard_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-16 07:30',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Suresh',
        reason: 'Started dyeing process for Navy Blue lot'
      }
    ]
  },

  // Work Orders for JO-2025-002 (Finishing Service)
  {
    id: 'WO-2025-002-A',
    productionOrderId: 'PROD-JO-2025-002-01',
    salesOrderId: 'JO-2025-002',
    product: 'Softening & Anti-wrinkle Finishing - Lot A',
    customer: 'Ahmedabad Finishers',
    batchNumber: 'FIN-002-A',
    targetQuantity: '1500m',
    producedQuantity: '1500m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'ready_qc',
    assignedMachine: 'FINISH-F1',
    assignedWorker: 'Vikram',
    priority: 'normal',
    createdDate: '2025-10-19',
    materialAllocations: [
      {
        material: 'Softening Agent',
        allocatedQuantity: '25L',
        consumedQuantity: '0L',
        remainingQuantity: '25L',
        unit: 'L',
        allocationDate: '2025-10-19 06:00',
        reservationType: 'soft_reserved'
      },
      {
        material: 'Anti-wrinkle Chemical',
        allocatedQuantity: '15L',
        consumedQuantity: '0L',
        remainingQuantity: '15L',
        unit: 'L',
        allocationDate: '2025-10-19 06:00',
        reservationType: 'soft_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-19 06:00',
        fromStatus: 'pending',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created for finishing service'
      }
    ]
  },

  // Work Orders for JO-2025-003 (Printing Service - Multiple Colors)
  {
    id: 'WO-2025-003-A',
    productionOrderId: 'PROD-JO-2025-003-01',
    salesOrderId: 'JO-2025-003',
    product: 'Multi-color Printing - Red Lot',
    customer: 'Mumbai Printers',
    batchNumber: 'PRT-003-A-RED',
    targetQuantity: '750m',
    producedQuantity: '750m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'qc_approved',
    assignedMachine: '',
    assignedWorker: '',
    priority: 'urgent',
    createdDate: '2025-10-21',
    materialAllocations: [
      {
        material: 'Printing Ink - Red',
        allocatedQuantity: '8L',
        consumedQuantity: '0L',
        remainingQuantity: '8L',
        unit: 'L',
        allocationDate: '2025-10-21 00:00',
        reservationType: 'soft_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-21 00:00',
        fromStatus: 'pending',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created for Red color printing lot'
      }
    ]
  },
  {
    id: 'WO-2025-003-B',
    productionOrderId: 'PROD-JO-2025-003-01',
    salesOrderId: 'JO-2025-003',
    product: 'Multi-color Printing - Blue Lot',
    customer: 'Mumbai Printers',
    batchNumber: 'PRT-003-B-BLUE',
    targetQuantity: '750m',
    producedQuantity: '450m',
    remainingQuantity: '300m',
    progress: 60,
    status: 'in_progress',
    assignedMachine: 'PRINT-P1',
    assignedWorker: 'Manish',
    priority: 'urgent',
    createdDate: '2025-10-21',
    startTime: '10:00 AM',
    estimatedCompletion: '4:00 PM',
    materialAllocations: [
      {
        material: 'Printing Ink - Blue',
        allocatedQuantity: '8L',
        consumedQuantity: '0L',
        remainingQuantity: '8L',
        unit: 'L',
        allocationDate: '2025-10-21 00:00',
        reservationType: 'soft_reserved'
      }
    ]
  },
  // Removed WO-2025-003-C and WO-2025-003-D to eliminate duplicate statuses for cleaner demo,

  // Additional Work Orders for Status Variation Demo
  {
    id: 'WO-2025-003-E',
    productionOrderId: 'PROD-JO-2025-003-01',
    salesOrderId: 'JO-2025-003',
    product: 'Multi-color Printing - Orange Lot',
    customer: 'Mumbai Printers',
    batchNumber: 'PRT-003-E-ORANGE',
    targetQuantity: '750m',
    producedQuantity: '750m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'qc_rejected',
    assignedMachine: 'PRINT-P2',
    assignedWorker: 'Arjun',
    priority: 'urgent',
    createdDate: '2025-10-22',
    startTime: '08:00 AM',
    actualCompletion: '2025-10-22 16:30',
    notes: 'Color registration issues detected during QC inspection'
  },
  {
    id: 'WO-2025-003-F',
    productionOrderId: 'PROD-JO-2025-003-01',
    salesOrderId: 'JO-2025-003',
    product: 'Multi-color Printing - Purple Lot',
    customer: 'Mumbai Printers',
    batchNumber: 'PRT-003-F-PURPLE',
    targetQuantity: '500m',
    producedQuantity: '300m',
    remainingQuantity: '200m',
    progress: 60,
    status: 'rework_required',
    assignedMachine: 'PRINT-P1',
    assignedWorker: 'Kiran',
    priority: 'high',
    createdDate: '2025-10-23',
    startTime: '09:00 AM',
    estimatedCompletion: '6:00 PM',
    notes: 'Rework required due to print quality issues - color bleeding detected',
    issues: ['Color bleeding in purple sections', 'Print registration off by 2mm', 'GSM variation beyond tolerance']
  },

  // Optimized Work Orders for Clean Demo - One Example of Each Status
  {
    id: 'WO-2025-004-A',
    productionOrderId: 'PROD-JO-2025-004-01',
    salesOrderId: 'JO-2025-004',
    product: 'Two-Color Dyeing - Red Lot',
    customer: 'Rajkot Textiles Ltd.',
    batchNumber: 'DYE-004-A-RED',
    targetQuantity: '1200m',
    producedQuantity: '0m',
    remainingQuantity: '1200m',
    progress: 0,
    status: 'pending',
    assignedMachine: 'DYE-D2',
    assignedWorker: 'Ramesh',
    priority: 'normal',
    createdDate: '2025-11-11',
    notes: 'Scheduled for 13th Nov - Red reactive dyeing lot'
  },
  {
    id: 'WO-2025-004-B',
    productionOrderId: 'PROD-JO-2025-004-01',
    salesOrderId: 'JO-2025-004',
    product: 'Two-Color Dyeing - Blue Lot',
    customer: 'Rajkot Textiles Ltd.',
    batchNumber: 'DYE-004-B-BLUE',
    targetQuantity: '1200m',
    producedQuantity: '0m',
    remainingQuantity: '1200m',
    progress: 0,
    status: 'on_hold',
    assignedMachine: 'DYE-D2',
    assignedWorker: 'Ramesh',
    priority: 'normal',
    createdDate: '2025-11-11',
    notes: 'On hold - waiting for red lot completion before dyeing machine becomes available'
  },

  // Work Orders for PROD-JO-2025-005 (Optimized for Status Variety)
  {
    id: 'WO-2025-005-A',
    productionOrderId: 'PROD-JO-2025-005-01',
    salesOrderId: 'JO-2025-005',
    product: 'Anti-wrinkle Treatment',
    customer: 'Vadodara Processing Mills',
    batchNumber: 'FIN-005-A-AWR',
    targetQuantity: '3500m',
    producedQuantity: '3500m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'completed',
    assignedMachine: 'FINISH-F2',
    assignedWorker: 'Deepak',
    priority: 'high',
    createdDate: '2025-11-09',
    startTime: '08:00 AM',
    actualCompletion: '2025-11-12 17:00',
    notes: 'Multi-treatment finishing completed successfully. Premium quality achieved.'
  },

  // Work Orders for PROD-JO-2025-006 (Optimized for Status Variety)
  {
    id: 'WO-2025-006-A',
    productionOrderId: 'PROD-JO-2025-006-01',
    salesOrderId: 'JO-2025-006',
    product: 'Digital Printing - 4-Color Pattern',
    customer: 'Bharuch Digital Printers',
    batchNumber: 'PRT-006-A-4COLOR',
    targetQuantity: '4000m',
    producedQuantity: '4000m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'dispatched',
    assignedMachine: 'DPRINT-DP1',
    assignedWorker: 'Sunil',
    priority: 'urgent',
    createdDate: '2025-11-12',
    startTime: '06:00 AM',
    actualCompletion: '2025-11-12 16:00',
    notes: 'High-resolution digital printing completed. Dispatched for customer delivery.'
  }
];

export const mockQCItems: QualityControlItem[] = [
  // QC for WO-2025-001-A (Navy Blue Dyeing - completed, pending QC)
  {
    id: 'QC-2025-001-A',
    workOrderId: 'WO-2025-001-A',
    status: 'approved',
    inspector: 'Ravi Sharma',
    grade: 'A Grade',
    startedTime: '2025-10-17 09:00',
    completedTime: '2025-10-17 10:30',
    notes: 'Excellent dyeing quality. Color fastness test passed. Export standards met.',
    priority: 'normal',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Navy Blue - Pantone 19-4052',
      gsmTarget: '180 ± 5',
      widthTarget: '58" ± 0.5"',
      shrinkageLimit: '<3%'
    },
    specialInstructions: ['Color fastness test required', 'Export standard compliance check'],
    checklist: [
      { item: 'Color fastness test', checked: true, required: true },
      { item: 'Export standard compliance check', checked: true, required: true },
      { item: 'Visual quality inspection', checked: true, required: true },
      { item: 'GSM weight verification', checked: true, required: false }
    ],
    photos: ['qc_navy_dyeing_001.jpg', 'qc_navy_dyeing_002.jpg'],
    batchInfo: {
      batchNumber: 'DYE-001-A',
      rawMaterial: 'Cotton Grey Fabric',
      dyeLot: 'DL-2025-089',
      productionDates: '16 Oct 2025'
    }
  },

  // QC for WO-2025-002-A (Finishing - ready for QC inspection)
  {
    id: 'QC-2025-002-A',
    workOrderId: 'WO-2025-002-A',
    status: 'pending_inspection',
    priority: 'normal',
    qualitySpecs: {
      targetGrade: 'Standard',
      colorCode: 'N/A - Finishing Process',
      gsmTarget: '180 ± 5',
      widthTarget: '58" ± 0.5"',
      shrinkageLimit: '<2%'
    },
    specialInstructions: ['Softness test required', 'Anti-wrinkle effectiveness check', 'Chemical residue test'],
    checklist: [
      { item: 'Softness test', checked: true, required: true },
      { item: 'Anti-wrinkle effectiveness check', checked: true, required: true },
      { item: 'Chemical residue test', checked: true, required: true },
      { item: 'Visual finish inspection', checked: true, required: false }
    ],
    photos: ['qc_finishing_001.jpg', 'qc_finishing_002.jpg'],
    batchInfo: {
      batchNumber: 'FIN-002-A',
      rawMaterial: 'Cotton Dyed Fabric',
      productionDates: '19 Oct 2025'
    }
  },

  // QC for WO-2025-003-A (Red Printing Lot - QC Approved)
  {
    id: 'QC-2025-003-A',
    workOrderId: 'WO-2025-003-A',
    status: 'approved',
    inspector: 'Ravi Sharma',
    grade: 'A Grade',
    startedTime: '2025-10-18 10:00',
    completedTime: '2025-10-18 11:15',
    notes: 'Excellent print registration and color matching. Export quality standards met.',
    priority: 'urgent',
    qualitySpecs: {
      targetGrade: 'Export-Grade',
      colorCode: 'Red - Pantone 18-1664',
      gsmTarget: '150 ± 3',
      widthTarget: '44" ± 0.25"',
      shrinkageLimit: '<1%'
    },
    specialInstructions: ['Print registration accuracy check', 'Color matching verification', 'Wash fastness test'],
    batchInfo: {
      batchNumber: 'PRT-003-A-RED',
      rawMaterial: 'Polyester Fabric',
      productionDates: '21 Oct 2025'
    },
    checklist: [
      { item: 'Print registration accuracy check', checked: true, required: true },
      { item: 'Color matching verification', checked: true, required: true },
      { item: 'Wash fastness test', checked: true, required: true },
      { item: 'GSM weight check', checked: true, required: false },
      { item: 'Width measurement', checked: true, required: true }
    ],
    photos: ['qc_red_lot_001.jpg', 'qc_red_lot_002.jpg']
  },

  // QC for WO-2025-003-B (Blue Printing Lot - in progress work order)
  {
    id: 'QC-2025-003-B',
    workOrderId: 'WO-2025-003-B',
    status: 'in_progress',
    inspector: 'Ravi Sharma',
    startedTime: '2025-11-12 14:00',
    priority: 'urgent',
    qualitySpecs: {
      targetGrade: 'Export-Grade',
      colorCode: 'Blue - Pantone 19-4052',
      gsmTarget: '150 ± 3',
      widthTarget: '44" ± 0.25"',
      shrinkageLimit: '<1%'
    },
    specialInstructions: ['Print registration accuracy check', 'Color matching verification', 'Wash fastness test'],
    checklist: [
      { item: 'Print registration accuracy check', checked: true, required: true },
      { item: 'Color matching verification', checked: false, required: true },
      { item: 'Wash fastness test', checked: false, required: true },
      { item: 'GSM weight check', checked: true, required: false },
      { item: 'Width measurement', checked: true, required: true }
    ],
    notes: 'QC in progress - initial checks completed, color matching verification pending',
    batchInfo: {
      batchNumber: 'PRT-003-B-BLUE',
      rawMaterial: 'Polyester Fabric',
      productionDates: '21 Oct 2025'
    }
  },

  // QC items for WO-2025-003-C and WO-2025-003-D removed for cleaner demo

  // QC for WO-2025-003-E (Orange Printing Lot - QC Rejected)
  {
    id: 'QC-2025-003-E',
    workOrderId: 'WO-2025-003-E',
    status: 'rejected',
    inspector: 'Priya Patel',
    grade: 'Reject',
    startedTime: '2025-10-23 09:00',
    completedTime: '2025-10-23 10:45',
    notes: 'Color registration issues detected. Print alignment off by 3mm in multiple sections. Orange color bleeding into adjacent areas.',
    priority: 'urgent',
    qualitySpecs: {
      targetGrade: 'Export-Grade',
      colorCode: 'Orange - Pantone 16-1448',
      gsmTarget: '150 ± 3',
      widthTarget: '44" ± 0.25"',
      shrinkageLimit: '<1%'
    },
    specialInstructions: ['Print registration accuracy check', 'Color bleeding test', 'Edge alignment verification'],
    checklist: [
      { item: 'Print registration accuracy check', checked: false, required: true },
      { item: 'Color bleeding test', checked: false, required: true },
      { item: 'Edge alignment verification', checked: false, required: true },
      { item: 'GSM weight check', checked: true, required: false },
      { item: 'Width measurement', checked: true, required: true }
    ],
    photos: ['qc_orange_reject_001.jpg', 'qc_orange_reject_002.jpg', 'qc_orange_reject_003.jpg'],
    batchInfo: {
      batchNumber: 'PRT-003-E-ORANGE',
      rawMaterial: 'Polyester Fabric',
      productionDates: '22 Oct 2025'
    }
  },

  // QC for WO-2025-003-F (Purple Printing Lot - Pending QC, but WO needs rework first)
  {
    id: 'QC-2025-003-F',
    workOrderId: 'WO-2025-003-F',
    status: 'pending_inspection',
    priority: 'high',
    qualitySpecs: {
      targetGrade: 'Export-Grade',
      colorCode: 'Purple - Pantone 19-3536',
      gsmTarget: '150 ± 3',
      widthTarget: '44" ± 0.25"',
      shrinkageLimit: '<1%'
    },
    specialInstructions: ['Color bleeding prevention check', 'Print registration verification', 'GSM consistency test'],
    notes: 'QC on hold - work order requires rework due to production quality issues',
    batchInfo: {
      batchNumber: 'PRT-003-F-PURPLE',
      rawMaterial: 'Polyester Fabric',
      productionDates: '23 Oct 2025'
    }
  },

  // QC for WO-2025-006-A (Digital Printing Royal Blue - Ready for Delivery, needs QC verification)
  {
    id: 'QC-2025-006-A',
    workOrderId: 'WO-2025-006-A',
    status: 'approved',
    inspector: 'Ravi Sharma',
    grade: 'A Grade',
    startedTime: '2025-11-12 14:00',
    completedTime: '2025-11-12 15:30',
    notes: 'Excellent digital printing quality. Royal blue color matching perfect. Geometric patterns show crisp detail.',
    priority: 'urgent',
    qualitySpecs: {
      targetGrade: 'Export-Grade',
      colorCode: 'Royal Blue - Pantone 19-3955',
      gsmTarget: '180 ± 5',
      widthTarget: '60" ± 0.5"',
      shrinkageLimit: '<2%'
    },
    specialInstructions: ['Digital print quality check', 'Color fastness test', 'Pattern registration accuracy'],
    checklist: [
      { item: 'Digital print quality check', checked: true, required: true },
      { item: 'Color fastness test', checked: true, required: true },
      { item: 'Pattern registration accuracy', checked: true, required: true },
      { item: 'GSM weight check', checked: true, required: false },
      { item: 'Width measurement', checked: true, required: true }
    ],
    photos: ['qc_royal_blue_digital_001.jpg', 'qc_royal_blue_digital_002.jpg'],
    batchInfo: {
      batchNumber: 'PRT-006-A-RBLUE',
      rawMaterial: 'Polyester Fabric',
      productionDates: '12 Nov 2025'
    }
  },

  // QC for WO-2025-005-A (Multi-treatment Finishing - Completed, QC approved for delivery)
  {
    id: 'QC-2025-005-A',
    workOrderId: 'WO-2025-005-A',
    status: 'approved',
    inspector: 'Priya Patel',
    grade: 'A Grade',
    startedTime: '2025-11-12 17:30',
    completedTime: '2025-11-12 18:45',
    notes: 'Excellent premium finishing quality. All treatments applied perfectly. Anti-wrinkle, softening, and water-repellent effects verified.',
    priority: 'high',
    qualitySpecs: {
      targetGrade: 'Premium',
      colorCode: 'N/A - Multi-treatment Finishing',
      gsmTarget: '185 ± 3',
      widthTarget: '58" ± 0.5"',
      shrinkageLimit: '<2%'
    },
    specialInstructions: ['Anti-wrinkle effect test', 'Softness verification', 'Water-repellent test'],
    checklist: [
      { item: 'Anti-wrinkle effect test', checked: true, required: true },
      { item: 'Softness verification', checked: true, required: true },
      { item: 'Water-repellent test', checked: true, required: true },
      { item: 'GSM consistency check', checked: true, required: false },
      { item: 'Surface finish inspection', checked: true, required: true }
    ],
    photos: ['qc_premium_finish_001.jpg', 'qc_premium_finish_002.jpg'],
    batchInfo: {
      batchNumber: 'FIN-005-A-AWR',
      rawMaterial: 'Cotton Dyed Fabric',
      productionDates: '09-12 Nov 2025'
    }
  }
];

// Mock delivery data moved to deliveryMockData.ts

export const mockProductionWorkers: ProductionWorker[] = [
  {
    id: 'W001',
    name: 'Priya',
    shift: 'day',
    status: 'active',
    assignedMachine: 'LOOM-A1',
    efficiency: 95,
    targetDaily: '800m',
    completedToday: '520m',
    startTime: '8:00 AM'
  },
  {
    id: 'W002',
    name: 'Rahul',
    shift: 'day',
    status: 'active',
    assignedMachine: 'LOOM-B1',
    efficiency: 88,
    targetDaily: '600m',
    completedToday: '180m',
    startTime: '8:00 AM'
  },
  {
    id: 'W003',
    name: 'Suresh',
    shift: 'day',
    status: 'break',
    assignedMachine: 'DYE-D1',
    efficiency: 92,
    targetDaily: '700kg',
    completedToday: '400kg',
    startTime: '8:00 AM',
    breakTime: '12:00-12:30'
  },
  {
    id: 'W004',
    name: 'Vikram',
    shift: 'day',
    status: 'active',
    assignedMachine: 'FINISH-F1',
    efficiency: 90,
    targetDaily: '650m',
    completedToday: '300m',
    startTime: '8:00 AM'
  }
];

// Helper functions to get data based on relationships
export const getWorkOrdersBySalesOrder = (salesOrderId: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.salesOrderId === salesOrderId);
};

export const getQCItemsByWorkOrder = (workOrderId: string): QualityControlItem[] => {
  return mockQCItems.filter(qc => qc.workOrderId === workOrderId);
};

// getDeliveryItemsBySalesOrder moved to deliveryMockData.ts

export const getMachineByWorkOrder = (workOrderId: string): Machine | undefined => {
  const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
  if (!workOrder) return undefined;
  return mockMachines.find(machine => machine.id === workOrder.assignedMachine);
};

export const getWorkerByMachine = (machineId: string): ProductionWorker | undefined => {
  return mockProductionWorkers.find(worker => worker.assignedMachine === machineId);
};

// Production metrics calculations
export const calculateProductionMetrics = () => {
  const activeWorkOrders = mockWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const completedToday = mockWorkOrders.filter(wo => 
    wo.status === 'completed' && wo.actualCompletion?.includes('PM')
  ).length;
  
  const totalTarget = mockProductionWorkers.reduce((sum, worker) => {
    return sum + parseInt(worker.targetDaily.replace('m', ''));
  }, 0);
  
  const totalCompleted = mockProductionWorkers.reduce((sum, worker) => {
    return sum + parseInt(worker.completedToday.replace('m', ''));
  }, 0);
  
  const progressPercentage = Math.round((totalCompleted / totalTarget) * 100);
  
  return {
    activeWorkOrders,
    completedToday,
    totalTarget: `${totalTarget}m`,
    totalCompleted: `${totalCompleted}m`,
    progressPercentage,
    qualityRate: '95%',
    activeMachines: mockMachines.filter(m => m.status === 'busy').length,
    totalMachines: mockMachines.length,
    activeWorkers: mockProductionWorkers.filter(w => w.status === 'active').length,
    totalWorkers: mockProductionWorkers.length
  };
};

// ProductionOrder Helper Functions for Customer Fabric Tracking
export const getProductionOrderById = (id: string): ProductionOrder | undefined => {
  return mockProductionOrders.find(productionOrder => productionOrder.id === id);
};

export const getProductionOrderBySalesOrder = (salesOrderId: string): ProductionOrder | undefined => {
  return mockProductionOrders.find(productionOrder => productionOrder.salesOrderId === salesOrderId);
};

export const getProductionOrdersByCustomer = (customerId: string): ProductionOrder[] => {
  return mockProductionOrders.filter(productionOrder => productionOrder.customerId === customerId);
};

export const getWorkOrdersByProductionOrder = (productionOrderId: string): WorkOrder[] => {
  const productionOrder = getProductionOrderById(productionOrderId);
  if (!productionOrder) return [];
  return mockWorkOrders.filter(wo => productionOrder.workOrderIds.includes(wo.id));
};

export const getProductionOrderByWorkOrder = (workOrderId: string): ProductionOrder | undefined => {
  return mockProductionOrders.find(productionOrder => productionOrder.workOrderIds.includes(workOrderId));
};

// Additional helper functions for ProductionOrderManagement
export const getAllProductionOrders = (): ProductionOrder[] => {
  return mockProductionOrders;
};

export const getProductionOrdersByStatus = (status: ProductionOrder['status']): ProductionOrder[] => {
  return mockProductionOrders.filter(po => po.status === status);
};