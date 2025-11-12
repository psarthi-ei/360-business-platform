import React, { useMemo } from 'react';
import { mockGoodsReceiptNotes, GoodsReceiptNote } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './GoodsReceiptNotes.module.css';

interface GoodsReceiptNotesProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const GoodsReceiptNotes = ({ 
  filterState, 
  onFilterChange 
}: GoodsReceiptNotesProps) => {
  
  // Use terminology hook for Surat processing terminology
  const { goodsReceiptNote, customer: party } = useTerminologyTerms();
  
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
    alert(`${action} action for ${goodsReceiptNote} ${grnId} - Mock functionality`);
  };

  // Print GRN functionality - only applicable for GRN entries
  const handlePrintGRN = (grnId: string) => {
    alert(`🖨️ Print ${goodsReceiptNote} ${grnId} - Functionality coming soon!`);
  };

  const handleViewPO = (poId: string) => {
    alert(`🔍 Navigating to Purchase Order: ${poId}`);
  };

  // Removed PR concept - no longer used in business flow
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get status icon and styling
  const getStatusInfo = (qualityStatus: string) => {
    switch (qualityStatus) {
      case 'approved':
        return { icon: '✅', label: 'Quality Approved', qualityLabel: 'Good', className: 'approved' };
      case 'pending':
        return { icon: '⏳', label: 'Pending QC', qualityLabel: 'Under Review', className: 'pending' };
      case 'rejected':
        return { icon: '❌', label: 'Quality Rejected', qualityLabel: 'Failed', className: 'rejected' };
      default:
        return { icon: '📦', label: 'Unknown', qualityLabel: 'Unknown', className: 'default' };
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

  // Get quality urgency indicators
  const getQualityUrgency = (grn: GoodsReceiptNote) => {
    const today = new Date();
    const qualityDeadline = grn.qualityDeadline ? new Date(grn.qualityDeadline) : null;
    
    if (!qualityDeadline || grn.qualityStatus !== 'pending') {
      return getStatusInfo(grn.qualityStatus);
    }
    
    const diffTime = qualityDeadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { icon: '🚨', label: `QC overdue by ${Math.abs(diffDays)} days`, className: 'urgent' };
    } else if (diffDays <= 1) {
      return { icon: '⚡', label: `QC due ${diffDays === 0 ? 'today' : 'tomorrow'}`, className: 'urgent' };
    } else if (diffDays <= 3) {
      return { icon: '⏳', label: `QC due in ${diffDays} days`, className: 'pending' };
    } else {
      return { icon: '📦', label: 'QC on schedule', className: 'pending' };
    }
  };

  // Get material value percentage of order
  const getMaterialValuePercentage = (grn: GoodsReceiptNote) => {
    if (!grn.materialValue) return 'Value TBD';
    // Mock calculation based on typical order values
    const estimatedOrderValue = grn.materialValue * 3.2; // Estimate order as 3.2x material cost
    const percentage = Math.round((grn.materialValue / estimatedOrderValue) * 100);
    return `${percentage}% of order value`;
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  // Calculate pending quality inspections for alert header
  const pendingQCCount = filteredGRNs.filter(grn => grn.qualityStatus === 'pending').length;

  return (
    <div className={styles.goodsReceiptNotesScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when pending QC exists */}
        {pendingQCCount > 0 && (
          <div className={styles.alertHeader}>
            🚨 {pendingQCCount} MATERIAL DELIVERIES NEED QUALITY INSPECTION
          </div>
        )}

        <div className={styles.grnContainer}>
          {filteredGRNs.map(grn => {
            const statusInfo = getQualityUrgency(grn);
            const deliveryStatus = getDeliveryStatus(grn);
            const materialValuePercentage = getMaterialValuePercentage(grn);

            return (
              <div key={grn.id} className="ds-card-container" data-grn-id={grn.id}>
                {/* Clickable Card Summary - Customer-Centric Format */}
                <div 
                  className={`ds-card ${grn.qualityStatus === 'approved' ? 'ds-card-status-active' : statusInfo.className === 'urgent' ? 'ds-card-status-urgent' : 'ds-card-status-pending'} ${isExpanded(grn.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(grn.id)}
                >
                  {/* Header - Customer & Material Focus */}
                  <div 
                    className="ds-card-header"
                    title={`${party} ${grn.customerName} Order ${grn.salesOrderId} - ${grn.materialName} from ${grn.supplierName}`}
                  >
                    {party} {grn.customerName} — {grn.materialName}
                  </div>
                  
                  {/* Status - Quality & Delivery Context */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                  
                  {/* Meta - Financial Priority & Business Context */}
                  <div 
                    className="ds-card-meta"
                    title={`${grn.materialValue ? formatCurrency(grn.materialValue) : 'Value TBD'} from ${grn.supplierName} • ${grn.receivedQuantity}${grn.unit} • ${materialValuePercentage}`}
                  >
                    {grn.materialValue ? formatCurrency(grn.materialValue) : 'Value TBD'} • {grn.supplierName} • {grn.receivedQuantity}{grn.unit}<br />
                    Order {grn.salesOrderId} • {deliveryStatus}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(grn.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Organized Business Context */}
                {isExpanded(grn.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📦 Goods Receipt Analysis</h4>
                      
                      {/* Section 1: Business Metrics Grid */}
                      <div className={styles.businessMetrics}>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Material Value</span>
                          <span className={styles.metricValue}>{grn.materialValue ? formatCurrency(grn.materialValue) : 'TBD'}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Delivery Rate</span>
                          <span className={styles.metricValue}>{((grn.receivedQuantity / grn.orderedQuantity) * 100).toFixed(1)}%</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Quality Status</span>
                          <span className={styles.metricValue}>{getStatusInfo(grn.qualityStatus).qualityLabel}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Material Quantity</span>
                          <span className={styles.metricValue}>{grn.receivedQuantity}{grn.unit}</span>
                        </div>
                      </div>

                      
                      {/* Section 2: Timeline & Details Context Cards */}
                      <div className={styles.contextSection}>
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>📅 Quality Timeline</div>
                          <div className={styles.contextContent}>
                            <div>Received: {formatDate(grn.receiptDate)} by {grn.receivedBy}</div>
                            {grn.qualityDeadline && <div>QC Deadline: {formatDate(grn.qualityDeadline)}</div>}
                            {grn.inspectionDate && <div>Inspected: {formatDate(grn.inspectionDate)} by {grn.inspectedBy}</div>}
                            <div>Status: {getStatusInfo(grn.qualityStatus).qualityLabel}</div>
                          </div>
                        </div>
                        
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>📊 Material Breakdown</div>
                          <div className={styles.contextContent}>
                            <div>Ordered: {grn.orderedQuantity}{grn.unit}</div>
                            <div>Received: {grn.receivedQuantity}{grn.unit}</div>
                            <div>Delivery: {deliveryStatus}</div>
                            {grn.materialValue && <div>Value: {formatCurrency(grn.materialValue)}</div>}
                          </div>
                        </div>
                        
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>🏭 Supply Chain Details</div>
                          <div className={styles.contextContent}>
                            <div>{party}: {grn.customerName}</div>
                            <div>Supplier: {grn.supplierName}</div>
                            <div>Material: {grn.materialName}</div>
                            <div>Order: {grn.salesOrderId}</div>
                          </div>
                        </div>
                      </div>
                      
                      {grn.notes && (
                        <div className={styles.notesSection}>
                          <strong>📝 Quality Notes:</strong> {grn.notes}
                        </div>
                      )}
                    </div>
                    
                    {/* Internal Workflow Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {/* Universal cross-navigation buttons */}
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handleViewPO(grn.poId)}
                        >
                          📋 View PO
                        </button>
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handlePrintGRN(grn.id)}
                        >
                          🖨️ Print {goodsReceiptNote}
                        </button>
                        
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