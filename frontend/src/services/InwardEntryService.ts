import { InwardEntry, updateInwardEntry } from '../data/procurementMockData';
import { getJobOrderById, updateJobOrder } from '../data/salesMockData';
import { autoCreateProductionOrder, canCreateProductionOrder } from './ProductionOrderService';

export const completeInwardEntryInspection = async (
  inwardEntryId: string,
  inspectionData: {
    inspectedBy: string;
    qualityAssessment: string;
    inspectionDate: string;
    notes?: string;
  }
): Promise<{ success: boolean; productionOrderId?: string; message: string }> => {
  try {
    // Update inward entry with inspection data
    const updatedEntry = updateInwardEntry(inwardEntryId, {
      ...inspectionData,
      inspectionDate: inspectionData.inspectionDate
    });

    if (!updatedEntry) {
      return { success: false, message: 'Inward Entry not found' };
    }

    // Get the related job order
    const jobOrder = getJobOrderById(updatedEntry.jobOrderId);
    if (!jobOrder) {
      return { success: false, message: 'Related Job Order not found' };
    }

    // Check if we can create a production order
    const validation = await canCreateProductionOrder(jobOrder, updatedEntry);
    if (!validation.canCreate) {
      return { 
        success: true, 
        message: `Inward Entry completed. ${validation.reason}` 
      };
    }

    // Auto-create Production Order for Job Orders with client material ownership
    if (jobOrder.materialOwnership === 'client') {
      try {
        const productionOrder = await autoCreateProductionOrder(updatedEntry, jobOrder);
        
        // Update Job Order status to reflect material receipt completion
        await updateJobOrder(jobOrder.id, {
          status: 'materials_acknowledged'
        });
        
        return {
          success: true,
          productionOrderId: productionOrder.id,
          message: `Inward Entry completed. Job Order updated to 'materials_acknowledged'. Production Order ${productionOrder.id} created automatically.`
        };
      } catch (error) {
        return {
          success: true,
          message: `Inward Entry completed. Production Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }

    return {
      success: true,
      message: 'Inward Entry completed successfully.'
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to complete inward entry: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const recordCustomerFabricReceipt = async (
  jobOrderId: string,
  fabricData: {
    materialType: string;
    receivedQuantity: number;
    unit: 'meters' | 'yards' | 'kg';
    challanNumber: string;
    receivedBy: string;
    challanPhoto?: string;
    notes?: string;
  }
): Promise<{ success: boolean; inwardEntryId?: string; message: string }> => {
  try {
    const jobOrder = getJobOrderById(jobOrderId);
    if (!jobOrder) {
      return { success: false, message: 'Job Order not found' };
    }

    if (jobOrder.materialOwnership !== 'client') {
      return { success: false, message: 'Fabric receipt is only for Job Orders with client material ownership' };
    }

    // Create new inward entry
    const inwardEntry: InwardEntry = {
      id: `IE-${Date.now()}`,
      jobOrderId: jobOrderId,
      customerId: jobOrder.businessProfileId,
      customerName: 'Customer', // Will be populated from getBusinessProfileById in production
      materialType: fabricData.materialType,
      receivedQuantity: fabricData.receivedQuantity,
      unit: fabricData.unit,
      challanNumber: fabricData.challanNumber,
      receivedDate: new Date().toISOString(),
      receivedBy: fabricData.receivedBy,
      challanPhoto: fabricData.challanPhoto,
      notes: fabricData.notes || 'Customer fabric received - pending quality inspection'
    };

    // In a real implementation, this would be an API call
    // For now, we'll add to mock data
    const { createInwardEntry } = await import('../data/procurementMockData');
    createInwardEntry(inwardEntry);
    
    // Update Job Order status to reflect material receipt
    await updateJobOrder(jobOrderId, {
      status: 'awaiting_client_materials' // Update to show material receipt in progress
    });

    return {
      success: true,
      inwardEntryId: inwardEntry.id,
      message: `Customer fabric receipt recorded. Job Order updated to 'awaiting_client_materials'. Inward Entry ${inwardEntry.id} created. Complete quality inspection to proceed with production.`
    };

  } catch (error) {
    return {
      success: false,
      message: `Failed to record fabric receipt: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};