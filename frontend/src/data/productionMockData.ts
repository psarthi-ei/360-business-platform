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
  id: string;
  workOrderId: string;
  product: string;
  batchNumber: string;
  quantity: string;
  inspector?: string;
  status: 'pending_inspection' | 'in_progress' | 'approved' | 'rejected';
  grade?: 'A Grade' | 'B Grade' | 'C Grade' | 'Reject';
  completedTime?: string;
  submittedTime: string;
  checklist?: QCChecklistItem[];
  notes?: string;
  issues?: string[];
  photos?: string[];
  priority: 'normal' | 'high' | 'urgent';
}

export interface QCChecklistItem {
  item: string;
  checked: boolean;
  required: boolean;
}

export interface DeliveryItem {
  id: string;
  salesOrderId: string;
  workOrderId: string;
  product: string;
  customer: string;
  quantity: string;
  qcGrade: string;
  status: 'ready_dispatch' | 'assigned' | 'in_transit' | 'delivered';
  readyTime: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingInfo?: DeliveryTracking;
  priority: 'normal' | 'urgent';
}

export interface DeliveryTracking {
  currentLocation?: string;
  distanceRemaining?: string;
  eta?: string;
  lastUpdated?: string;
  milestones?: DeliveryMilestone[];
}

export interface DeliveryMilestone {
  time: string;
  status: string;
  location: string;
  completed: boolean;
}

export interface Vehicle {
  id: string;
  number: string;
  capacity: string;
  currentLoad: string;
  driver: string;
  status: 'available' | 'busy' | 'returning' | 'maintenance';
  currentLocation?: string;
  eta?: string;
}

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
    workOrderId: 'WO#451',
    product: 'Cotton Fabric',
    batchNumber: 'B2025-045',
    quantity: '800m',
    status: 'pending_inspection',
    submittedTime: '2:30 PM',
    priority: 'high',
    checklist: [
      { item: 'Color match within tolerance', checked: true, required: true },
      { item: 'Width specifications met', checked: true, required: true },
      { item: 'Weight/GSM correct', checked: true, required: true },
      { item: 'Shrinkage test pending', checked: false, required: true },
      { item: 'No visible defects', checked: true, required: true }
    ]
  },
  {
    id: 'QC#302',
    workOrderId: 'WO#452',
    product: 'Silk Blend',
    batchNumber: 'B2025-046',
    quantity: '300m',
    inspector: 'Rajesh Patel',
    status: 'approved',
    grade: 'A Grade',
    completedTime: '1:15 PM',
    submittedTime: '12:45 PM',
    priority: 'normal',
    notes: 'Excellent quality, meets all specifications'
  },
  {
    id: 'QC#300',
    workOrderId: 'WO#450',
    product: 'Cotton Yarn',
    batchNumber: 'B2025-044',
    quantity: '600m',
    inspector: 'Ravi Sharma',
    status: 'approved',
    grade: 'A Grade',
    completedTime: '1:30 PM',
    submittedTime: '1:00 PM',
    priority: 'normal',
    notes: 'Premium quality batch'
  },
  {
    id: 'QC#299',
    workOrderId: 'WO#449',
    product: 'Dyed Cotton',
    batchNumber: 'B2025-043',
    quantity: '400m',
    inspector: 'Meera Singh',
    status: 'rejected',
    grade: 'Reject',
    completedTime: '11:45 AM',
    submittedTime: '11:00 AM',
    priority: 'normal',
    issues: ['Color variation', 'Thread count below specification'],
    notes: 'Requires rework - color inconsistency in batch'
  }
];

export const mockDeliveryItems: DeliveryItem[] = [
  {
    id: 'DEL#001',
    salesOrderId: 'SO-002',
    workOrderId: 'WO#451',
    product: 'Mixed fabric for casual wear',
    customer: 'Gujarat Garments',
    quantity: '1000m',
    qcGrade: 'A Grade',
    status: 'ready_dispatch',
    readyTime: 'Dec 20, 2:30 PM',
    priority: 'urgent'
  },
  {
    id: 'DEL#002',
    salesOrderId: 'SO-002',
    workOrderId: 'WO#453',
    product: 'Mixed fabric for casual wear - Batch 2',
    customer: 'Gujarat Garments',
    quantity: '800m',
    qcGrade: 'A Grade',
    status: 'in_transit',
    readyTime: 'Dec 19, 3:00 PM',
    assignedVehicle: 'GJ-01-AB-1234',
    assignedDriver: 'Suresh Patel',
    estimatedDelivery: '6:00 PM',
    priority: 'normal',
    trackingInfo: {
      currentLocation: 'NH-8, Bharuch',
      distanceRemaining: '120 km',
      eta: '2 hours 15 minutes',
      lastUpdated: '2 minutes ago',
      milestones: [
        { time: '2:00 PM', status: 'Departed Surat', location: 'Surat Factory', completed: true },
        { time: '3:30 PM', status: 'Passed Bharuch', location: 'Bharuch Toll', completed: true },
        { time: '5:15 PM', status: 'In Transit', location: 'Highway', completed: false },
        { time: '6:00 PM', status: 'Arrival at Destination', location: 'Ahmedabad', completed: false }
      ]
    }
  },
  {
    id: 'DEL#003',
    salesOrderId: 'SO-004',
    workOrderId: 'WO#450',
    product: 'Updated seasonal collection - Final batch',
    customer: 'Baroda Fashion',
    quantity: '600m',
    qcGrade: 'A Grade',
    status: 'delivered',
    readyTime: 'Dec 19, 9:00 AM',
    assignedVehicle: 'GJ-02-CD-5678',
    assignedDriver: 'Ramesh Kumar',
    actualDelivery: '11:30 AM',
    priority: 'normal'
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH#001',
    number: 'GJ-01-AB-1234',
    capacity: '5000m',
    currentLoad: '2000m',
    driver: 'Suresh Patel',
    status: 'busy',
    currentLocation: 'NH-8, Bharuch',
    eta: '2 hours'
  },
  {
    id: 'VEH#002',
    number: 'GJ-02-CD-5678',
    capacity: '3000m',
    currentLoad: '0m',
    driver: 'Ramesh Kumar',
    status: 'returning',
    eta: '3:00 PM'
  },
  {
    id: 'VEH#003',
    number: 'GJ-03-EF-9012',
    capacity: '4000m',
    currentLoad: '0m',
    driver: 'Vikram Singh',
    status: 'available'
  }
];

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

export const getDeliveryItemsBySalesOrder = (salesOrderId: string): DeliveryItem[] => {
  return mockDeliveryItems.filter(del => del.salesOrderId === salesOrderId);
};

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