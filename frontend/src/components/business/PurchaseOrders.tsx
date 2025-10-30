import React, { useMemo } from 'react';
import { mockPurchaseOrders } from '../../data/procurementMockData';
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

  const handleViewPR = (consolidatedPrId: string) => {
    alert(`🔍 Navigating to Purchase Request: ${consolidatedPrId}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };
  
  // Get status with urgency indicators
  const getStatusWithUrgency = (po: typeof mockPurchaseOrders[0]) => {
    const today = new Date();
    const deliveryDate = new Date(po.expectedDelivery);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (po.status === 'delivered') {
      return { icon: '✅', label: 'Delivered', className: 'delivered' };
    }
    
    if (po.status === 'cancelled') {
      return { icon: '❌', label: 'Cancelled', className: 'cancelled' };
    }
    
    if (po.status === 'open') {
      if (diffDays < 0) {
        return { icon: '⚠️', label: `${Math.abs(diffDays)} days overdue`, className: 'urgent' };
      } else if (diffDays <= 2) {
        return { icon: '🔥', label: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, className: 'urgent' };
      } else if (diffDays <= 7) {
        return { icon: '⏳', label: `Due ${formatDate(po.expectedDelivery)}`, className: 'pending' };
      } else {
        return { icon: '⏳', label: `On track • Due ${formatDate(po.expectedDelivery)}`, className: 'pending' };
      }
    }
    
    return { icon: '📋', label: 'Unknown', className: 'default' };
  };

  // Get order value percentage for business context
  const getOrderValuePercentage = (po: typeof mockPurchaseOrders[0]) => {
    // Calculate based on customer's total order value (mock calculation)
    const totalOrderValue = po.totalAmount * 2.1; // Estimate total order as 2.1x this PO
    const percentage = Math.round((po.totalAmount / totalOrderValue) * 100);
    return `${percentage}% of total order`;
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
            const statusInfo = getStatusWithUrgency(po);
            const orderPercentage = getOrderValuePercentage(po);

            return (
              <div key={po.id} className="ds-card-container" data-po-id={po.id}>
                {/* Clickable Card Summary - 140px Template */}
                <div 
                  className={`ds-card ${po.status === 'delivered' ? 'ds-card-status-active' : statusInfo.className === 'urgent' ? 'ds-card-status-urgent' : 'ds-card-status-pending'} ${isExpanded(po.id) ? 'ds-card-expanded' : ''}`}
                  onClick={() => toggleDetails(po.id)}
                >
                  {/* Header - Customer & Material Focus */}
                  <div 
                    className="ds-card-header"
                    title={`${po.customerName} Order ${po.salesOrderId} - ${po.materialName} from ${po.supplierName}`}
                  >
                    {po.customerName} — {po.materialName}
                  </div>
                  
                  {/* Status - Urgency & Delivery Context */}
                  <div className="ds-card-status">
                    {statusInfo.icon} {statusInfo.label}
                  </div>
                  
                  {/* Meta - Financial Priority & Business Context */}
                  <div 
                    className="ds-card-meta"
                    title={`₹${po.totalAmount.toLocaleString()} from ${po.supplierName} • ${po.quantity}${po.unit} • ${orderPercentage}`}
                  >
                    ₹{po.totalAmount.toLocaleString()} • {po.supplierName} • {po.quantity}{po.unit}<br />
                    Order {po.salesOrderId} • {orderPercentage}
                  </div>

                  {/* Expand Indicator */}
                  <div className="ds-card-expand-indicator">
                    {isExpanded(po.id) ? 'Less' : 'More'}
                  </div>
                </div>

                {/* Progressive Disclosure - Organized Business Context */}
                {isExpanded(po.id) && (
                  <div className="ds-expanded-details">
                    <div className="ds-details-content">
                      <h4>📋 Purchase Order Analysis</h4>
                      
                      {/* Section 1: Business Metrics Grid */}
                      <div className={styles.businessMetrics}>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Order Impact</span>
                          <span className={styles.metricValue}>{getOrderValuePercentage(po)}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Financial Value</span>
                          <span className={styles.metricValue}>₹{po.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Delivery Urgency</span>
                          <span className={styles.metricValue}>{(() => {
                            const today = new Date();
                            const deliveryDate = new Date(po.expectedDelivery);
                            const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                            return diffDays > 0 ? `${diffDays} days remaining` : diffDays === 0 ? 'Due today' : `${Math.abs(diffDays)} days overdue`;
                          })()}</span>
                        </div>
                        <div className={styles.metricCard}>
                          <span className={styles.metricLabel}>Material Quantity</span>
                          <span className={styles.metricValue}>{po.quantity}{po.unit}</span>
                        </div>
                      </div>

                      
                      {/* Section 2: Timeline & Details Context Cards */}
                      <div className={styles.contextSection}>
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>⏰ Delivery Timeline</div>
                          <div className={styles.contextContent}>
                            <div>Ordered: {formatDate(po.orderDate)}</div>
                            <div>Expected: {formatDate(po.expectedDelivery)} {(() => {
                              const today = new Date();
                              const deliveryDate = new Date(po.expectedDelivery);
                              const diffTime = deliveryDate.getTime() - today.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              return diffDays > 0 ? `(${diffDays} days)` : diffDays === 0 ? '(Today)' : `(${Math.abs(diffDays)} days overdue)`;
                            })()}</div>
                            {po.actualDelivery && <div>Delivered: {formatDate(po.actualDelivery)}</div>}
                            {po.notes && <div>Notes: {po.notes}</div>}
                          </div>
                        </div>
                        
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>💰 Financial Breakdown</div>
                          <div className={styles.contextContent}>
                            <div>Total Value: ₹{po.totalAmount.toLocaleString()}</div>
                            <div>Unit Price: ₹{po.unitPrice.toLocaleString()}/{po.unit}</div>
                            <div>Quantity: {po.quantity}{po.unit}</div>
                            <div>Order: {po.salesOrderId} • PR: {po.consolidatedPrId}</div>
                          </div>
                        </div>
                        
                        <div className={styles.contextCard}>
                          <div className={styles.contextHeader}>🏭 Supplier Details</div>
                          <div className={styles.contextContent}>
                            <div>Name: {po.supplierName}</div>
                            <div>ID: {po.supplierId}</div>
                            <div>Material: {po.materialName}</div>
                            <div>Status: {getStatusWithUrgency(po).label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Internal Workflow Actions - Only visible when expanded */}
                    <div className={styles.cardActions}>
                      <div className={styles.actionButtons}>
                        {/* Universal cross-navigation button */}
                        <button 
                          className="ds-btn ds-btn-secondary"
                          onClick={() => handleViewPR(po.consolidatedPrId)}
                        >
                          📋 View PR
                        </button>
                        
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