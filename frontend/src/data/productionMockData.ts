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
  salesOrderId: string;
  product: string;
  customer: string;
  batchNumber: string;
  targetQuantity: string;
  producedQuantity: string;
  remainingQuantity: string;
  progress: number; // percentage
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'ready_qc';
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
export interface JobCard {
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
  workOrderIds: string[];     // Multiple lots created from this job card
  status: 'awaiting_material' | 'material_received' | 'in_progress' | 'completed';
  grnId?: string;            // Links to goods receipt note for fabric inward
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
    dyeLot?: string;            // DL-2024-089
    productionDates: string;     // 20-22 Dec 2024
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

// Mock JobCard Data - Customer Fabric Processing Tracking
export const mockJobCards: JobCard[] = [
  {
    id: 'JC-001',
    salesOrderId: 'SO-002', // Links to existing Gujarat Garments job order
    customerId: 'bp-gujarat-garments',
    customerName: 'Gujarat Garments',
    fabricDetails: {
      type: 'Cotton Mixed',
      quantity: 500,
      unit: 'meters',
      challanReference: 'GG-CH-1024',
      qualityGrade: 'A-Grade',
      colors: ['Natural White'],
      specialInstructions: 'Handle with care - premium quality'
    },
    workOrderIds: ['WO#451', 'WO#452'], // Multiple lots from this job card
    status: 'in_progress',
    grnId: 'GRN-001', // Links to fabric inward entry
    createdDate: '2024-10-15',
    receivedDate: '2024-10-16',
    notes: 'Customer fabric received in good condition'
  },
  {
    id: 'JC-002', 
    salesOrderId: 'SO-003',
    customerId: 'bp-chennai-exports',
    customerName: 'Chennai Exports',
    fabricDetails: {
      type: 'Silk',
      quantity: 300,
      unit: 'meters', 
      challanReference: 'CE-CH-2041',
      qualityGrade: 'Export-Grade',
      specialInstructions: 'Temperature controlled processing required'
    },
    workOrderIds: ['WO#453'],
    status: 'awaiting_material',
    createdDate: '2024-10-18',
    notes: 'Waiting for customer fabric delivery'
  },
  {
    id: 'JC-003',
    salesOrderId: 'SO-001', 
    customerId: 'bp-mumbai-fashion',
    customerName: 'Mumbai Fashion',
    fabricDetails: {
      type: 'Polyester Blend',
      quantity: 750,
      unit: 'meters',
      challanReference: 'MF-CH-3012',
      qualityGrade: 'B-Grade',
      colors: ['Navy Blue', 'Charcoal']
    },
    workOrderIds: ['WO#454', 'WO#455'],
    status: 'material_received',
    grnId: 'GRN-002',
    createdDate: '2024-10-12',
    receivedDate: '2024-10-14',
    notes: 'Pre-dyed fabric - ready for finishing process'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO#451',
    salesOrderId: 'SO-002', // References existing sales order
    product: 'Mixed fabric for casual wear',
    customer: 'Gujarat Garments', // From bp-gujarat-garments
    batchNumber: 'B2025-045',
    targetQuantity: '1000m',
    producedQuantity: '800m',
    remainingQuantity: '200m',
    progress: 80,
    status: 'in_progress',
    assignedMachine: 'LOOM-A1',
    assignedWorker: 'Priya',
    startTime: '08:15 AM',
    estimatedCompletion: '11:30 AM',
    priority: 'urgent',
    createdDate: '2025-10-20',
    materialAllocations: [
      {
        material: 'Cotton Yarn 30s',
        allocatedQuantity: '1100kg',
        consumedQuantity: '880kg',
        remainingQuantity: '220kg',
        unit: 'kg',
        allocationDate: '2025-10-20 06:00',
        reservationType: 'hard_reserved'
      },
      {
        material: 'Blue Dye',
        allocatedQuantity: '50L',
        consumedQuantity: '40L',
        remainingQuantity: '10L',
        unit: 'L',
        allocationDate: '2025-10-20 06:00',
        reservationType: 'hard_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-20 06:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-002'
      },
      {
        timestamp: '2025-10-20 08:15',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Priya',
        reason: 'Production started on Loom A1'
      }
    ],
    notes: 'Minor color variation noted but within acceptable limits'
  },
  {
    id: 'WO#452',
    salesOrderId: 'SO-004', // References existing sales order
    product: 'Updated seasonal collection',
    customer: 'Baroda Fashion', // From bp-baroda-fashion
    batchNumber: 'B2025-046',
    targetQuantity: '500m',
    producedQuantity: '0m',
    remainingQuantity: '500m',
    progress: 0,
    status: 'pending',
    assignedMachine: 'LOOM-B1',
    assignedWorker: 'Rahul',
    priority: 'normal',
    createdDate: '2025-10-20',
    materialAllocations: [
      {
        material: 'Silk Yarn',
        allocatedQuantity: '600kg',
        consumedQuantity: '0kg',
        remainingQuantity: '600kg',
        unit: 'kg',
        allocationDate: '2025-10-20 07:00',
        reservationType: 'hard_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-20 07:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-004'
      }
    ]
  },
  {
    id: 'WO#453',
    salesOrderId: 'SO-002', // Second batch for same order
    product: 'Mixed fabric for casual wear - Batch 2',
    customer: 'Gujarat Garments',
    batchNumber: 'B2025-047',
    targetQuantity: '800m',
    producedQuantity: '800m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'completed',
    assignedMachine: 'DYE-D1',
    assignedWorker: 'Suresh',
    startTime: '06:00 AM',
    actualCompletion: '02:30 PM',
    priority: 'normal',
    createdDate: '2025-10-19',
    qualityGrade: 'A Grade',
    materialAllocations: [
      {
        material: 'Cotton Yarn 30s',
        allocatedQuantity: '880kg',
        consumedQuantity: '880kg',
        remainingQuantity: '0kg',
        unit: 'kg',
        allocationDate: '2025-10-19 06:00',
        reservationType: 'consumed'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-19 06:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-002'
      },
      {
        timestamp: '2025-10-19 06:30',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Suresh',
        reason: 'Production started on Dye Unit D1'
      },
      {
        timestamp: '2025-10-19 14:30',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        user: 'Suresh',
        reason: 'Production completed successfully'
      }
    ]
  },
  {
    id: 'WO#450',
    salesOrderId: 'SO-004', // Additional batch for completed order
    product: 'Updated seasonal collection - Final batch',
    customer: 'Baroda Fashion',
    batchNumber: 'B2025-044',
    targetQuantity: '600m',
    producedQuantity: '600m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'ready_qc',
    assignedMachine: 'FINISH-F1',
    assignedWorker: 'Vikram',
    startTime: '06:00 AM',
    actualCompletion: '01:30 PM',
    priority: 'normal',
    createdDate: '2025-10-19',
    qualityGrade: 'A Grade',
    materialAllocations: [
      {
        material: 'Polyester Yarn',
        allocatedQuantity: '650kg',
        consumedQuantity: '650kg',
        remainingQuantity: '0kg',
        unit: 'kg',
        allocationDate: '2025-10-19 06:00',
        reservationType: 'consumed'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-19 06:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-004'
      },
      {
        timestamp: '2025-10-19 06:30',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Vikram',
        reason: 'Production started on Finishing Unit F1'
      },
      {
        timestamp: '2025-10-19 13:30',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        user: 'Vikram',
        reason: 'Production completed successfully'
      },
      {
        timestamp: '2025-10-19 14:00',
        fromStatus: 'completed',
        toStatus: 'ready_qc',
        user: 'System',
        reason: 'Automatically moved to QC queue'
      }
    ]
  },
  // Work Orders for SO-003 (production_started order)
  {
    id: 'WO#503-A',
    salesOrderId: 'SO-003',
    product: 'Polyester blend fabric - Batch A',
    customer: 'Baroda Fashion',
    batchNumber: 'B2025-503A',
    targetQuantity: '1000m',
    producedQuantity: '1000m',
    remainingQuantity: '0m',
    progress: 100,
    status: 'completed',
    assignedMachine: 'LOOM-A1',
    assignedWorker: 'Priya',
    startTime: '06:00 AM',
    actualCompletion: '02:30 PM',
    priority: 'normal',
    createdDate: '2025-10-19',
    qualityGrade: 'A Grade',
    materialAllocations: [
      {
        material: 'Polyester Yarn',
        allocatedQuantity: '1100kg',
        consumedQuantity: '1100kg',
        remainingQuantity: '0kg',
        unit: 'kg',
        allocationDate: '2025-10-19 06:00',
        reservationType: 'consumed'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-19 06:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-003'
      },
      {
        timestamp: '2025-10-19 06:30',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Priya',
        reason: 'Production started on Loom A1'
      },
      {
        timestamp: '2025-10-19 14:30',
        fromStatus: 'in_progress',
        toStatus: 'completed',
        user: 'Priya',
        reason: 'Production completed successfully'
      }
    ]
  },
  {
    id: 'WO#503-B',
    salesOrderId: 'SO-003',
    product: 'Polyester blend fabric - Batch B',
    customer: 'Baroda Fashion',
    batchNumber: 'B2025-503B',
    targetQuantity: '1000m',
    producedQuantity: '200m',
    remainingQuantity: '800m',
    progress: 20,
    status: 'in_progress',
    assignedMachine: 'LOOM-B1',
    assignedWorker: 'Rahul',
    startTime: '08:00 AM',
    estimatedCompletion: '05:00 PM',
    priority: 'normal',
    createdDate: '2025-10-21',
    materialAllocations: [
      {
        material: 'Polyester Yarn',
        allocatedQuantity: '1100kg',
        consumedQuantity: '220kg',
        remainingQuantity: '880kg',
        unit: 'kg',
        allocationDate: '2025-10-21 06:00',
        reservationType: 'hard_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-21 06:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created from Sales Order SO-003'
      },
      {
        timestamp: '2025-10-21 08:00',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Rahul',
        reason: 'Production started on Loom B1'
      }
    ]
  },
  {
    id: 'WO#454',
    salesOrderId: 'SO-002',
    product: 'Mixed fabric for casual wear - Dyeing',
    customer: 'Gujarat Garments',
    batchNumber: 'B2025-048',
    targetQuantity: '500kg',
    producedQuantity: '350kg',
    remainingQuantity: '150kg',
    progress: 70,
    status: 'in_progress',
    assignedMachine: 'DYE-D1',
    assignedWorker: 'Suresh',
    startTime: '09:00 AM',
    estimatedCompletion: '2:00 PM',
    priority: 'normal',
    createdDate: '2025-10-21',
    materialAllocations: [
      {
        material: 'Blue Dye',
        allocatedQuantity: '75L',
        consumedQuantity: '52L',
        remainingQuantity: '23L',
        unit: 'L',
        allocationDate: '2025-10-21 08:00',
        reservationType: 'hard_reserved'
      }
    ],
    statusHistory: [
      {
        timestamp: '2025-10-21 08:00',
        fromStatus: 'created',
        toStatus: 'pending',
        user: 'System',
        reason: 'Work Order created for dyeing process'
      },
      {
        timestamp: '2025-10-21 09:00',
        fromStatus: 'pending',
        toStatus: 'in_progress',
        user: 'Suresh',
        reason: 'Dyeing started on Dye Unit D1'
      }
    ]
  }
];

export const mockQCItems: QualityControlItem[] = [
  {
    id: 'QC#301',
    workOrderId: 'WO#453', // Maps to completed Work Order
    status: 'pending_inspection',
    priority: 'high',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Blue (Pantone 19-4052)',
      gsmTarget: '180 ± 5',
      widthTarget: '58" ± 0.5"',
      shrinkageLimit: '<3%'
    },
    specialInstructions: [
      'Customer requires strict color match',
      'Photo documentation mandatory',
      'Rush order - complete within 2hrs'
    ],
    batchInfo: {
      batchNumber: 'B2025-047',
      rawMaterial: 'Cotton Yarn 30s',
      dyeLot: 'DL-2024-089',
      productionDates: '19 Dec 2024'
    },
    checklist: [
      { item: 'Color match verification', checked: false, required: true },
      { item: 'GSM weight check', checked: false, required: true },
      { item: 'Width measurement', checked: false, required: true },
      { item: 'Shrinkage test', checked: false, required: true },
      { item: 'Surface defect inspection', checked: false, required: true }
    ]
  },
  {
    id: 'QC#302',
    workOrderId: 'WO#450', // Maps to ready_qc Work Order
    status: 'pending_inspection',
    priority: 'normal',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Mixed Colors',
      gsmTarget: '160 ± 3',
      widthTarget: '60" ± 0.5"',
      shrinkageLimit: '<2%'
    },
    specialInstructions: [
      'Multi-color pattern inspection required',
      'Check color bleeding resistance'
    ],
    batchInfo: {
      batchNumber: 'B2025-044',
      rawMaterial: 'Polyester Yarn',
      productionDates: '19 Dec 2024'
    },
    checklist: [
      { item: 'Color match verification', checked: false, required: true },
      { item: 'GSM weight check', checked: false, required: true },
      { item: 'Width measurement', checked: false, required: true },
      { item: 'Shrinkage test', checked: false, required: true },
      { item: 'Surface defect inspection', checked: false, required: true }
    ]
  },
  {
    id: 'QC#303',
    workOrderId: 'WO#503-A', // Maps to completed Work Order
    status: 'approved',
    inspector: 'Ravi Sharma',
    grade: 'A Grade',
    startedTime: '2:30 PM',
    completedTime: '3:45 PM',
    priority: 'normal',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Navy Blue (Pantone 19-3928)',
      gsmTarget: '200 ± 5',
      widthTarget: '56" ± 0.5"',
      shrinkageLimit: '<2.5%'
    },
    batchInfo: {
      batchNumber: 'B2025-503A',
      rawMaterial: 'Polyester Yarn',
      productionDates: '19 Dec 2024'
    },
    checklist: [
      { item: 'Color match verification', checked: true, required: true },
      { item: 'GSM weight check', checked: true, required: true },
      { item: 'Width measurement', checked: true, required: true },
      { item: 'Shrinkage test', checked: true, required: true },
      { item: 'Surface defect inspection', checked: true, required: true }
    ],
    notes: 'Excellent quality batch. Color consistency perfect. Meets all customer specifications.',
    photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
  },
  {
    id: 'QC#304',
    workOrderId: 'WO#503-B', // In progress Work Order - will get QC when completed
    status: 'pending_inspection',
    priority: 'normal',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Navy Blue (Pantone 19-3928)',
      gsmTarget: '200 ± 5',
      widthTarget: '56" ± 0.5"',
      shrinkageLimit: '<2.5%'
    },
    batchInfo: {
      batchNumber: 'B2025-503B',
      rawMaterial: 'Polyester Yarn',
      productionDates: '21 Dec 2024'
    },
    checklist: [
      { item: 'Color match verification', checked: false, required: true },
      { item: 'GSM weight check', checked: false, required: true },
      { item: 'Width measurement', checked: false, required: true },
      { item: 'Shrinkage test', checked: false, required: true },
      { item: 'Surface defect inspection', checked: false, required: true }
    ]
  },
  {
    id: 'QC#305',
    workOrderId: 'WO#451', // Current in_progress Work Order
    status: 'pending_inspection',
    priority: 'urgent',
    qualitySpecs: {
      targetGrade: 'A Grade',
      colorCode: 'Mixed Colors',
      gsmTarget: '175 ± 5',
      widthTarget: '58" ± 0.5"',
      shrinkageLimit: '<3%'
    },
    specialInstructions: [
      'Rush order - priority inspection',
      'Customer very quality sensitive'
    ],
    batchInfo: {
      batchNumber: 'B2025-045',
      rawMaterial: 'Cotton Yarn 30s',
      dyeLot: 'DL-2024-088',
      productionDates: '20-21 Dec 2024'
    },
    checklist: [
      { item: 'Color match verification', checked: false, required: true },
      { item: 'GSM weight check', checked: false, required: true },
      { item: 'Width measurement', checked: false, required: true },
      { item: 'Shrinkage test', checked: false, required: true },
      { item: 'Surface defect inspection', checked: false, required: true }
    ]
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

// JobCard Helper Functions for Customer Fabric Tracking
export const getJobCardById = (id: string): JobCard | undefined => {
  return mockJobCards.find(jobCard => jobCard.id === id);
};

export const getJobCardBySalesOrder = (salesOrderId: string): JobCard | undefined => {
  return mockJobCards.find(jobCard => jobCard.salesOrderId === salesOrderId);
};

export const getJobCardsByCustomer = (customerId: string): JobCard[] => {
  return mockJobCards.filter(jobCard => jobCard.customerId === customerId);
};

export const getWorkOrdersByJobCard = (jobCardId: string): WorkOrder[] => {
  const jobCard = getJobCardById(jobCardId);
  if (!jobCard) return [];
  return mockWorkOrders.filter(wo => jobCard.workOrderIds.includes(wo.id));
};

export const getJobCardByWorkOrder = (workOrderId: string): JobCard | undefined => {
  return mockJobCards.find(jobCard => jobCard.workOrderIds.includes(workOrderId));
};