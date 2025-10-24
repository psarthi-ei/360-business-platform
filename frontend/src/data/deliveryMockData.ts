// deliveryMockData.ts - Ready Tab Delivery Management Mock Data

export interface DeliveryItem {
  id: string;
  salesOrderId: string; // References actual SO ID from salesMockData.ts
  businessProfileId: string; // References actual customer from customerMockData.ts
  workOrderIds: string[];
  product: string;
  customer: string; // Display name only
  quantity: string;
  qcGrade: string;
  status: 'ready_dispatch' | 'delivery_scheduled' | 'dispatched' | 'delivered' | 'failed_returned';
  readyTime: string;
  dueDate: string; // Customer expected delivery date
  
  // Logistics Details
  assignedVehicle?: string;
  assignedDriver?: string;
  driverPhone?: string;
  scheduledPickup?: string;
  scheduledDelivery?: string;
  actualDispatch?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  
  // Tracking Information
  trackingInfo?: {
    currentLocation?: string;
    distanceRemaining?: string;
    lastUpdated?: string;
    route?: string;
    speed?: string;
    eta?: string;
  };
  
  // Delivery Proof
  deliveryProof?: {
    photoEvidence?: string;
    customerSignature?: string;
    receivedBy?: string;
    receivedDesignation?: string;
    deliveryNotes?: string;
    condition?: string;
  };
  
  // Failure Information
  failureInfo?: {
    reason?: string;
    attempt?: number;
    maxAttempts?: number;
    driverNotes?: string;
    returnStatus?: string;
    nextAttemptDate?: string;
  };
  
  priority: 'normal' | 'urgent' | 'high';
}

export interface Vehicle {
  id: string;
  number: string;
  type: string;
  capacity: string;
  status: 'available' | 'assigned' | 'in_transit' | 'maintenance';
  currentLocation?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'available' | 'assigned' | 'on_route' | 'off_duty';
  currentVehicle?: string;
  currentLocation?: string;
}

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'V001',
    number: 'GJ-01-AB-1234',
    type: 'Tata Ace',
    capacity: '750 kg',
    status: 'available'
  },
  {
    id: 'V002', 
    number: 'GJ-02-CD-5678',
    type: 'Mahindra Bolero Pickup',
    capacity: '1000 kg',
    status: 'assigned'
  },
  {
    id: 'V003',
    number: 'GJ-03-EF-9012',
    type: 'Maruti Super Carry',
    capacity: '800 kg', 
    status: 'available'
  }
];

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Suresh Patel',
    phone: '+91 98765 43210',
    licenseNumber: 'GJ-0120230045',
    status: 'available'
  },
  {
    id: 'D002',
    name: 'Ramesh Shah',
    phone: '+91 98765 43211', 
    licenseNumber: 'GJ-0120230046',
    status: 'on_route',
    currentVehicle: 'V002'
  },
  {
    id: 'D003',
    name: 'Kiran Modi',
    phone: '+91 98765 43212',
    licenseNumber: 'GJ-0120230047',
    status: 'available'
  }
];

// Mock Delivery Items - Referenced to actual Sales Orders
export const mockDeliveryItems: DeliveryItem[] = [
  // DEL-001: Based on SO-001 (Gujarat Garments - Premium Cotton)
  {
    id: 'DEL-001',
    salesOrderId: 'SO-001',
    businessProfileId: 'bp-gujarat-garments',
    workOrderIds: ['WO-2025-001A', 'WO-2025-001B'],
    product: 'Premium Cotton Fabric',
    customer: 'Gujarat Garments',
    quantity: '1,500 meters',
    qcGrade: 'A Grade (Premium)',
    status: 'ready_dispatch',
    readyTime: '24 Oct 2:00 PM',
    dueDate: '26 Oct 2024',
    priority: 'normal'
  },
  
  // DEL-002: Based on SO-002 (Gujarat Garments - Mixed Fabric)
  {
    id: 'DEL-002',
    salesOrderId: 'SO-002',
    businessProfileId: 'bp-gujarat-garments', 
    workOrderIds: ['WO-2025-002A'],
    product: 'Mixed fabric for casual wear',
    customer: 'Gujarat Garments',
    quantity: '2,500 meters',
    qcGrade: 'A Grade (Standard)',
    status: 'delivery_scheduled',
    readyTime: '23 Oct 4:30 PM',
    dueDate: '25 Oct 2024',
    assignedVehicle: 'GJ-01-AB-1234',
    assignedDriver: 'Suresh Patel',
    driverPhone: '+91 98765 43210',
    scheduledDelivery: '25 Oct 10:00 AM',
    priority: 'normal'
  },
  
  // DEL-003: Based on SO-003 (Baroda Fashion - Polyester Blend)
  {
    id: 'DEL-003',
    salesOrderId: 'SO-003',
    businessProfileId: 'bp-baroda-fashion',
    workOrderIds: ['WO-2025-003A'],
    product: 'Polyester blend fabric',
    customer: 'Baroda Fashion House',
    quantity: '2,000 meters',
    qcGrade: 'A Grade (Premium)',
    status: 'dispatched',
    readyTime: '22 Oct 2:00 PM',
    dueDate: '24 Oct 2024',
    assignedVehicle: 'GJ-02-CD-5678',
    assignedDriver: 'Ramesh Shah',
    driverPhone: '+91 98765 43211',
    actualDispatch: '24 Oct 8:15 AM',
    estimatedDelivery: '24 Oct 11:30 AM',
    trackingInfo: {
      currentLocation: 'NH-8, Anand',
      distanceRemaining: '45 km',
      lastUpdated: '5 minutes ago',
      route: 'Surat → Vadodara (95km)',
      speed: '70 km/h',
      eta: '24 Oct 11:30 AM'
    },
    priority: 'normal'
  },
  
  // DEL-004: Based on SO-004 (Baroda Fashion - Completed)
  {
    id: 'DEL-004',
    salesOrderId: 'SO-004',
    businessProfileId: 'bp-baroda-fashion',
    workOrderIds: ['WO-2025-004A'],
    product: 'Seasonal collection fabric',
    customer: 'Baroda Fashion House',
    quantity: '1,800 meters',
    qcGrade: 'A Grade (Premium)',
    status: 'delivered',
    readyTime: '20 Oct 3:30 PM',
    dueDate: '22 Oct 2024',
    assignedVehicle: 'GJ-03-EF-9012',
    assignedDriver: 'Kiran Modi',
    driverPhone: '+91 98765 43212',
    actualDispatch: '22 Oct 9:00 AM',
    actualDelivery: '22 Oct 12:45 PM',
    deliveryProof: {
      photoEvidence: 'Delivered_Seasonal_Fabric_Oct22.jpg',
      customerSignature: 'signature_captured.png',
      receivedBy: 'Rajesh Mehta',
      receivedDesignation: 'Creative Director',
      deliveryNotes: 'Premium fabric delivered in excellent condition. Customer very satisfied with quality and timing.',
      condition: 'Excellent'
    },
    priority: 'normal'
  },
  
  // DEL-005: Based on SO-005 (Gujarat Garments - Cotton Bulk)
  {
    id: 'DEL-005',
    salesOrderId: 'SO-005',
    businessProfileId: 'bp-gujarat-garments',
    workOrderIds: ['WO-2025-005A', 'WO-2025-005B'],
    product: 'Cotton fabric bulk order',
    customer: 'Gujarat Garments',
    quantity: '3,000 meters',
    qcGrade: 'A Grade (Standard)',
    status: 'ready_dispatch',
    readyTime: '24 Oct 11:00 AM',
    dueDate: '27 Oct 2024',
    priority: 'normal'
  },
  
  // DEL-006: Based on SO-006 (Baroda Fashion - Cotton Yarn)
  {
    id: 'DEL-006',
    salesOrderId: 'SO-006',
    businessProfileId: 'bp-baroda-fashion',
    workOrderIds: ['WO-2025-006A'],
    product: 'Cotton yarn fabric',
    customer: 'Baroda Fashion House',
    quantity: '2,200 meters',
    qcGrade: 'A Grade (Premium)',
    status: 'delivery_scheduled',
    readyTime: '23 Oct 1:15 PM',
    dueDate: '25 Oct 2024',
    assignedVehicle: 'GJ-03-EF-9012',
    assignedDriver: 'Kiran Modi',
    driverPhone: '+91 98765 43212',
    scheduledDelivery: '25 Oct 2:00 PM',
    priority: 'high'
  },
  
  // DEL-007: Failed delivery scenario
  {
    id: 'DEL-007',
    salesOrderId: 'SO-007',
    businessProfileId: 'bp-gujarat-garments',
    workOrderIds: ['WO-2025-007A'],
    product: 'Cotton Denim fabric',
    customer: 'Gujarat Garments',
    quantity: '1,800 meters',
    qcGrade: 'B Grade (Standard)',
    status: 'failed_returned',
    readyTime: '21 Oct 1:00 PM',
    dueDate: '23 Oct 2024',
    assignedVehicle: 'GJ-01-AB-1234',
    assignedDriver: 'Suresh Patel',
    driverPhone: '+91 98765 43210',
    actualDispatch: '23 Oct 2:00 PM',
    failureInfo: {
      reason: 'Customer office closed',
      attempt: 1,
      maxAttempts: 3,
      driverNotes: 'Office was locked, security said customer unavailable. No prior intimation received.',
      returnStatus: 'En route to warehouse',
      nextAttemptDate: '26 Oct 10:00 AM'
    },
    priority: 'high'
  }
];

// Helper Functions
export const getDeliveryItemsByStatus = (status: string): DeliveryItem[] => {
  if (status === 'all') return mockDeliveryItems;
  return mockDeliveryItems.filter(item => item.status === status);
};

export const getDeliveryItemById = (id: string): DeliveryItem | undefined => {
  return mockDeliveryItems.find(item => item.id === id);
};

export const getAvailableVehicles = (): Vehicle[] => {
  return mockVehicles.filter(vehicle => vehicle.status === 'available');
};

export const getAvailableDrivers = (): Driver[] => {
  return mockDrivers.filter(driver => driver.status === 'available');
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.number === id);
};

export const getDriverByName = (name: string): Driver | undefined => {
  return mockDrivers.find(driver => driver.name === name);
};

// Cross-reference helper functions to get related data
export const getDeliveryItemsWithReferences = () => {
  return mockDeliveryItems.map(item => ({
    ...item,
    // Customer details can be fetched from customerMockData.ts using businessProfileId
    // Sales order details can be fetched from salesMockData.ts using salesOrderId
    // This design avoids data duplication while maintaining clean separation
  }));
};