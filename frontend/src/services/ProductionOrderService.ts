import { InwardEntry } from '../data/procurementMockData';
import { JobOrder } from '../data/salesMockData';
import { ProductionOrder, mockProductionOrders, WorkOrder, mockWorkOrders } from '../data/productionMockData';
import { getBusinessProfileById } from '../data/customerMockData';

export interface LotDefinition {
  description: string;
  quantity: number;
  process: 'dyeing' | 'finishing' | 'printing' | 'weaving';
  priority: 'normal' | 'urgent' | 'high';
  notes?: string;
}

export const autoCreateProductionOrder = async (
  inwardEntry: InwardEntry, 
  jobOrder: JobOrder
): Promise<ProductionOrder> => {
  // Validate prerequisites
  if (jobOrder.materialOwnership !== 'client') {
    throw new Error('Production Orders are only created for job work (client material ownership)');
  }

  if (await getProductionOrderBySalesOrder(jobOrder.id)) {
    throw new Error('Production Order already exists for this Job Order');
  }

  const customer = getBusinessProfileById(jobOrder.businessProfileId);
  if (!customer) {
    throw new Error('Customer not found for Job Order');
  }

  const productionOrder: ProductionOrder = {
    id: `PO-${Date.now()}-${jobOrder.id.split('-')[1]}`,
    salesOrderId: jobOrder.id,
    customerId: jobOrder.businessProfileId,
    customerName: customer.companyName || customer.contactPerson,
    fabricDetails: {
      type: inwardEntry.materialType,
      quantity: inwardEntry.receivedQuantity,
      unit: inwardEntry.unit,
      challanReference: inwardEntry.challanNumber,
      qualityGrade: inwardEntry.qualityAssessment || 'Standard',
      specialInstructions: jobOrder.serviceRequirements?.specialInstructions
    },
    workOrderIds: [],
    status: 'awaiting_work_order_creation',
    inwardEntryId: inwardEntry.id,
    createdDate: new Date().toISOString(),
    receivedDate: inwardEntry.receivedDate,
    notes: 'Production Order created automatically after material receipt'
  };

  // Add to mock data (in real implementation, this would be API call)
  mockProductionOrders.push(productionOrder);
  
  return productionOrder;
};

export const getProductionOrderBySalesOrder = (salesOrderId: string): ProductionOrder | undefined => {
  return mockProductionOrders.find(po => po.salesOrderId === salesOrderId);
};

export const getProductionOrderById = (productionOrderId: string): ProductionOrder | undefined => {
  return mockProductionOrders.find(po => po.id === productionOrderId);
};

export const updateProductionOrder = async (
  productionOrderId: string, 
  updates: Partial<ProductionOrder>
): Promise<ProductionOrder> => {
  const index = mockProductionOrders.findIndex(po => po.id === productionOrderId);
  if (index === -1) {
    throw new Error('Production Order not found');
  }

  const updatedProductionOrder = {
    ...mockProductionOrders[index],
    ...updates
  };

  mockProductionOrders[index] = updatedProductionOrder;
  return updatedProductionOrder;
};

export const getAllProductionOrders = (): ProductionOrder[] => {
  return mockProductionOrders;
};

export const getProductionOrdersByStatus = (status: ProductionOrder['status']): ProductionOrder[] => {
  return mockProductionOrders.filter(po => po.status === status);
};

export const validateInwardEntryForProduction = (inwardEntry: InwardEntry): boolean => {
  // Validate that inward entry has all required fields for production
  return !!(
    inwardEntry.materialType &&
    inwardEntry.receivedQuantity > 0 &&
    inwardEntry.unit &&
    inwardEntry.challanNumber &&
    inwardEntry.receivedDate
  );
};

export const canCreateProductionOrder = async (jobOrder: JobOrder, inwardEntry: InwardEntry): Promise<{ 
  canCreate: boolean; 
  reason?: string; 
}> => {
  // Check if job order is valid for production order creation
  if (jobOrder.materialOwnership !== 'client') {
    return { 
      canCreate: false, 
      reason: 'Production Orders are only created for job work orders' 
    };
  }

  // Check if production order already exists
  const existingPO = await getProductionOrderBySalesOrder(jobOrder.id);
  if (existingPO) {
    return { 
      canCreate: false, 
      reason: 'Production Order already exists for this Job Order' 
    };
  }

  // Validate inward entry
  if (!validateInwardEntryForProduction(inwardEntry)) {
    return { 
      canCreate: false, 
      reason: 'Inward Entry does not have all required fields for production' 
    };
  }

  // Check if customer exists
  const customer = getBusinessProfileById(jobOrder.businessProfileId);
  if (!customer) {
    return { 
      canCreate: false, 
      reason: 'Customer not found for Job Order' 
    };
  }

  return { canCreate: true };
};

export const createWorkOrdersFromLots = async (
  productionOrderId: string, 
  lotDefinitions: LotDefinition[]
): Promise<WorkOrder[]> => {
  const productionOrder = getProductionOrderById(productionOrderId);
  if (!productionOrder) {
    throw new Error('Production Order not found');
  }

  // Validate total quantities match
  const totalLotQuantity = lotDefinitions.reduce((sum, lot) => sum + lot.quantity, 0);
  if (totalLotQuantity !== productionOrder.fabricDetails.quantity) {
    throw new Error('Total lot quantities must equal total fabric quantity');
  }

  const workOrders: WorkOrder[] = lotDefinitions.map((lot, index) => ({
    id: `WO-${Date.now()}-${index + 1}`,
    productionOrderId: productionOrder.id,
    salesOrderId: productionOrder.salesOrderId,
    product: lot.description,
    customer: productionOrder.customerName,
    batchNumber: `${productionOrderId.split('-')[1]}-WO-${String(index + 1).padStart(2, '0')}`,
    targetQuantity: `${lot.quantity} ${productionOrder.fabricDetails.unit}`,
    producedQuantity: `0 ${productionOrder.fabricDetails.unit}`,
    remainingQuantity: `${lot.quantity} ${productionOrder.fabricDetails.unit}`,
    progress: 0,
    status: 'pending' as const,
    assignedMachine: '',
    assignedWorker: '',
    priority: lot.priority,
    createdDate: new Date().toISOString(),
    notes: lot.notes || ''
  }));
  
  // Add work orders to mock data
  mockWorkOrders.push(...workOrders);
  
  // Update ProductionOrder with WorkOrder IDs and status
  await updateProductionOrder(productionOrderId, {
    workOrderIds: workOrders.map(wo => wo.id),
    status: 'ready_for_production'
  });
  
  return workOrders;
};

export const validateLotDefinitions = (
  lotDefinitions: LotDefinition[], 
  totalQuantity: number
): { isValid: boolean; reason?: string } => {
  if (lotDefinitions.length === 0) {
    return { isValid: false, reason: 'At least one lot must be defined' };
  }

  const totalLotQuantity = lotDefinitions.reduce((sum, lot) => sum + lot.quantity, 0);
  if (totalLotQuantity !== totalQuantity) {
    return { 
      isValid: false, 
      reason: `Total lot quantity (${totalLotQuantity}) must equal fabric quantity (${totalQuantity})` 
    };
  }

  // Validate each lot has required fields
  for (const lot of lotDefinitions) {
    if (!lot.description || lot.quantity <= 0) {
      return { 
        isValid: false, 
        reason: 'Each lot must have a description and positive quantity' 
      };
    }
  }

  return { isValid: true };
};

export const getWorkOrdersByProductionOrder = (productionOrderId: string): WorkOrder[] => {
  return mockWorkOrders.filter(wo => wo.productionOrderId === productionOrderId);
};