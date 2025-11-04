import React, { useCallback } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockSalesOrders, 
  mockQuotes, 
  mockLeads,
  mockProformaInvoices,
  OrderItem
} from '../../data/salesMockData';
import { useTranslation } from '../../contexts/TranslationContext';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './SalesOrders.module.css';

interface SalesOrdersProps {
  onShowLeadManagement?: () => void;
  onShowQuotationOrders?: () => void;
  onShowPayments?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function SalesOrders({
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowPayments,
  filterState,
  onFilterChange
}: SalesOrdersProps) {
  const { t } = useTranslation();
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = useCallback((orderId: string) => {
    toggleExpansion(orderId, 'data-order-id');
    
    // Items now shown directly - no separate collapse needed
  }, [toggleExpansion]);
  
  // Removed nested items expansion - items now shown directly in main expanded view
  
  
  // Helper function to get payment details for an order from ProformaInvoice data
  const getOrderPaymentDetails = (orderId: string, totalAmount: number, quoteId?: string) => {
    // Default values
    let advanceAmount = 0;
    let advancePercentage = 0;
    
    // Find related ProformaInvoice through quote
    if (quoteId) {
      const relatedProformaInvoice = mockProformaInvoices.find(pi => pi.quoteId === quoteId);
      if (relatedProformaInvoice) {
        advanceAmount = relatedProformaInvoice.advanceAmount;
        advancePercentage = Math.round((advanceAmount / relatedProformaInvoice.totalAmount) * 100);
      }
    }
    
    // Simulate different payment states based on order ID (same logic as Payments)
    let advanceReceived = 0;
    let paymentStatus = 'pending';
    
    if (orderId === 'SO-001') {
      paymentStatus = 'overdue';
      advanceReceived = 0;
    } else if (orderId === 'SO-002') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
    } else if (orderId === 'SO-003') {
      paymentStatus = 'received';
      advanceReceived = advanceAmount;
    }
    
    return {
      advanceAmount,
      advanceReceived,
      balanceAdvance: advanceAmount - advanceReceived,
      paymentStatus,
      advancePercentage
    };
  };
  
  // Helper function to check if order has structured items
  const hasStructuredItems = (order: { items: OrderItem[] }): boolean => {
    return !!(order.items && order.items.length > 0);
  };
  
  // Get formatted items display for header (concise)
  const getOrderItemsHeader = (order: { items: OrderItem[] }): string => {
    if (hasStructuredItems(order)) {
      const items = order.items as OrderItem[];
      if (items.length === 1) {
        return `${items[0].description} (${items[0].quantity} ${items[0].unit})`;
      } else {
        // Show first item details + more count for multiple items
        const firstItem = items[0];
        const remainingCount = items.length - 1;
        return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
      }
    }
    // Fallback display
    return "No items";
  };
  
  // Get formatted items display for details (comprehensive with production tracking)
  const renderOrderItemsDetails = (order: { items: OrderItem[]; progressPercentage?: number }) => {
    if (hasStructuredItems(order)) {
      const items = order.items as OrderItem[];
      
      return (
        <div className={styles.itemsEnhanced}>
          <div className={styles.itemsList}>
            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemRowHeader}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCodeBadge}>
                        {item.itemCode}
                      </span>
                      <span className={styles.itemDescription}>
                        {item.description}
                      </span>
                    </div>
                    <div className={styles.itemDetails}>
                      <span>
                        <strong>HSN:</strong> {item.hsnCode}
                      </span>
                      <span>
                        <strong>Qty:</strong> {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      <span>
                        <strong>Rate:</strong> {formatCurrency(item.rate)}/{item.unit}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemAmount}>
                    <div className={styles.itemAmountValue}>
                      {formatCurrency(item.taxableAmount)}
                    </div>
                    {item.discount > 0 && (
                      <div className={styles.itemDiscount}>
                        -{item.discount}% discount
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Fallback display
    return (
      <div className={styles.basicItemsDisplay}>
        <p><strong>Items:</strong> No items available</p>
        {order.progressPercentage !== undefined && (
          <div className={styles.basicProgress}>
            <span>Production Progress: {order.progressPercentage}%</span>
            <div className={styles.basicProgressBar}>
              <div 
                className={styles.basicProgressFill}
                style={{ width: `${order.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.salesOrdersScreen}>
      <div className={styles.pageContent}>
      
      
      <div className={styles.ordersContainer}>
        {mockSalesOrders.map(order => {
          // Filter logic
          const shouldShow = (
            filterState === 'all' ||
            (filterState === 'pending' && order.status === 'order_confirmed') ||
            (filterState === 'production' && order.status === 'production_started')
          );

          if (!shouldShow) return null;

          const statusIcons = {
            // Core customer-facing states
            order_confirmed: '✅',
            payment_pending: '💳',
            materials_pending: '📦',
            in_process: '🔄',
            quality_check: '🔍',
            ready_to_ship: '🚚',
            shipped: '🛫',
            delivered: '📍',
            completed: '🎉',
            on_hold: '⏸️',
            cancelled: '❌',
            
            // Legacy SalesOrder status values (compatibility)
            production_planning: '📋',
            pending_materials: '📦',
            production_started: '🏭',
            production_completed: '✅',
            in_transit: '🚛',
            
            // Legacy JobOrder status values (compatibility)
            awaiting_client_materials: '📥',
            materials_acknowledged: '✅',
            service_completed: '🎯',
            ready_for_invoice: '💰'
          };

          const statusLabels = {
            // Core customer-facing states
            order_confirmed: 'Order Confirmed',
            payment_pending: 'Payment Pending',
            materials_pending: 'Materials Pending',
            in_process: 'In Process',
            quality_check: 'Quality Check',
            ready_to_ship: 'Ready to Ship',
            shipped: 'Shipped',
            delivered: 'Delivered',
            completed: t('completed') || 'Completed',
            on_hold: 'On Hold',
            cancelled: 'Cancelled',
            
            // Legacy SalesOrder status values (compatibility)
            production_planning: 'Planning Production',
            pending_materials: 'Awaiting Materials',
            production_started: t('inProduction') || 'In Production',
            production_completed: 'Production Done',
            in_transit: 'In Transit',
            
            // Legacy JobOrder status values (compatibility)
            awaiting_client_materials: 'Awaiting Client Materials',
            materials_acknowledged: 'Materials Received',
            service_completed: 'Service Completed',
            ready_for_invoice: 'Ready for Invoice'
          };

          const relatedQuote = mockQuotes.find(quote => quote.id === order.quoteId);
          const relatedLead = relatedQuote ? mockLeads.find(lead => lead.id === relatedQuote.leadId) : null;
          const paymentDetails = getOrderPaymentDetails(order.id, order.totalAmount, order.quoteId);

          const businessProfile = getBusinessProfileById(order.businessProfileId);
          const companyName = businessProfile?.companyName || 'Unknown Company';

          return (
            <div key={order.id} className="ds-card-container" data-order-id={order.id}>
              {/* Clickable Card Summary - Global Design System 140px Template */}
              <div 
                className={`ds-card ${order.status === 'completed' || order.status === 'delivered' ? 'ds-card-status-active' : order.status === 'order_confirmed' || order.status === 'production_started' || order.status === 'shipped' ? 'ds-card-status-pending' : 'ds-card-priority-medium'} ${isExpanded(order.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(order.id)}
              >
                {/* Enhanced Header - Company Name + Items Context */}
                <div 
                  className="ds-card-header"
                  title={`${companyName} - ${getOrderItemsHeader(order)} (Order ID: ${order.id})`}
                >
                  {companyName} — {getOrderItemsHeader(order)}
                </div>
                
                {/* Optimized Status - Primary Order Status Only */}
                <div className="ds-card-status">
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </div>
                
                {/* Business-Optimized Meta - Value + Urgency + Delivery Timeline */}
                <div 
                  className="ds-card-meta"
                  title={`${formatCurrency(order.totalAmount)} • Due: ${order.deliveryDate} • ${order.orderDate}`}
                >
                  {formatCurrency(order.totalAmount)} • Due: {order.deliveryDate}<br />
                  {order.id} • {order.orderDate}
                </div>

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {isExpanded(order.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Progressive Disclosure - Detailed Information */}
              {isExpanded(order.id) && (
                <div className="ds-expanded-details">
                  <div className="ds-details-content">
                    {/* Enhanced Order Details - Focus on NEW information not in card */}
                    <p><strong>Status Details:</strong> {order.statusMessage}</p>
                    <p><strong>Production Status:</strong> {order.statusMessage}</p>
                    {order.balancePaymentDue && order.balancePaymentDue > 0 && (
                      <p><strong>Balance Due:</strong> {formatCurrency(order.balancePaymentDue)}</p>
                    )}
                    {order.progressPercentage && (
                      <p><strong>Progress:</strong> {order.progressPercentage}% completed</p>
                    )}
                  </div>

                  {/* Comprehensive Item Details with Production Context - Always Visible */}
                  {hasStructuredItems(order) && (
                    <div className={styles.itemsSection}>
                      <h4 className={styles.sectionTitle}>📋 Item Details</h4>
                      {renderOrderItemsDetails(order)}
                    </div>
                  )}
                  
                  {/* Related Quote and Lead Information */}
                  <div className={styles.orderMapping}>
                    <div className={styles.mappingInfo}>
                      {relatedLead && (
                        <p><strong>📋 Original Lead:</strong> 
                          <span className={styles.mappingLink} onClick={() => onShowLeadManagement?.()}>
                            {relatedLead.id}
                          </span> 
                        - {relatedLead.priority} priority (Budget: {relatedLead.budget})</p>
                      )}
                      {relatedQuote && (
                        <p><strong>📄 From Quote:</strong> 
                          <span className={styles.mappingLink} onClick={() => onShowQuotationOrders?.()}>
                            {relatedQuote.id}
                          </span> 
                        - {relatedQuote.quoteDate} ({relatedQuote.status})</p>
                      )}
                      <p>
                        <strong>💳 Payment:</strong> 
                        <span 
                          className={styles.mappingLink} 
                          onClick={() => onShowPayments && onShowPayments()}
                          title="View payment details"
                          style={{ marginLeft: '8px' }}
                        >
                          {paymentDetails.paymentStatus === 'received' ? (
                            <span style={{ color: '#27ae60' }}>
                              ✅ Received {formatCurrency(paymentDetails.advanceReceived)} / {formatCurrency(paymentDetails.advanceAmount)}
                            </span>
                          ) : paymentDetails.paymentStatus === 'overdue' ? (
                            <span style={{ color: '#e74c3c' }}>
                              🔴 Overdue {formatCurrency(paymentDetails.balanceAdvance)} pending
                            </span>
                          ) : (
                            <span style={{ color: '#f39c12' }}>
                              ⏳ Pending {formatCurrency(paymentDetails.balanceAdvance)} of {formatCurrency(paymentDetails.advanceAmount)}
                            </span>
                          )}
                        </span>
                      </p>
                      <p><strong>🏭 Production:</strong> {order.statusMessage}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only visible when expanded */}
                  <div className={styles.cardActions}>
                    {/* Single-row button layout with natural wrapping */}
                    <div className={styles.actionButtons}>
                      <button className="ds-btn ds-btn-primary">
                        📞 Call
                      </button>
                      <button className="ds-btn ds-btn-primary">
                        📱 WhatsApp
                      </button>
                      <button className="ds-btn ds-btn-secondary">
                        📄 {t('viewPDF')}
                      </button>
                      {order.status === 'order_confirmed' && (
                        <>
                          <button 
                            className="ds-btn ds-btn-secondary"
                            onClick={() => onShowPayments && onShowPayments()}
                          >
                            💳 {t('viewPaymentStatus')}
                          </button>
                          <button className="ds-btn ds-btn-secondary">
                            🏭 {t('readyForProduction')}
                          </button>
                        </>
                      )}
                      {order.status === 'production_started' && (
                        <button className="ds-btn ds-btn-secondary">
                          🏭 Production Status
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <button className="ds-btn ds-btn-secondary">
                          📋 Delivery Receipt
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
}

export default SalesOrders;