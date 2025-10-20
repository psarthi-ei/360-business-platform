import React, { useMemo } from 'react';
import { mockGoodsReceiptNotes, GoodsReceiptNote } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './GoodsReceiptNotes.module.css';

interface GoodsReceiptNotesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const GoodsReceiptNotes = ({ 
  filterState, 
  onFilterChange 
}: GoodsReceiptNotesProps) => {
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter GRNs based on filter state
  const filteredGRNs = useMemo(() => {
    if (filterState === 'all') return mockGoodsReceiptNotes;
    return mockGoodsReceiptNotes.filter(grn => grn.qualityStatus === filterState);
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (grnId: string) => {
    toggleExpansion(grnId, 'data-grn-id');
  };
  
  // Mock action handlers
  const handleGRNAction = (action: string, grnId: string) => {
    alert(`${action} action for GRN ${grnId} - Mock functionality`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get status icon and styling
  const getStatusInfo = (qualityStatus: string) => {
    switch (qualityStatus) {
      case 'approved':
        return { icon: '✅', label: 'Quality Approved', qualityLabel: 'Good' };
      case 'pending':
        return { icon: '⏳', label: 'Pending QC', qualityLabel: 'Under Review' };
      case 'rejected':
        return { icon: '❌', label: 'Quality Rejected', qualityLabel: 'Failed' };
      default:
        return { icon: '📦', label: 'Unknown', qualityLabel: 'Unknown' };
    }
  };

  // Get delivery status for meta line
  const getDeliveryStatus = (grn: GoodsReceiptNote) => {
    const shortfall = grn.orderedQuantity - grn.receivedQuantity;
    if (shortfall > 0) {
      return `Short delivery: ${shortfall}${grn.unit} missing`;
    } else if (shortfall < 0) {
      return `Over delivery: +${Math.abs(shortfall)}${grn.unit}`;
    }
    return 'Complete delivery';
  };

  // Calculate pending quality inspections for alert header
  const pendingQCCount = filteredGRNs.filter(grn => grn.qualityStatus === 'pending').length;

  return (
    <div className={styles.goodsReceiptNotesScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when pending QC exists */}
        {pendingQCCount > 0 && (
          <div className={styles.alertHeader}>
            📦 {pendingQCCount} DELIVERIES PENDING QUALITY INSPECTION
          </div>
        )}

        <div className={styles.grnContainer}>
          {filteredGRNs.map(grn => {
            const statusInfo = getStatusInfo(grn.qualityStatus);
            const deliveryStatus = getDeliveryStatus(grn);

            return (
              <div key={grn.id} className="ds-card-container" data-grn-id={grn.id}>
                {/* Clickable Card Summary - 140px Template */}
                <div 
                  className={`ds-card ${grn.qualityStatus === 'approved' ? 'ds-card-status-active' : grn.qualityStatus === 'pending' ? 'ds-card-status-pending' : 'ds-card-status-inactive'} ${isExpanded(grn.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(grn.id)}
                >
                  {/* Template Header - GRN# + Material Format */}
                  <div 
                    className="ds-card-header"
                    title={`${grn.materialName} (GRN ID: ${grn.id}) - PO: ${grn.poId}`}
                  >
                    GRN#{grn.id.replace('GRN-', '')} — {grn.materialName}
                  </div>
                  
                  {/* Template Status - Quality status + PO reference */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label} • PO#{grn.poId.replace('PO-', '')}
                  </div>
                  
                  {/* Template Meta - Receipt date + quantity + delivery status */}
                  <div 
                    className="ds-card-meta"
                    title={`Received: ${formatDate(grn.receiptDate)} • Quality: ${statusInfo.qualityLabel} • ${deliveryStatus}`}
                  >
                    Received: {formatDate(grn.receiptDate)} • {grn.receivedQuantity}{grn.unit}<br />
                    Quality: {statusInfo.qualityLabel} • {deliveryStatus}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(grn.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Quality Inspection Context */}
                {isExpanded(grn.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📦 Goods Receipt Note Details</h4>
                      
                      <p><strong>Material Receipt:</strong> {grn.receivedQuantity}{grn.unit} of {grn.orderedQuantity}{grn.unit} ordered ({((grn.receivedQuantity / grn.orderedQuantity) * 100).toFixed(1)}% of order)</p>
                      <p><strong>Quality Status:</strong> {statusInfo.qualityLabel} • {grn.inspectedBy ? `Inspected by ${grn.inspectedBy}` : 'Awaiting inspection'}</p>
                      <p><strong>Receipt Details:</strong> Received on {formatDate(grn.receiptDate)} by {grn.receivedBy}</p>
                      <p><strong>Purchase Order:</strong> {grn.poId} • Material procurement record</p>
                      {grn.inspectionDate && <p><strong>Inspection Date:</strong> {formatDate(grn.inspectionDate)}</p>}
                      {grn.notes && <p><strong>Quality Notes:</strong> {grn.notes}</p>}
                    </div>
                    
                    {/* Status-based action buttons - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {grn.qualityStatus === 'pending' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleGRNAction('approve-quality', grn.id)}
                            >
                              ✅ Approve Quality
                            </button>
                            <button 
                              className="ds-btn ds-btn-danger"
                              onClick={() => handleGRNAction('reject-material', grn.id)}
                            >
                              ❌ Reject Material
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleGRNAction('update-notes', grn.id)}
                            >
                              📝 Update Notes
                            </button>
                          </>
                        )}
                        {grn.qualityStatus === 'approved' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleGRNAction('update-stock', grn.id)}
                            >
                              📦 Update Stock
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleGRNAction('print-grn', grn.id)}
                            >
                              🖨️ Print GRN
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleGRNAction('view-batch', grn.id)}
                            >
                              📋 View Batch
                            </button>
                          </>
                        )}
                        {grn.qualityStatus === 'rejected' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handleGRNAction('return-supplier', grn.id)}
                            >
                              📤 Return to Supplier
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handleGRNAction('view-rejection', grn.id)}
                            >
                              📄 View Rejection
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiptNotes;