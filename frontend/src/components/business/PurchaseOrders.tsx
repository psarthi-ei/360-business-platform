import React, { useMemo } from 'react';
import { mockPurchaseOrders, PurchaseOrder } from '../../data/procurementMockData';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './PurchaseOrders.module.css';

interface PurchaseOrdersProps {
  filterState: string;
  onFilterChange: (filter: string) => void;
}

const PurchaseOrders = ({ 
  filterState, 
  onFilterChange 
}: PurchaseOrdersProps) => {
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Filter POs based on filter state
  const filteredPOs = useMemo(() => {
    if (filterState === 'all') return mockPurchaseOrders;
    return mockPurchaseOrders.filter(po => po.status === filterState);
  }, [filterState]);
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = (poId: string) => {
    toggleExpansion(poId, 'data-po-id');
  };
  
  // Mock action handlers
  const handlePOAction = (action: string, poId: string) => {
    alert(`${action} action for PO ${poId} - Mock functionality`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get status icon and styling
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open':
        return { icon: '⏳', label: 'Sent', className: 'open' };
      case 'delivered':
        return { icon: '✅', label: 'Delivered', className: 'delivered' };
      case 'cancelled':
        return { icon: '❌', label: 'Cancelled', className: 'cancelled' };
      default:
        return { icon: '📋', label: 'Unknown', className: 'default' };
    }
  };

  // Get material context for status (instead of due date duplicate)
  const getMaterialContext = (po: PurchaseOrder) => {
    return `📦 ${po.materialName}`;
  };

  // Calculate open orders for alert header
  const openCount = filteredPOs.filter(po => po.status === 'open').length;

  return (
    <div className={styles.purchaseOrdersScreen}>
      <div className={styles.pageContent}>
        {/* Alert Header - Only show when open orders exist */}
        {openCount > 0 && (
          <div className={styles.alertHeader}>
            ⏳ {openCount} PURCHASE ORDERS PENDING DELIVERY
          </div>
        )}

        <div className={styles.poContainer}>
          {filteredPOs.map(po => {
            const statusInfo = getStatusInfo(po.status);
            const materialContext = getMaterialContext(po);

            return (
              <div key={po.id} className={styles.poCardContainer} data-po-id={po.id}>
                {/* Clickable Card Summary - 140px Template */}
                <div 
                  className={`${styles.poCard} ${styles[statusInfo.className]} ${isExpanded(po.id) ? styles.expanded : ''}`}
                  onClick={() => toggleDetails(po.id)}
                >
                  {/* Template Header - PO# + Supplier Format */}
                  <div 
                    className={styles.cardHeader}
                    title={`${po.materialName} (PO ID: ${po.id}) - ${po.supplierName}`}
                  >
                    PO#{po.id.replace('PO-', '')} — {po.supplierName}
                  </div>
                  
                  {/* Template Status - Remove due date duplicate */}
                  <div className={styles.cardStatus}>
                    {statusInfo.icon} {statusInfo.label} • {materialContext}
                  </div>
                  
                  {/* Template Meta - Delivery tracking: financial + timeline + quantity (remove supplier duplicate) */}
                  <div 
                    className={styles.cardMeta}
                    title={`₹${po.totalAmount.toLocaleString()} order • Due: ${formatDate(po.expectedDelivery)} • ${po.quantity}${po.unit}`}
                  >
                    ₹{po.totalAmount.toLocaleString()} • Due: {formatDate(po.expectedDelivery)}<br />
                    {po.quantity}{po.unit} • {(() => {
                      const today = new Date();
                      const deliveryDate = new Date(po.expectedDelivery);
                      const diffTime = deliveryDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays > 0 ? `${diffDays} days remaining` : diffDays === 0 ? 'Due today' : `${Math.abs(diffDays)} days overdue`;
                    })()}
                  </div>

                  {/* Expand Indicator */}
                  <div className={styles.expandIndicator}>
                    {isExpanded(po.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Operations Management Context */}
                {isExpanded(po.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📋 Purchase Order Details</h4>
                      
                      <p><strong>Delivery Timeline:</strong> Due {formatDate(po.expectedDelivery)} {(() => {
                        const today = new Date();
                        const deliveryDate = new Date(po.expectedDelivery);
                        const diffTime = deliveryDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays > 0 ? `(${diffDays} days)` : diffDays === 0 ? '(Today)' : `(${Math.abs(diffDays)} days overdue)`;
                      })()} {po.notes ? `• ${po.notes}` : ''}</p>
                      <p><strong>Financial Commitment:</strong> ₹{po.totalAmount.toLocaleString()} ({po.quantity}{po.unit} @ ₹{po.unitPrice.toLocaleString()}/{po.unit})</p>
                      <p><strong>Supplier Management:</strong> {po.supplierName} (ID: {po.supplierId})</p>
                      <p><strong>Order Timeline:</strong> Placed {formatDate(po.orderDate)}, Expected {formatDate(po.expectedDelivery)}</p>
                      {po.actualDelivery && <p><strong>Delivery Status:</strong> Delivered on {formatDate(po.actualDelivery)}</p>}
                      <p><strong>Material Details:</strong> {po.materialName} - {po.quantity}{po.unit} ordered</p>
                      <p><strong>Related Request:</strong> {po.prId}</p>
                    </div>
                    
                    {/* Internal Workflow Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {po.status === 'open' && (
                          <>
                            <button 
                              className="ds-btn ds-btn-primary"
                              onClick={() => handlePOAction('contact-supplier', po.id)}
                            >
                              📞 Contact Supplier
                            </button>
                            <button 
                              className="ds-btn ds-btn-secondary"
                              onClick={() => handlePOAction('track-order', po.id)}
                            >
                              📋 Track Order
                            </button>
                            <button 
                              className="ds-btn ds-btn-danger"
                              onClick={() => handlePOAction('cancel-po', po.id)}
                            >
                              ❌ Cancel PO
                            </button>
                          </>
                        )}
                        {po.status === 'delivered' && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handlePOAction('create-grn', po.id)}
                          >
                            📦 Create GRN
                          </button>
                        )}
                        {po.status === 'cancelled' && (
                          <button 
                            className="ds-btn ds-btn-secondary"
                            onClick={() => handlePOAction('view-cancellation', po.id)}
                          >
                            📄 View Cancellation
                          </button>
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

export default PurchaseOrders;