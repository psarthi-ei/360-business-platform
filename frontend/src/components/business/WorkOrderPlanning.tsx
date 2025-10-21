import React, { useMemo, useState } from 'react';
import { mockWorkOrders, WorkOrder, mockMachines, mockProductionWorkers } from '../../data/productionMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './WorkOrderPlanning.module.css';

interface WorkOrderPlanningProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

const WorkOrderPlanning = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled 
}: WorkOrderPlanningProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter logic for work orders
  const filteredWorkOrders = useMemo(() => {
    if (filterState === 'all') return mockWorkOrders;
    return mockWorkOrders.filter(wo => {
      switch(filterState) {
        case 'pending': return wo.status === 'pending';
        case 'running': return wo.status === 'in_progress';
        case 'completed': return wo.status === 'completed';
        case 'qc_ready': return wo.status === 'ready_qc';
        default: return true;
      }
    });
  }, [filterState]);

  // Status mapping functions
  const getWOStatusClass = (workOrder: WorkOrder) => {
    if (workOrder.status === 'completed') return 'ds-card-status-active';
    if (workOrder.status === 'in_progress') return 'ds-card-status-pending'; 
    if (workOrder.status === 'ready_qc') return 'ds-card-priority-high';
    return 'ds-card-status-inactive'; // pending
  };

  const getWOStatusIcon = (workOrder: WorkOrder) => {
    if (workOrder.progress === 100) return '✅';
    if (workOrder.progress > 0) return '🟡';
    return '🔴';
  };

  const getWOStatusText = (workOrder: WorkOrder) => {
    switch(workOrder.status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'Running';
      case 'ready_qc': return 'Ready QC';
      case 'pending': return 'Not Started';
      default: return 'Unknown';
    }
  };

  // Material allocation status helper
  const getMaterialAllocationStatus = (workOrder: WorkOrder) => {
    if (!workOrder.materialRequirements || workOrder.materialRequirements.length === 0) {
      return {
        status: 'allocated',
        icon: '✅',
        text: 'Materials Allocated',
        details: 'All materials available'
      };
    }

    const hasShortages = workOrder.materialRequirements.some(req => 
      parseInt(req.shortage.replace(/[^\d]/g, '')) > 0
    );

    if (hasShortages) {
      const shortageList = workOrder.materialRequirements
        .filter(req => parseInt(req.shortage.replace(/[^\d]/g, '')) > 0)
        .map(req => `${req.material}: ${req.shortage} short`);
      
      return {
        status: 'partial',
        icon: '⚠️',
        text: 'Partial Allocation',
        details: shortageList
      };
    }

    return {
      status: 'allocated',
      icon: '✅',
      text: 'Materials Allocated',
      details: 'All materials reserved'
    };
  };

  // State for quantity updates and reassignments
  const [selectedMachines, setSelectedMachines] = useState<Map<string, string>>(new Map());
  const [selectedWorkers, setSelectedWorkers] = useState<Map<string, string>>(new Map());
  const [quantityValues, setQuantityValues] = useState<Map<string, string>>(new Map());

  // Available machines and workers for reassignment
  const availableMachines = mockMachines.filter(machine => machine.status === 'available');
  const availableWorkers = mockProductionWorkers.filter(worker => worker.status === 'active');

  // Assignment change handlers
  const handleMachineSelection = (workOrderId: string, machineId: string) => {
    setSelectedMachines(prev => new Map(prev.set(workOrderId, machineId)));
  };

  const handleWorkerSelection = (workOrderId: string, workerId: string) => {
    setSelectedWorkers(prev => new Map(prev.set(workOrderId, workerId)));
  };

  // Reassignment handlers  
  const handleMachineReassign = (workOrderId: string) => {
    const newMachine = selectedMachines.get(workOrderId);
    alert(`🔄 Reassigning Work Order ${workOrderId}\n\nNew Machine: ${newMachine}\n\n✅ Assignment updated\n📈 Capacity adjusted\n⏰ Timeline recalculated\n\n(Mock functionality)`);
    setSelectedMachines(prev => {
      const newMap = new Map(prev);
      newMap.delete(workOrderId);
      return newMap;
    });
  };

  const handleWorkerReassign = (workOrderId: string) => {
    const newWorker = selectedWorkers.get(workOrderId);
    alert(`🔄 Reassigning Work Order ${workOrderId}\n\nNew Worker: ${newWorker}\n\n✅ Assignment updated\n📈 Skills matched\n⏰ Schedule updated\n\n(Mock functionality)`);
    setSelectedWorkers(prev => {
      const newMap = new Map(prev);
      newMap.delete(workOrderId);
      return newMap;
    });
  };

  // Quantity update handlers
  const handleQuantityChange = (workOrderId: string, value: string) => {
    setQuantityValues(prev => new Map(prev.set(workOrderId, value)));
  };

  const handleQuantityIncrement = (workOrderId: string) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    const currentValue = quantityValues.get(workOrderId) || workOrder?.producedQuantity.replace('m', '') || '0';
    const targetMax = parseInt(workOrder?.targetQuantity.replace('m', '') || '0');
    const newValue = Math.min(parseInt(currentValue) + 10, targetMax); // Increment by 10m
    setQuantityValues(prev => new Map(prev.set(workOrderId, newValue.toString())));
  };

  const handleQuantityDecrement = (workOrderId: string) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    const currentValue = quantityValues.get(workOrderId) || workOrder?.producedQuantity.replace('m', '') || '0';
    const newValue = Math.max(parseInt(currentValue) - 10, 0); // Decrement by 10m, minimum 0
    setQuantityValues(prev => new Map(prev.set(workOrderId, newValue.toString())));
  };

  const handleQuantityUpdate = (workOrderId: string) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    const newQuantity = quantityValues.get(workOrderId) || workOrder?.producedQuantity.replace('m', '');
    const oldQuantity = workOrder?.producedQuantity.replace('m', '');
    
    alert(`📊 Updating Work Order ${workOrderId} Progress\n\nFrom: ${oldQuantity}m\nTo: ${newQuantity}m\n\n✅ Progress updated\n📈 Efficiency recalculated\n⏰ Completion time adjusted\n\n(Mock functionality)`);
    
    // Clear the temporary value after update
    setQuantityValues(prev => {
      const newMap = new Map(prev);
      newMap.delete(workOrderId);
      return newMap;
    });
  };

  // Lifecycle action handlers
  const handleStartWork = (workOrderId: string) => {
    alert(`🚀 Starting Work Order ${workOrderId}\n\n✅ Status updated to "In Progress"\n🔄 Production begins\n📊 Progress tracking enabled\n\n(Mock functionality)`);
  };

  const handleMarkComplete = (workOrderId: string) => {
    alert(`✅ Marking Work Order ${workOrderId} Complete\n\n🏁 Status automatically updated to "Ready for QC"\n📋 QC inspection queue updated\n📊 Final quantity recorded\n👤 Inspector will be notified\n\n(Mock functionality - auto-transitions to QC-ready)`);
  };

  // Toggle card details
  const toggleDetails = (workOrderId: string) => {
    toggleExpansion(workOrderId, 'data-wo-id');
  };

  return (
    <div className={styles.workOrderPlanningScreen}>
      <div className={styles.pageContent}>
        <div className={styles.workOrdersContainer}>
          {filteredWorkOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📋</div>
              <div className={styles.emptyStateText}>No work orders found</div>
              <div className={styles.emptyStateSubtext}>
                Adjust your filter or start production from Orders tab
              </div>
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {filteredWorkOrders.map(workOrder => (
                <div key={workOrder.id} className="ds-card-container" data-wo-id={workOrder.id}>
                  <div 
                    className={`ds-card ${getWOStatusClass(workOrder)} ${isExpanded(workOrder.id) ? 'ds-card-expanded' : ''}`}
                    onClick={() => toggleDetails(workOrder.id)}
                  >
                    {/* Work Order Header */}
                    <div className="ds-card-header" title={`${workOrder.id} - ${workOrder.product} - Batch ${workOrder.batchNumber}`}>
                      <span>{workOrder.id} — </span>
                      <span className={styles.truncateText}>{workOrder.product}</span>
                    </div>
                    
                    {/* Status Information */}
                    <div className="ds-card-status">
                      {getWOStatusIcon(workOrder)} {getWOStatusText(workOrder)} • {getMaterialAllocationStatus(workOrder).icon} Materials
                    </div>
                    
                    {/* Meta Information */}
                    <div className="ds-card-meta" title={`Progress: ${workOrder.producedQuantity} / ${workOrder.targetQuantity} | Machine: ${workOrder.assignedMachine} | Worker: ${workOrder.assignedWorker}`}>
                      {workOrder.producedQuantity} / {workOrder.targetQuantity} ({workOrder.progress}%)<br />
                      Machine: {workOrder.assignedMachine} • Worker: {workOrder.assignedWorker}
                    </div>

                    {/* Expand Indicator */}
                    <div className="ds-card-expand-indicator">
                      {isExpanded(workOrder.id) ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded(workOrder.id) && (
                    <div className="ds-expanded-details">
                      <div className="ds-details-content">
                        <h4>📋 Work Order Management</h4>
                        
                        <p><strong>Product:</strong> {workOrder.product}</p>
                        <p><strong>Batch:</strong> {workOrder.batchNumber}</p>
                        <p><strong>Priority:</strong> {workOrder.priority}</p>
                        
                        {/* Material Allocation Details */}
                        <div className={styles.materialAllocationSection}>
                          <p><strong>📦 Material Allocation:</strong></p>
                          <div className={`${styles.materialStatus} ${getMaterialAllocationStatus(workOrder).status === 'partial' ? styles.materialWarning : styles.materialSuccess}`}>
                            <div className={styles.materialStatusHeader}>
                              {getMaterialAllocationStatus(workOrder).icon} {getMaterialAllocationStatus(workOrder).text}
                            </div>
                            
                            {workOrder.materialRequirements && workOrder.materialRequirements.length > 0 && (
                              <div className={styles.materialRequirements}>
                                {workOrder.materialRequirements.map((req, index) => (
                                  <div key={index} className={styles.materialRequirement}>
                                    <div className={styles.materialName}>{req.material}</div>
                                    <div className={styles.materialQuantities}>
                                      <div className={styles.materialRequired}>Required: {req.required}</div>
                                      <div className={styles.materialAvailable}>Available: {req.available}</div>
                                      {parseInt(req.shortage.replace(/[^\d]/g, '')) > 0 && (
                                        <div className={styles.materialShortage}>Shortage: {req.shortage}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Conditional Assignment Controls */}
                        {(workOrder.status === 'pending' || workOrder.status === 'in_progress') && (
                          <>
                            <div className={styles.assignmentSection}>
                              <p><strong>Machine Assignment:</strong></p>
                              <div className={styles.currentAssignment}>
                                <span className={styles.currentLabel}>Current: {workOrder.assignedMachine}</span>
                              </div>
                              <div className={styles.reassignmentControl}>
                                <select 
                                  value={selectedMachines.get(workOrder.id) || ''}
                                  onChange={(e) => { e.stopPropagation(); handleMachineSelection(workOrder.id, e.target.value); }}
                                  className={styles.assignmentDropdown}
                                >
                                  <option value="">Select new machine...</option>
                                  {availableMachines.map(machine => (
                                    <option key={machine.id} value={machine.name}>
                                      {machine.name} ({machine.status})
                                    </option>
                                  ))}
                                </select>
                                <button 
                                  className="ds-btn ds-btn-primary"
                                  onClick={(e) => { e.stopPropagation(); handleMachineReassign(workOrder.id); }}
                                  disabled={!selectedMachines.get(workOrder.id)}
                                >
                                  🔄 Reassign
                                </button>
                              </div>
                            </div>

                            <div className={styles.assignmentSection}>
                              <p><strong>Worker Assignment:</strong></p>
                              <div className={styles.currentAssignment}>
                                <span className={styles.currentLabel}>Current: {workOrder.assignedWorker}</span>
                              </div>
                              <div className={styles.reassignmentControl}>
                                <select 
                                  value={selectedWorkers.get(workOrder.id) || ''}
                                  onChange={(e) => { e.stopPropagation(); handleWorkerSelection(workOrder.id, e.target.value); }}
                                  className={styles.assignmentDropdown}
                                >
                                  <option value="">Select new worker...</option>
                                  {availableWorkers.map(worker => (
                                    <option key={worker.id} value={worker.name}>
                                      {worker.name} ({worker.status})
                                    </option>
                                  ))}
                                </select>
                                <button 
                                  className="ds-btn ds-btn-primary"
                                  onClick={(e) => { e.stopPropagation(); handleWorkerReassign(workOrder.id); }}
                                  disabled={!selectedWorkers.get(workOrder.id)}
                                >
                                  🔄 Reassign
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {/* Read-only Assignment Display for completed/qc_ready work orders */}
                        {(workOrder.status === 'completed' || workOrder.status === 'ready_qc') && (
                          <>
                            <div className={styles.assignmentSection}>
                              <p><strong>Final Machine Assignment:</strong></p>
                              <div className={styles.assignmentReadonly}>
                                <span className={styles.finalAssignment}>{workOrder.assignedMachine}</span>
                              </div>
                            </div>

                            <div className={styles.assignmentSection}>
                              <p><strong>Final Worker Assignment:</strong></p>
                              <div className={styles.assignmentReadonly}>
                                <span className={styles.finalAssignment}>{workOrder.assignedWorker}</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Professional Progress & Update Section */}
                        {workOrder.status === 'in_progress' && (
                          <div className={styles.progressUpdateSection}>
                            <p><strong>📊 Progress & Update:</strong></p>
                            
                            {/* Progress Display */}
                            <div className={styles.progressDisplay}>
                              <span className={styles.progressText}>
                                {workOrder.producedQuantity} / {workOrder.targetQuantity} ({workOrder.progress}%)
                              </span>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className={styles.quantityControls}>
                              <button 
                                className={`ds-btn ds-btn-secondary ${styles.quantityIncrement}`}
                                onClick={(e) => { e.stopPropagation(); handleQuantityDecrement(workOrder.id); }}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={quantityValues.get(workOrder.id) || workOrder.producedQuantity.replace('m', '')}
                                onChange={(e) => handleQuantityChange(workOrder.id, e.target.value)}
                                className={styles.quantityInput}
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                max={workOrder.targetQuantity.replace('m', '')}
                                placeholder={workOrder.producedQuantity.replace('m', '')}
                              />
                              <button 
                                className={`ds-btn ds-btn-secondary ${styles.quantityIncrement}`}
                                onClick={(e) => { e.stopPropagation(); handleQuantityIncrement(workOrder.id); }}
                              >
                                +
                              </button>
                              <span className={styles.quantityUnit}>m</span>
                              
                              {/* Update Action - inline on desktop, separate on mobile */}
                              <button 
                                className={`ds-btn ds-btn-primary ${styles.updateButton}`}
                                onClick={(e) => { e.stopPropagation(); handleQuantityUpdate(workOrder.id); }}
                                disabled={!quantityValues.get(workOrder.id) || quantityValues.get(workOrder.id) === workOrder.producedQuantity.replace('m', '')}
                              >
                                📊 Update
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Work Order Timeline */}
                        <div className={styles.timelineInfo}>
                          {workOrder.startTime && <p><strong>Started:</strong> {workOrder.startTime}</p>}
                          {workOrder.estimatedCompletion && <p><strong>Target:</strong> {workOrder.estimatedCompletion}</p>}
                        </div>
                      </div>
                      
                      {/* Lifecycle Action Buttons */}
                      <div className={styles.cardActions}>
                        <div className={styles.actionButtons}>
                          {/* Start Work - Available for pending orders */}
                          {workOrder.status === 'pending' && (
                            <button 
                              className="ds-btn ds-btn-primary" 
                              onClick={(e) => { e.stopPropagation(); handleStartWork(workOrder.id); }}
                            >
                              🚀 Start Work
                            </button>
                          )}
                          
                          {/* Mark Complete - Available for in-progress orders (auto-transitions to QC) */}
                          {workOrder.status === 'in_progress' && (
                            <button 
                              className="ds-btn ds-btn-primary" 
                              onClick={(e) => { e.stopPropagation(); handleMarkComplete(workOrder.id); }}
                            >
                              ✅ Mark Complete
                            </button>
                          )}
                          
                          {/* QC Ready Status - Read-only for completed orders */}
                          {workOrder.status === 'ready_qc' && (
                            <div className={styles.statusInfo}>
                              <span className={styles.qcStatus}>🔍 Ready for QC Inspection</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrderPlanning;