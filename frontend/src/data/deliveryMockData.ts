// deliveryMockData.ts - Ready Tab Delivery Management Mock Data

export interface DeliveryItem {
  id: string;
  workOrderId: string; // References Work Order (lot) from productionMockData.ts
  salesOrderId: string; // References Job Order from salesMockData.ts for context
  businessProfileId: string; // References actual customer from customerMockData.ts
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

// Mock Delivery Items - Referenced to actual Work Orders (Lots)
export const mockDeliveryItems: DeliveryItem[] = [
  // Delivery Item for WO-2024-001-A (Navy Blue Dyeing - completed)
  {
    id: 'DEL-2024-001-A',
    workOrderId: 'WO-2024-001-A',
    salesOrderId: 'JO-2024-001',
    businessProfileId: 'bp-surat-processors',
    product: 'Navy Blue Reactive Dyeing - Lot A',
    customer: 'Surat Processors',
    quantity: '2000m',
    qcGrade: 'A Grade',
    status: 'ready_dispatch',
    readyTime: '2024-10-17 14:30',
    dueDate: '2024-10-20',
    
    // Logistics Details
    assignedVehicle: 'GJ-01-AB-1234',
    assignedDriver: 'Suresh Patel',
    driverPhone: '+91 98765 43210',
    scheduledPickup: '2024-10-18 09:00',
    scheduledDelivery: '2024-10-18 11:30',
    
    priority: 'normal'
  },
  
  // Delivery Item for WO-2024-002-A (Finishing - pending completion)
  {
    id: 'DEL-2024-002-A',
    workOrderId: 'WO-2024-002-A',
    salesOrderId: 'JO-2024-002',
    businessProfileId: 'bp-ahmedabad-finishers',
    product: 'Softening & Anti-wrinkle Finishing - Lot A',
    customer: 'Ahmedabad Finishers',
    quantity: '1500m',
    qcGrade: 'Pending QC',
    status: 'ready_dispatch',
    readyTime: '2024-10-18 16:00',
    dueDate: '2024-10-22',
    
    priority: 'normal'
  },
  
  // Delivery Items for WO-2024-003-A (Red Printing Lot)
  {
    id: 'DEL-2024-003-A',
    workOrderId: 'WO-2024-003-A',
    salesOrderId: 'JO-2024-003',
    businessProfileId: 'bp-mumbai-printers',
    product: 'Multi-color Printing - Red Lot A',
    customer: 'Mumbai Printers',
    quantity: '750m',
    qcGrade: 'A Grade',
    status: 'delivery_scheduled',
    readyTime: '2024-10-18 12:00',
    dueDate: '2024-10-25',
    
    // Logistics Details
    assignedVehicle: 'GJ-02-CD-5678',
    assignedDriver: 'Ramesh Shah',
    driverPhone: '+91 98765 43211',
    scheduledPickup: '2024-10-19 08:00',
    scheduledDelivery: '2024-10-19 14:00',
    
    // Tracking Information
    trackingInfo: {
      currentLocation: 'Surat Warehouse',
      distanceRemaining: '280 km',
      lastUpdated: '2024-10-19 06:30',
      route: 'Surat → Vapi → Mumbai',
      speed: '65 km/h',
      eta: '2024-10-19 13:45'
    },
    
    priority: 'high'
  },
  
  // Delivery Items for WO-2024-003-B (Blue Printing Lot)
  {
    id: 'DEL-2024-003-B',
    workOrderId: 'WO-2024-003-B',
    salesOrderId: 'JO-2024-003',
    businessProfileId: 'bp-mumbai-printers',
    product: 'Multi-color Printing - Blue Lot B',
    customer: 'Mumbai Printers',
    quantity: '750m',
    qcGrade: 'A Grade',
    status: 'ready_dispatch',
    readyTime: '2024-10-18 14:00',
    dueDate: '2024-10-25',
    
    priority: 'normal'
  },
  
  // Delivery Items for WO-2024-003-C (Green Printing Lot)
  {
    id: 'DEL-2024-003-C',
    workOrderId: 'WO-2024-003-C',
    salesOrderId: 'JO-2024-003',
    businessProfileId: 'bp-mumbai-printers',
    product: 'Multi-color Printing - Green Lot C',
    customer: 'Mumbai Printers',
    quantity: '750m',
    qcGrade: 'B Grade',
    status: 'dispatched',
    readyTime: '2024-10-17 16:00',
    dueDate: '2024-10-25',
    
    // Logistics Details
    assignedVehicle: 'GJ-03-EF-9012',
    assignedDriver: 'Kiran Modi',
    driverPhone: '+91 98765 43212',
    scheduledPickup: '2024-10-18 07:00',
    scheduledDelivery: '2024-10-18 13:00',
    actualDispatch: '2024-10-18 07:15',
    estimatedDelivery: '2024-10-18 13:30',
    
    // Tracking Information
    trackingInfo: {
      currentLocation: 'Vapi Toll Plaza',
      distanceRemaining: '180 km',
      lastUpdated: '2024-10-18 10:15',
      route: 'Surat → Vapi → Mumbai',
      speed: '70 km/h',
      eta: '2024-10-18 13:20'
    },
    
    priority: 'normal'
  },
  
  // Delivery Items for WO-2024-003-D (Yellow Printing Lot)
  {
    id: 'DEL-2024-003-D',
    workOrderId: 'WO-2024-003-D',
    salesOrderId: 'JO-2024-003',
    businessProfileId: 'bp-mumbai-printers',
    product: 'Multi-color Printing - Yellow Lot D',
    customer: 'Mumbai Printers',
    quantity: '750m',
    qcGrade: 'A Grade',
    status: 'delivered',
    readyTime: '2024-10-16 18:00',
    dueDate: '2024-10-25',
    
    // Logistics Details
    assignedVehicle: 'GJ-01-AB-1234',
    assignedDriver: 'Suresh Patel',
    driverPhone: '+91 98765 43210',
    scheduledPickup: '2024-10-17 08:00',
    scheduledDelivery: '2024-10-17 14:00',
    actualDispatch: '2024-10-17 08:10',
    actualDelivery: '2024-10-17 14:15',
    
    // Delivery Proof
    deliveryProof: {
      photoEvidence: 'delivery_photo_del_003_d.jpg',
      customerSignature: 'signature_mumbai_printers.png',
      receivedBy: 'Rajesh Kumar',
      receivedDesignation: 'Warehouse Manager',
      deliveryNotes: 'Material delivered in perfect condition. Customer satisfied with quality.',
      condition: 'Excellent'
    },
    
    priority: 'normal'
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