import React, { useMemo, useState } from 'react';
import { mockWorkOrders, WorkOrder, mockMachines, mockProductionWorkers } from '../../data/productionMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
// import { useTerminologyTerms } from '../../contexts/TerminologyContext'; // TODO: implement terminology display
import styles from './WorkOrderPlanning.module.css';

interface WorkOrderPlanningProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
  machineFilter?: string;
}

const WorkOrderPlanning = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled,
  machineFilter = 'all'
}: WorkOrderPlanningProps) => {
  // Use terminology hook for Surat processing terminology
  // const { workOrder, workOrders } = useTerminologyTerms(); // TODO: implement display terminology // "Lot", "Lots"
  
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter logic for work orders
  const filteredWorkOrders = useMemo(() => {
    let filtered = mockWorkOrders;
    
    // Apply status filter
    if (filterState !== 'all') {
      filtered = filtered.filter(wo => {
        switch(filterState) {
          case 'pending': return wo.status === 'pending';
          case 'running': return wo.status === 'in_progress';
          case 'completed': return wo.status === 'completed';
          case 'qc_ready': return wo.status === 'ready_qc';
          case 'unassigned': return !wo.assignedMachine || wo.assignedMachine === '';
          default: return true;
        }
      });
    }
    
    // Apply machine filter if provided
    if (machineFilter && machineFilter !== 'all') {
      filtered = filtered.filter(wo => wo.assignedMachine === machineFilter);
    }
    
    return filtered;
  }, [filterState, machineFilter]);

  // Status mapping functions
  const getWOStatusClass = (workOrder: WorkOrder) => {
    switch(workOrder.status) {
      case 'completed': return 'ds-card-status-active';
      case 'in_progress': return 'ds-card-status-pending';
      case 'ready_qc': return 'ds-card-priority-high';
      case 'qc_approved': return 'ds-card-status-active';
      case 'ready_for_delivery': return 'ds-card-status-active';
      case 'dispatched': return 'ds-card-status-active';
      case 'delivered': return 'ds-card-status-success';
      case 'on_hold': return 'ds-card-priority-medium';
      case 'qc_rejected': return 'ds-card-priority-high';
      case 'rework_required': return 'ds-card-priority-high';
      case 'pending': return 'ds-card-status-inactive';
      default: return 'ds-card-status-inactive';
    }
  };

  const getWOStatusIcon = (workOrder: WorkOrder) => {
    switch(workOrder.status) {
      case 'completed': return '✅';
      case 'in_progress': return '🟡';
      case 'ready_qc': return '🔍';
      case 'qc_approved': return '✅';
      case 'qc_rejected': return '❌';
      case 'ready_for_delivery': return '📦';
      case 'dispatched': return '🚚';
      case 'delivered': return '✅';
      case 'on_hold': return '⏸️';
      case 'rework_required': return '🔧';
      case 'pending': return '🔴';
      default: return '❓';
    }
  };

  const getWOStatusText = (workOrder: WorkOrder) => {
    switch(workOrder.status) {
      case 'pending': return 'Not Started';
      case 'in_progress': return 'Running';
      case 'completed': return 'Completed';
      case 'on_hold': return 'On Hold';
      case 'ready_qc': return 'Ready QC';
      case 'qc_approved': return 'QC Approved';
      case 'qc_rejected': return 'QC Rejected';
      case 'ready_for_delivery': return 'Ready for Delivery';
      case 'dispatched': return 'Dispatched';
      case 'delivered': return 'Delivered';
      case 'rework_required': return 'Rework Required';
      default: return 'Unknown Status';
    }
  };

  // Material allocation status helper
  const getMaterialAllocationStatus = (workOrder: WorkOrder) => {
    if (!workOrder.materialAllocations || workOrder.materialAllocations.length === 0) {
      return {
        status: 'allocated',
        icon: '✅',
        text: 'Materials Allocated',
        details: 'All materials available'
      };
    }

    // Work Orders always have materials allocated (no shortages possible)
    const totalAllocated = workOrder.materialAllocations.length;
    const fullyConsumed = workOrder.materialAllocations.filter(alloc => 
      parseInt(alloc.remainingQuantity.replace(/[^\d]/g, '')) === 0
    ).length;

    if (fullyConsumed === totalAllocated) {
      return {
        status: 'consumed',
        icon: '✅',
        text: 'Materials Consumed',
        details: 'All allocated materials used'
      };
    }

    return {
      status: 'allocated',
      icon: '✅',
      text: 'Materials Allocated',
      details: 'Materials reserved for production'
    };
  };

  // State for quantity updates and reassignments
  const [selectedMachines, setSelectedMachines] = useState<Map<string, string>>(new Map());
  const [selectedWorkers, setSelectedWorkers] = useState<Map<string, string>>(new Map());
  const [quantityValues, setQuantityValues] = useState<Map<string, string>>(new Map());
  const [pausedWorkOrders, setPausedWorkOrders] = useState<Map<string, string>>(new Map()); // Track paused work orders with reason
  
  // State for collapsible sections within expanded cards

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

  // Quantity update handler for surface-level Update button

  const handleQuantityUpdate = (workOrderId: string) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    const currentQuantity = workOrder?.producedQuantity.replace('m', '') || '0';
    const targetQuantity = workOrder?.targetQuantity.replace('m', '') || '0';
    
    const newQuantity = prompt(
      `Update quantity for ${workOrderId}\n\nCurrent: ${currentQuantity}m\nTarget: ${targetQuantity}m\n\nEnter new quantity:`,
      currentQuantity
    );
    
    if (newQuantity && !isNaN(Number(newQuantity))) {
      const numValue = Math.max(0, Math.min(Number(newQuantity), Number(targetQuantity)));
      alert(`📊 Updated Work Order ${workOrderId}\n\nFrom: ${currentQuantity}m\nTo: ${numValue}m\n\n✅ Progress updated\n📈 Efficiency recalculated\n⏰ Completion time adjusted\n\n(Mock functionality)`);
    }
  };

  // Lifecycle action handlers
  const handleStartWork = (workOrderId: string) => {
    alert(`🚀 Starting Work Order ${workOrderId}\n\n✅ Status updated to "In Progress"\n🔄 Production begins\n📊 Progress tracking enabled\n\n(Mock functionality)`);
  };

  const handleMarkComplete = (workOrderId: string) => {
    const workOrder = mockWorkOrders.find(wo => wo.id === workOrderId);
    const currentQuantity = quantityValues.get(workOrderId) || workOrder?.producedQuantity.replace('m', '') || '0';
    const targetQuantity = workOrder?.targetQuantity.replace('m', '') || '0';
    
    if (parseInt(currentQuantity) < parseInt(targetQuantity)) {
      const confirmed = window.confirm(
        `Work Order ${workOrderId} - Complete Confirmation\n\n` +
        `Current: ${currentQuantity}m\n` +
        `Target: ${targetQuantity}m\n\n` +
        `This will automatically set quantity to ${targetQuantity}m and mark as complete.\n\n` +
        `Continue with completion?`
      );
      
      if (confirmed) {
        // Auto-update quantity to target
        setQuantityValues(prev => new Map(prev.set(workOrderId, targetQuantity)));
        alert(`✅ Work Order ${workOrderId} Completed\n\n📊 Quantity auto-updated to ${targetQuantity}m\n🏁 Status updated to "Ready for QC"\n📋 QC inspection queue updated\n👤 Inspector will be notified\n\n(Mock functionality - auto-transitions to QC-ready)`);
      }
    } else {
      alert(`✅ Marking Work Order ${workOrderId} Complete\n\n🏁 Status automatically updated to "Ready for QC"\n📋 QC inspection queue updated\n📊 Final quantity recorded\n👤 Inspector will be notified\n\n(Mock functionality - auto-transitions to QC-ready)`);
    }
  };

  // Pause/Resume handlers
  const handlePauseWork = (workOrderId: string) => {
    const reason = prompt('Reason for pausing work order:', 'Material shortage / Machine maintenance / Shift change');
    if (reason) {
      setPausedWorkOrders(prev => new Map(prev.set(workOrderId, reason)));
      alert(`⏸️ Work Order ${workOrderId} Paused\n\nReason: ${reason}\n\n⏰ Timer stopped\n📊 Progress saved\n👤 Supervisor notified\n\n(Mock functionality)`);
    }
  };

  const handleResumeWork = (workOrderId: string) => {
    setPausedWorkOrders(prev => {
      const newMap = new Map(prev);
      newMap.delete(workOrderId);
      return newMap;
    });
    alert(`▶️ Work Order ${workOrderId} Resumed\n\n⏰ Timer restarted\n📊 Progress tracking active\n🔄 Production continues\n\n(Mock functionality)`);
  };

  // Check if work order is paused
  const isWorkOrderPaused = (workOrderId: string) => {
    return pausedWorkOrders.has(workOrderId);
  };

  // Get pause reason
  const getPauseReason = (workOrderId: string) => {
    return pausedWorkOrders.get(workOrderId) || '';
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
                    className={`ds-card ${getWOStatusClass(workOrder)} ${isExpanded(workOrder.id) ? 'ds-card-expanded' : ''} ${(workOrder.status === 'pending' || workOrder.status === 'in_progress') ? 'ds-card-with-actions' : ''}`}
                    onClick={() => toggleDetails(workOrder.id)}
                  >
                    {/* Work Order Header */}
                    <div className="ds-card-header" title={`${workOrder.id} (${workOrder.salesOrderId}) - ${workOrder.product} - Batch ${workOrder.batchNumber}`}>
                      <span>{workOrder.id} ({workOrder.salesOrderId}) — </span>
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

                    {/* Surface Action Buttons */}
                    {(workOrder.status === 'pending' || workOrder.status === 'in_progress') && (
                      <div className="ds-card-actions" onClick={(e) => e.stopPropagation()}>
                        {workOrder.status === 'pending' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={(e) => { e.stopPropagation(); handleStartWork(workOrder.id); }}
                          >
                            ▶️ Start Work
                          </button>
                        )}
                        
                        {workOrder.status === 'in_progress' && !isWorkOrderPaused(workOrder.id) && (
                          <>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={(e) => { e.stopPropagation(); handleQuantityUpdate(workOrder.id); }}
                            >
                              📊 Update
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={(e) => { e.stopPropagation(); handlePauseWork(workOrder.id); }}
                            >
                              ⏸️ Pause
                            </button>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={(e) => { e.stopPropagation(); handleMarkComplete(workOrder.id); }}
                            >
                              ✅ Complete
                            </button>
                          </>
                        )}
                        
                        {workOrder.status === 'in_progress' && isWorkOrderPaused(workOrder.id) && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={(e) => { e.stopPropagation(); handleResumeWork(workOrder.id); }}
                          >
                            ▶️ Resume
                          </button>
                        )}
                      </div>
                    )}

                    {/* Expand Indicator */}
                    <div className="ds-card-expand-indicator">
                      {isExpanded(workOrder.id) ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Professional Expanded Content - Following LeadManagement Pattern */}
                  {isExpanded(workOrder.id) && (
                    <div className={styles.expandedSection}>
                      
                      {/* SECTION 1: Work Order & Production Details (Highest Priority) */}
                      <div className={styles.productionDetailsSection}>
                        <div className={styles.sectionHeader}>
                          <h4 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🏢</span>
                            Work Order & Production Details
                          </h4>
                        </div>
                        <div className={styles.productionDetailsGrid}>
                          <div className={styles.detailCard}>
                            <p><strong>Work Order ID:</strong> {workOrder.id}</p>
                            <p><strong>Product:</strong> {workOrder.product}</p>
                            <p><strong>Batch Number:</strong> {workOrder.batchNumber}</p>
                            <p><strong>Priority:</strong> {workOrder.priority}</p>
                          </div>
                          <div className={styles.detailCard}>
                            <p><strong>Target Quantity:</strong> {workOrder.targetQuantity}</p>
                            <p><strong>Produced Quantity:</strong> {workOrder.producedQuantity}</p>
                            <p><strong>Progress:</strong> {workOrder.progress}%</p>
                            <p><strong>Status:</strong> {getWOStatusText(workOrder)}</p>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Machine & Worker Assignment */}
                      <div className={styles.assignmentSection}>
                        <div className={styles.sectionHeader}>
                          <h4 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>🔧</span>
                            Machine & Worker Assignment
                          </h4>
                        </div>
                        <div className={styles.assignmentGrid}>
                          <div className={styles.detailCard}>
                            <p><strong>Assigned Machine:</strong> {workOrder.assignedMachine || 'Not assigned'}</p>
                            <p><strong>Assigned Worker:</strong> {workOrder.assignedWorker || 'Not assigned'}</p>
                            <p><strong>Machine Status:</strong> {workOrder.assignedMachine ? 'Allocated' : 'Pending assignment'}</p>
                            <p><strong>Worker Status:</strong> {workOrder.assignedWorker ? 'Allocated' : 'Pending assignment'}</p>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: Material Allocation & Requirements */}
                      <div className={styles.materialSection}>
                        <div className={styles.sectionHeader}>
                          <h4 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📦</span>
                            Material Allocation & Requirements
                          </h4>
                        </div>
                        <div className={styles.materialGrid}>
                          <div className={styles.detailCard}>
                            <p><strong>Material Status:</strong> {getMaterialAllocationStatus(workOrder).text}</p>
                            {workOrder.materialAllocations && workOrder.materialAllocations.length > 0 ? (
                              workOrder.materialAllocations.map((allocation, index) => (
                                <div key={index} className={styles.materialItem}>
                                  <p><strong>{allocation.material}:</strong></p>
                                  <p>• Allocated: {allocation.allocatedQuantity}</p>
                                  <p>• Consumed: {allocation.consumedQuantity}</p>
                                  <p>• Remaining: {allocation.remainingQuantity}</p>
                                </div>
                              ))
                            ) : (
                              <p>No material allocations defined</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: Progress & Timeline Information */}
                      <div className={styles.progressSection}>
                        <div className={styles.sectionHeader}>
                          <h4 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>📈</span>
                            Progress & Timeline Information
                          </h4>
                        </div>
                        <div className={styles.progressGrid}>
                          <div className={styles.detailCard}>
                            <p><strong>Start Time:</strong> {workOrder.startTime || 'Not started'}</p>
                            <p><strong>Target Date:</strong> {workOrder.estimatedCompletion || 'TBD'}</p>
                            <p><strong>Current Progress:</strong> {workOrder.progress}% ({workOrder.producedQuantity} / {workOrder.targetQuantity})</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* SECTION 5: Actions */}
                      {(workOrder.status === 'pending' || workOrder.status === 'in_progress') && (
                        <div className={styles.actionsSection}>
                          <div className={styles.sectionHeader}>
                            <h4 className={styles.sectionTitle}>
                              <span className={styles.sectionIcon}>⚙️</span>
                              Assignment Controls
                            </h4>
                          </div>
                          <div className={styles.assignmentControls}>
                            {/* Machine Assignment Controls */}
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
                        
                          </div>
                        </div>
                      )}

                      {/* SECTION 6: Status History */}
                      {workOrder.statusHistory && workOrder.statusHistory.length > 0 && (
                        <div className={styles.statusSection}>
                          <div className={styles.sectionHeader}>
                            <h4 className={styles.sectionTitle}>
                              <span className={styles.sectionIcon}>📋</span>
                              Status History
                            </h4>
                          </div>
                          <div className={styles.statusGrid}>
                            <div className={styles.detailCard}>
                              {/* Pause Status Display - Information Only */}
                              {isWorkOrderPaused(workOrder.id) && (
                                <div className={styles.pauseStatus}>
                                  <div className={styles.pauseIndicator}>
                                    ⏸️ Work Order Paused
                                  </div>
                                  <div className={styles.pauseReason}>
                                    Reason: {getPauseReason(workOrder.id)}
                                  </div>
                                </div>
                              )}
                              <p><strong>📊 Current Progress:</strong> {workOrder.producedQuantity} / {workOrder.targetQuantity} ({workOrder.progress}%)</p>
                            </div>
                          </div>
                        </div>
                      )}
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