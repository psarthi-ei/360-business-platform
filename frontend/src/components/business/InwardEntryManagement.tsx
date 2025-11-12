import React, { useMemo } from 'react';
import { getUnifiedInwardEntries, filterUnifiedInwardEntries, UnifiedInwardEntry } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './InwardEntryManagement.module.css';

interface InwardEntryManagementProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const InwardEntryManagement = ({ 
  filterState, 
  onFilterChange 
}: InwardEntryManagementProps) => {
  
  // Use terminology hook for local terminology
  const { customer: party, orders: jobOrders, goodsReceiptNote } = useTerminologyTerms();
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Get unified entries (both GRN and Inward) and filter them
  const filteredEntries = useMemo(() => {
    const allUnifiedEntries = getUnifiedInwardEntries();
    return filterUnifiedInwardEntries(allUnifiedEntries, filterState);
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (entryId: string) => {
    toggleExpansion(entryId, 'data-unified-entry-id');
  };
  
  // Action handlers for Inward entries (customer materials)
  const handleInwardAction = (action: string, entryId: string) => {
    if (action === 'inspect') {
      alert(`Quality inspection for Inward Entry ${entryId} - Functionality coming soon!`);
    } else if (action === 'approve') {
      alert(`Approve material for Inward Entry ${entryId} - Functionality coming soon!`);
    } else if (action === 'update-stock') {
      alert(`Update stock for Inward Entry ${entryId} - Functionality coming soon!`);
    } else {
      alert(`${action} action for Inward Entry ${entryId} - Mock functionality`);
    }
  };

  // Action handlers for GRN entries (supplier materials)
  const handleGRNAction = (action: string, entryId: string) => {
    if (action === 'approve-quality') {
      alert(`Approve quality for ${goodsReceiptNote} ${entryId} - Functionality coming soon!`);
    } else if (action === 'reject-material') {
      alert(`Reject material for ${goodsReceiptNote} ${entryId} - Functionality coming soon!`);
    } else if (action === 'update-stock') {
      alert(`Update stock for ${goodsReceiptNote} ${entryId} - Functionality coming soon!`);
    } else {
      alert(`${action} action for ${goodsReceiptNote} ${entryId} - Mock functionality`);
    }
  };

  const handleViewJobOrder = (jobOrderId: string) => {
    alert(`🔍 Navigate to ${jobOrders.slice(0, -1)} ${jobOrderId} - Functionality coming soon!`);
  };

  const handleViewPO = (poId: string) => {
    alert(`🔍 Navigate to Purchase Order ${poId} - Functionality coming soon!`);
  };

  const handlePrintGRN = (grnId: string) => {
    alert(`🖨️ Print ${goodsReceiptNote} ${grnId} - Functionality coming soon!`);
  };

  const handlePrintInward = (inwardId: string) => {
    alert(`🖨️ Print Inward Receipt ${inwardId} - Functionality coming soon!`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get status info based on entry type and quality status
  const getStatusInfo = (entry: UnifiedInwardEntry) => {
    switch (entry.qualityStatus) {
      case 'approved':
        return { 
          icon: '✅', 
          label: entry.entryType === 'grn' ? 'Quality Approved' : 'Material Approved', 
          className: 'approved' 
        };
      case 'pending':
        return { 
          icon: '⏳', 
          label: entry.entryType === 'grn' ? 'Pending QC' : 'Pending Inspection', 
          className: 'pending' 
        };
      case 'rejected':
        return { 
          icon: '❌', 
          label: entry.entryType === 'grn' ? 'Quality Rejected' : 'Material Rejected', 
          className: 'rejected' 
        };
      default:
        return { icon: '📦', label: 'Under Review', className: 'pending' };
    }
  };

  return (
    <>
      {/* Alert Header - Brief Status Summary */}
      {filteredEntries.length === 0 && (
        <div className="ds-alert ds-alert-info">
          <span className="ds-alert-icon">📦</span>
          <span>No entries match the current filter. Change filter to see more entries.</span>
        </div>
      )}

      <div className={styles.inwardContainer}>
        {filteredEntries.map(entry => {
          const statusInfo = getStatusInfo(entry);
          const isGRN = entry.entryType === 'grn';
          
          return (
            <div key={entry.id} className="ds-card-container" data-unified-entry-id={entry.id}>
              {/* Standard DS Card Structure */}
              <div 
                className={`ds-card ${statusInfo.className === 'approved' ? 'ds-card-status-active' : statusInfo.className === 'urgent' ? 'ds-card-status-urgent' : 'ds-card-status-pending'} ${isExpanded(entry.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(entry.id)}
              >
                {/* Header */}
                <div 
                  className="ds-card-header"
                  title={isGRN ? 
                    `${entry.materialName} from ${entry.supplierName} - Company Supply Material` :
                    `${entry.materialName} from ${party} ${entry.customerName}`
                  }
                >
                  {isGRN ? '📋' : '📦'} {entry.materialName} — {isGRN ? entry.supplierName : entry.customerName}
                </div>
                
                {/* Status */}
                <div className="ds-card-status">
                  {statusInfo.icon} {statusInfo.label}
                </div>
                
                {/* Meta - Different context for GRN vs Inward */}
                <div 
                  className="ds-card-meta"
                  title={isGRN ?
                    `Company Supply Material: ${entry.receivedQuantity}${entry.unit} • Value: ${entry.materialValue ? `₹${entry.materialValue.toLocaleString()}` : 'TBD'} • PO: ${entry.poId}` :
                    `${party} Material: ${entry.receivedQuantity}${entry.unit} • Challan: ${entry.challanNumber}`
                  }
                >
                  {isGRN ? (
                    <>
                      {entry.materialValue ? `₹${entry.materialValue.toLocaleString()}` : 'Value TBD'} • {entry.receivedQuantity}{entry.unit}<br />
                      Company Supply • PO: {entry.poId}
                    </>
                  ) : (
                    <>
                      Qty: {entry.receivedQuantity}{entry.unit} • Received: {formatDate(entry.receiptDate)}<br />
                      {entry.challanNumber ? `Challan: ${entry.challanNumber}` : `${jobOrders.slice(0, -1)}: ${entry.jobOrderId}`} • {party}: {entry.customerName}
                    </>
                  )}
                </div>

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {isExpanded(entry.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Expanded Details - DS Standard Structure */}
              {isExpanded(entry.id) && (
                <div className={styles.expandedSection}>
                  {/* SECTION 1: Material Information */}
                  <div className={styles.materialInfoSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>{isGRN ? '📋' : '📦'}</span>
                        Material Information
                      </h4>
                    </div>
                    <div className={styles.materialInfoGrid}>
                      <div className={styles.detailCard}>
                        <p><strong>Material Name:</strong> {entry.materialName}</p>
                        <p><strong>Received Quantity:</strong> {entry.receivedQuantity} {entry.unit}</p>
                        {isGRN && entry.orderedQuantity && <p><strong>Ordered Quantity:</strong> {entry.orderedQuantity} {entry.unit}</p>}
                        {isGRN && entry.materialValue && <p><strong>Material Value:</strong> ₹{entry.materialValue.toLocaleString()}</p>}
                        {!isGRN && entry.challanNumber && <p><strong>Challan Number:</strong> {entry.challanNumber}</p>}
                      </div>
                      <div className={styles.detailCard}>
                        <p><strong>Received Date:</strong> {formatDate(entry.receiptDate)}</p>
                        <p><strong>Received By:</strong> {entry.receivedBy}</p>
                        <p><strong>Entry Type:</strong> {isGRN ? 'Supplier Material (GRN)' : 'Customer Material (Inward)'}</p>
                        <p><strong>Status:</strong> {statusInfo.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Business Context */}
                  <div className={styles.businessContextSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>{isGRN ? '🏭' : '👥'}</span>
                        {isGRN ? 'Company Supply Information' : `${party} Information`}
                      </h4>
                    </div>
                    <div className={styles.businessContextGrid}>
                      <div className={styles.detailCard}>
                        {isGRN ? (
                          <>
                            <p><strong>Supplier:</strong> {entry.supplierName}</p>
                            <p><strong>Purchase Order:</strong> {entry.poId}</p>
                            <p><strong>Supply Type:</strong> Company Materials</p>
                            <p><strong>Procurement Context:</strong> General Inventory</p>
                          </>
                        ) : (
                          <>
                            <p><strong>{party} Name:</strong> {entry.customerName}</p>
                            {entry.customerId && <p><strong>{party} ID:</strong> {entry.customerId}</p>}
                            {entry.jobOrderId && <p><strong>{jobOrders.slice(0, -1)} ID:</strong> {entry.jobOrderId}</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Quality Information */}
                  {(entry.inspectionDate || entry.qualityAssessment) && (
                    <div className={styles.qualityInfoSection}>
                      <div className={styles.sectionHeader}>
                        <h4 className={styles.sectionTitle}>
                          <span className={styles.sectionIcon}>🔍</span>
                          Quality Information
                        </h4>
                      </div>
                      <div className={styles.qualityInfoGrid}>
                        <div className={styles.detailCard}>
                          {entry.inspectionDate && <p><strong>Inspection Date:</strong> {formatDate(entry.inspectionDate)}</p>}
                          {entry.inspectedBy && <p><strong>Inspected By:</strong> {entry.inspectedBy}</p>}
                          {isGRN && entry.qualityDeadline && <p><strong>QC Deadline:</strong> {formatDate(entry.qualityDeadline)}</p>}
                          {!isGRN && entry.qualityAssessment && <p><strong>Assessment:</strong> {entry.qualityAssessment}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes Section */}
                  {entry.notes && (
                    <div className={styles.detailCard} style={{ marginTop: 'var(--ds-space-md)' }}>
                      <p><strong>📝 Notes:</strong> {entry.notes}</p>
                    </div>
                  )}
                  
                  {/* Action Bar */}
                  <div className={styles.expandedActions}>
                    {/* Universal Navigation Actions */}
                    {isGRN ? (
                      <button 
                        className="ds-btn ds-btn-secondary"
                        onClick={() => handleViewPO(entry.poId!)}
                      >
                        📋 View PO
                      </button>
                    ) : (
                      <button 
                        className="ds-btn ds-btn-secondary"
                        onClick={() => handleViewJobOrder(entry.jobOrderId!)}
                      >
                        🔍 View {jobOrders.slice(0, -1)}
                      </button>
                    )}
                    
                    {/* GRN Specific Actions */}
                    {isGRN && (
                      <>
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handlePrintGRN(entry.id)}
                        >
                          🖨️ Print {goodsReceiptNote}
                        </button>
                        
                        {entry.qualityStatus === 'pending' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleGRNAction('approve-quality', entry.id)}
                            >
                              ✅ Approve Quality
                            </button>
                            <button 
                              className="ds-btn ds-btn-danger"
                              onClick={() => handleGRNAction('reject-material', entry.id)}
                            >
                              ❌ Reject Material
                            </button>
                          </>
                        )}
                        
                        {entry.qualityStatus === 'approved' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handleGRNAction('update-stock', entry.id)}
                          >
                            📦 Update Stock
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Inward Specific Actions */}
                    {!isGRN && (
                      <>
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handlePrintInward(entry.id)}
                        >
                          🖨️ Print Inward
                        </button>
                        
                        {entry.qualityStatus === 'pending' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handleInwardAction('inspect', entry.id)}
                          >
                            🔍 Inspect Quality
                          </button>
                        )}
                        
                        {entry.qualityStatus !== 'rejected' && entry.inspectionDate && (
                          <button 
                            className="ds-btn ds-btn-success"
                            onClick={() => handleInwardAction('approve', entry.id)}
                          >
                            ✅ Approve Material
                          </button>
                        )}
                        
                        {entry.qualityStatus === 'approved' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handleInwardAction('update-stock', entry.id)}
                          >
                            📦 Update Stock
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InwardEntryManagement;