import React, { useMemo, useState } from 'react';
import { mockWorkOrders, mockQCItems, WorkOrder, QualityControlItem } from '../../data/productionMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import ModalPortal from '../ui/ModalPortal';
import styles from './QualityControlManagement.module.css';

interface QualityControlManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}


const QualityControlManagement = ({ 
  mobile, 
  onShowCustomerProfile, 
  filterState, 
  onFilterChange,
  openAddModal,
  onAddModalHandled
}: QualityControlManagementProps) => {
  const { toggleExpansion, isExpanded } = useCardExpansion();
  const [activeQCForm, setActiveQCForm] = useState<string | null>(null);

  // Universal QC Logic: Display ALL work orders requiring QC inspection
  const qcWorkOrders = useMemo(() => {
    const qcEligibleWOs: WorkOrder[] = mockWorkOrders.filter(wo => 
      wo.status === 'completed' || 
      wo.status === 'ready_qc' ||
      wo.status === 'qc_approved' ||
      wo.status === 'qc_rejected' ||
      wo.status === 'delivered' ||
      wo.status === 'dispatched' ||
      wo.status === 'ready_for_delivery' ||
      wo.status === 'rework_required'
    );
    return qcEligibleWOs.map(wo => ({
      workOrder: wo,
      qcItem: mockQCItems.find(qc => qc.workOrderId === wo.id)
    }));
  }, []);

  // Filter QC work orders based on QC status
  const filteredQCWorkOrders = useMemo(() => {
    // Show all QC work orders when filter is 'all' for comprehensive visibility
    if (filterState === 'all') {
      return qcWorkOrders;
    }
    
    switch (filterState) {
      case 'pending_inspection': 
        return qcWorkOrders.filter(({ qcItem }) => 
          !qcItem || qcItem.status === 'pending_inspection'
        );
      case 'in_progress': 
        return qcWorkOrders.filter(({ qcItem }) => 
          qcItem?.status === 'in_progress'
        );
      case 'approved': 
        return qcWorkOrders.filter(({ qcItem }) => 
          qcItem?.status === 'approved'
        );
      case 'rejected': 
        return qcWorkOrders.filter(({ qcItem }) => 
          qcItem?.status === 'rejected'
        );
      default: 
        return qcWorkOrders; // Default to showing all QC work orders
    }
  }, [qcWorkOrders, filterState]);

  // Toggle card details
  const toggleDetails = (workOrderId: string) => {
    toggleExpansion(workOrderId, 'data-card-id');
  };

  // QC Status mapping functions - returns global status classes
  const getQCStatusClass = (qcItem?: QualityControlItem) => {
    if (!qcItem) return 'ds-card-status-pending';
    switch(qcItem.status) {
      case 'approved': return 'ds-card-status-active';
      case 'in_progress': return 'ds-card-status-pending';
      case 'rejected': return 'ds-card-status-inactive';
      case 'pending_inspection': return 'ds-card-priority-high';
      default: return 'ds-card-status-pending';
    }
  };

  const getQCStatusIcon = (qcItem?: QualityControlItem) => {
    if (!qcItem) return '⏳';
    switch(qcItem.status) {
      case 'approved': return '✅';
      case 'in_progress': return '🔄';
      case 'rejected': return '❌';
      case 'pending_inspection': return '⏳';
      default: return '⏳';
    }
  };

  const getQCStatusText = (qcItem?: QualityControlItem) => {
    if (!qcItem) return 'Pending QC';
    switch(qcItem.status) {
      case 'approved': return 'QC Approved';
      case 'in_progress': return 'QC In Progress';
      case 'rejected': return 'QC Rejected';
      case 'pending_inspection': return 'Pending QC';
      default: return 'Pending QC';
    }
  };

  const getQCPriorityText = (qcItem?: QualityControlItem) => {
    if (!qcItem) return '';
    switch(qcItem.priority) {
      case 'urgent': return 'Urgent Priority';
      case 'high': return 'High Priority';
      case 'normal': return '';
      default: return '';
    }
  };

  // QC Workflow Functions
  const startQC = (workOrderId: string) => {
    setActiveQCForm(workOrderId);
  };

  const completeQC = (workOrderId: string, result: { grade: string; notes: string }) => {
    setActiveQCForm(null);
    // Handle QC completion logic here
  };

  const closeQCForm = () => {
    setActiveQCForm(null);
  };

  // Get action button text based on QC status (null = no action button needed)
  const getActionButtonText = (qcItem?: QualityControlItem) => {
    if (!qcItem || qcItem.status === 'pending_inspection') return 'Start QC';
    if (qcItem.status === 'in_progress') return 'Continue QC';
    // Completed QC (approved/rejected) - no action needed, expanded view shows report
    if (qcItem.status === 'approved' || qcItem.status === 'rejected') return null;
    return 'Start QC';
  };

  // Check if QC item needs action button
  const hasActionButton = (qcItem?: QualityControlItem) => {
    return getActionButtonText(qcItem) !== null;
  };

  // Handle QC action
  const handleQCAction = (action: string, workOrderId: string) => {
    startQC(workOrderId);
  };

  // Render QC specifications for expanded view (before QC)
  const renderQCSpecifications = (qcItem?: QualityControlItem) => {
    if (!qcItem || !qcItem.qualitySpecs) return null;

    return (
      <>
        {/* Quality Specifications Section */}
        <div className={styles.expandedSection}>
          <h3 className={styles.sectionHeader}>🎯 Quality Specifications</h3>
          <div className={styles.professionalDetailsGrid}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Target Grade</div>
              <div className={styles.detailValue}>{qcItem.qualitySpecs.targetGrade}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Color Code</div>
              <div className={styles.detailValue}>{qcItem.qualitySpecs.colorCode}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>GSM Target</div>
              <div className={styles.detailValue}>{qcItem.qualitySpecs.gsmTarget}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Width Target</div>
              <div className={styles.detailValue}>{qcItem.qualitySpecs.widthTarget}</div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Shrinkage Limit</div>
              <div className={styles.detailValue}>{qcItem.qualitySpecs.shrinkageLimit}</div>
            </div>
          </div>
        </div>

        {/* QC Checklist Preview Section */}
        {qcItem.checklist && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>📋 QC Checklist Preview</h3>
            <div className={styles.checklistPreview}>
              {qcItem.checklist.map((item, index) => (
                <div key={index} className={styles.checklistPreviewItem}>
                  <span>□</span>
                  <span>{item.item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batch Information Section */}
        {qcItem.batchInfo && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>📦 Batch Information</h3>
            <div className={styles.professionalDetailsGrid}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Batch Number</div>
                <div className={styles.detailValue}>{qcItem.batchInfo.batchNumber}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Raw Material</div>
                <div className={styles.detailValue}>{qcItem.batchInfo.rawMaterial}</div>
              </div>
              {qcItem.batchInfo.dyeLot && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Dye Lot</div>
                  <div className={styles.detailValue}>{qcItem.batchInfo.dyeLot}</div>
                </div>
              )}
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Production Dates</div>
                <div className={styles.detailValue}>{qcItem.batchInfo.productionDates}</div>
              </div>
            </div>
          </div>
        )}

        {/* Special Instructions Section */}
        {qcItem.specialInstructions && qcItem.specialInstructions.length > 0 && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>⚠️ Special Instructions</h3>
            <div className={styles.professionalNotes}>
              {qcItem.specialInstructions.map((instruction, index) => (
                <div key={index} className={styles.notesContent}>
                  • {instruction}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QC Actions Section */}
        <div className={styles.expandedSection}>
          <div className={styles.professionalActions}>
            <button 
              className="ds-btn ds-btn-primary"
              onClick={() => handleQCAction('start', qcItem.workOrderId)}
            >
              Start QC Inspection
            </button>
          </div>
        </div>
      </>
    );
  };

  // Render QC results for expanded view (after QC)
  const renderQCResults = (qcItem?: QualityControlItem) => {
    if (!qcItem || qcItem.status === 'pending_inspection') return null;

    return (
      <>
        {/* QC Results Section */}
        <div className={styles.expandedSection}>
          <h3 className={styles.sectionHeader}>✅ QC Results</h3>
          <div className={styles.professionalDetailsGrid}>
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Grade</div>
              <div className={`${styles.detailValue} ${styles.statusValue}`}>{qcItem.grade || 'Pending'}</div>
            </div>
            {qcItem.inspector && (
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Inspector</div>
                <div className={styles.detailValue}>{qcItem.inspector}</div>
              </div>
            )}
            {qcItem.completedTime && (
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Completed</div>
                <div className={styles.detailValue}>{qcItem.completedTime}</div>
              </div>
            )}
            {qcItem.startedTime && qcItem.completedTime && (
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Duration</div>
                <div className={styles.detailValue}>1 hour 15 minutes</div>
              </div>
            )}
          </div>
        </div>

        {/* QC Timeline Section */}
        {qcItem.startedTime && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>🔄 QC Timeline</h3>
            <div className={styles.professionalTimeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineLabel}>Started</div>
                <div className={styles.timelineValue}>{qcItem.startedTime}</div>
              </div>
              {qcItem.completedTime && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineLabel}>Completed</div>
                  <div className={styles.timelineValue}>{qcItem.completedTime}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quality Checklist Results Section */}
        {qcItem.checklist && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>✅ Quality Checklist Results</h3>
            <div className={styles.checklistResults}>
              {qcItem.checklist.map((item, index) => (
                <div key={index} className={`${styles.checklistResultItem} ${item.checked ? 'passed' : 'failed'}`}>
                  <span>{item.checked ? '☑️' : '☐'}</span>
                  <span>{item.item}</span>
                </div>
              ))}
              <div className={styles.checklistScore}>
                Score: {qcItem.checklist.filter(item => item.checked).length}/{qcItem.checklist.length} passed
              </div>
            </div>
          </div>
        )}

        {/* QC Notes Section */}
        {qcItem.notes && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>📝 QC Notes</h3>
            <div className={styles.professionalNotes}>
              <div className={styles.notesContent}>"{qcItem.notes}"</div>
            </div>
          </div>
        )}

        {/* Quality Evidence Section */}
        {qcItem.photos && qcItem.photos.length > 0 && (
          <div className={styles.expandedSection}>
            <h3 className={styles.sectionHeader}>📷 Quality Evidence</h3>
            <div className={styles.professionalDetailsGrid}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Photos Captured</div>
                <div className={styles.detailValue}>{qcItem.photos.length} photos</div>
              </div>
            </div>
          </div>
        )}

        {/* QC Actions Section */}
        <div className={styles.expandedSection}>
          <div className={styles.professionalActions}>
            <button className="ds-btn ds-btn-secondary">
              📝 View QC Report
            </button>
            <button className="ds-btn ds-btn-outline">
              📷 View Evidence
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.qcManagementScreen}>
      <div className={styles.pageContent}>
        <div className={styles.qcContainer}>
          {filteredQCWorkOrders.map(({ workOrder, qcItem }) => (
            <div key={workOrder.id} className="ds-card-container" data-card-id={workOrder.id}>
              <div 
                className={`ds-card ${hasActionButton(qcItem) ? 'ds-card-with-actions' : ''} ${getQCStatusClass(qcItem)} ${isExpanded(workOrder.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(workOrder.id)}
              >
                {/* Card Header - Work Order context */}
                <div className="ds-card-header" title={`${workOrder.id} - ${workOrder.customer} | ${workOrder.assignedMachine}`}>
                  {workOrder.id} — {workOrder.customer} | {workOrder.assignedMachine}
                </div>

                {/* Card Status - QC status + priority */}
                <div className="ds-card-status">
                  {getQCStatusIcon(qcItem)} {getQCStatusText(qcItem)}{getQCPriorityText(qcItem) && ` • ${getQCPriorityText(qcItem)}`}
                </div>

                {/* Card Meta - quantity + product + completion timing */}
                <div className="ds-card-meta" title={`${workOrder.producedQuantity} ${workOrder.product} • Completed: ${workOrder.actualCompletion || 'In Progress'}`}>
                  {workOrder.producedQuantity} • {workOrder.product}<br />
                  Completed: {workOrder.actualCompletion || 'In Progress'}
                </div>

                {/* Card Actions - Surface level QC action (only for pending/in-progress) */}
                {hasActionButton(qcItem) && (
                  <div className="ds-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="ds-btn ds-btn-primary"
                      onClick={() => handleQCAction('start', workOrder.id)}
                      disabled={qcItem?.status === 'in_progress'}
                    >
                      {getActionButtonText(qcItem)}
                    </button>
                  </div>
                )}

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {isExpanded(workOrder.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded(workOrder.id) && (
                <div className="ds-expanded-details">
                  <div className="ds-details-content">
                    {qcItem?.status === 'pending_inspection' || !qcItem 
                      ? renderQCSpecifications(qcItem)
                      : renderQCResults(qcItem)
                    }
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* QC Form Modal - 4-Section Visual Design Spec Layout */}
        <ModalPortal isOpen={!!activeQCForm} onBackdropClick={closeQCForm}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>QC Inspection — {activeQCForm}</h3>
                <button className={styles.closeButton} onClick={closeQCForm}>×</button>
              </div>
              <div className={styles.modalBody}>
                {/* Section 1: Quality Checklist (32px items) */}
                <div className={styles.qcSection}>
                  <h4>✅ QUALITY CHECKLIST</h4>
                  <div className={styles.checklistGrid}>
                    <label className={styles.checklistItem}>
                      <input type="checkbox" defaultChecked />
                      <span>Color match verification</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input type="checkbox" defaultChecked />
                      <span>GSM weight check</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input type="checkbox" defaultChecked />
                      <span>Width measurement</span>
                    </label>
                    <label className={styles.checklistItem}>
                      <input type="checkbox" />
                      <span>Surface defect inspection</span>
                    </label>
                  </div>
                </div>

                {/* Section 2: Photo Evidence (44px button) */}
                <div className={styles.qcSection}>
                  <h4>📷 PHOTO EVIDENCE</h4>
                  <button className={styles.photoButton}>
                    📷 Capture Quality Photos
                  </button>
                </div>

                {/* Section 3: QC Remarks (60px textarea) */}
                <div className={styles.qcSection}>
                  <h4>📝 QC REMARKS</h4>
                  <textarea 
                    className={styles.remarksTextarea}
                    placeholder="Enter inspection notes and observations..."
                    rows={3}
                  />
                </div>

                {/* Section 4: QC Result (56px buttons) */}
                <div className={styles.qcSection}>
                  <h4>🎯 QC RESULT</h4>
                  <div className={styles.gradeSelection}>
                    <label>Grade:</label>
                    <select className={styles.gradeSelect}>
                      <option value="A Grade">A Grade</option>
                      <option value="B Grade">B Grade</option>
                      <option value="C Grade">C Grade</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                  <div className={styles.resultButtons}>
                    <button 
                      className="ds-btn ds-btn-primary"
                      onClick={() => activeQCForm && completeQC(activeQCForm, { grade: 'A Grade', notes: 'QC Passed' })}
                    >
                      ✅ Pass
                    </button>
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={() => activeQCForm && completeQC(activeQCForm, { grade: 'Reject', notes: 'Requires Rework' })}
                    >
                      ⚠️ Rework
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </ModalPortal>
      </div>
    </div>
  );
};

export default QualityControlManagement;