import React, { useCallback, useState } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockSalesOrders, 
  mockQuotes, 
  mockLeads,
  getFeatureToggleState,
  setFeatureToggle,
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
  }, [toggleExpansion]);
  
  // Professional Order Display with Feature Toggle Support
  const [useStructuredData, setUseStructuredData] = useState(getFeatureToggleState('STRUCTURED_ITEMS_ENABLED'));
  
  // State for collapsible professional items sections
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Handle toggle change
  const handleToggleChange = (enabled: boolean) => {
    setFeatureToggle('STRUCTURED_ITEMS_ENABLED', enabled);
    setUseStructuredData(enabled);
  };

  // Handle items section expansion toggle
  const toggleItemsExpansion = (orderId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };
  
  
  // Helper function to calculate payment details for an order
  const getOrderPaymentDetails = (orderId: string, totalAmount: number) => {
    const advancePercentage = 50; // Standard 50% advance
    const advanceAmount = Math.round(totalAmount * (advancePercentage / 100));
    
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
      paymentStatus
    };
  };
  
  // Helper function to check if order has structured items
  const hasStructuredItems = (order: { itemsStructured?: OrderItem[] }): boolean => {
    return !!(order.itemsStructured && order.itemsStructured.length > 0);
  };
  
  // Get formatted items display for header (concise)
  const getOrderItemsHeader = (order: { items: string; itemsStructured?: OrderItem[] }): string => {
    if (useStructuredData && hasStructuredItems(order)) {
      const items = order.itemsStructured as OrderItem[];
      if (items.length === 1) {
        const deliveryProgress = items[0].deliveredQuantity ? ` (${items[0].deliveredQuantity}/${items[0].quantity} delivered)` : ` (${items[0].quantity} ${items[0].unit})`;
        return `${items[0].description}${deliveryProgress}`;
      } else {
        // Show first item details + more count for multiple items
        const firstItem = items[0];
        const remainingCount = items.length - 1;
        const deliveryProgress = firstItem.deliveredQuantity ? ` (${firstItem.deliveredQuantity}/${firstItem.quantity} delivered)` : ` (${firstItem.quantity} ${firstItem.unit})`;
        return `${firstItem.description}${deliveryProgress} + ${remainingCount} more items`;
      }
    }
    // Fallback to existing string display
    return order.items;
  };
  
  // Get formatted items display for details (comprehensive with production tracking)
  const renderOrderItemsDetails = (order: { items: string; itemsStructured?: OrderItem[]; progressPercentage?: number }) => {
    if (useStructuredData && hasStructuredItems(order)) {
      const items = order.itemsStructured as OrderItem[];
      
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
                    </div>
                    
                    {/* Production Tracking Details */}
                    <div className={styles.productionTracking}>
                      <div className={styles.deliveryProgress}>
                        <span className={styles.deliveryLabel}>
                          🚚 Delivery Progress:
                        </span>
                        <span className={styles.deliveryValue}>
                          {item.deliveredQuantity || 0} / {item.quantity} {item.unit}
                        </span>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ 
                              width: `${((item.deliveredQuantity || 0) / item.quantity) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Production Summary */}
          <div className={styles.productionSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>🏭 Overall Progress:</span>
              <span className={styles.summaryValue}>{order.progressPercentage || 0}%</span>
            </div>
            <div className={styles.overallProgressBar}>
              <div 
                className={styles.overallProgressFill}
                style={{ width: `${order.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
          
          {/* Production Summary - Non-Financial */}
          <div className={styles.productionSummaryFooter}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>📋 Total Items:</span>
              <span className={styles.summaryValue}>{items.length} items</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>📦 Total Quantity:</span>
              <span className={styles.summaryValue}>
                {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} units
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>✅ Delivered:</span>
              <span className={styles.summaryValue}>
                {items.reduce((sum, item) => sum + (item.deliveredQuantity || 0), 0).toLocaleString()} units
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback to existing string display
    return (
      <div className={styles.basicItemsDisplay}>
        <p><strong>Items:</strong> {order.items}</p>
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
      
        {/* Professional Production Tracking Toggle Section */}
        <div className={styles.professionalToggle}>
          <div>
            <h3>Production Tracking & Item Details</h3>
            <p>Enhanced view with delivery progress, item breakdown, and production status</p>
          </div>
          <div 
            className={styles.toggleButton}
            onClick={() => handleToggleChange(!useStructuredData)}
          >
            <input 
              type="checkbox" 
              checked={useStructuredData} 
              onChange={() => handleToggleChange(!useStructuredData)}
            />
            <span className={styles.toggleSlider}>
              {useStructuredData ? 'Professional View' : 'Standard View'}
            </span>
          </div>
        </div>
      
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
            order_confirmed: '✅',
            production_planning: '📋',
            pending_materials: '📦',
            production_started: '🏭',
            quality_check: '🔍',
            production_completed: '✅',
            ready_to_ship: '🚚',
            shipped: '🛫',
            in_transit: '🚛',
            delivered: '📍',
            completed: '🎉'
          };

          const statusLabels = {
            order_confirmed: 'Order Confirmed',
            production_planning: 'Planning Production',
            pending_materials: 'Awaiting Materials',
            production_started: t('inProduction') || 'In Production',
            quality_check: 'Quality Check',
            production_completed: 'Production Done',
            ready_to_ship: 'Ready to Ship',
            shipped: 'Shipped',
            in_transit: 'In Transit',
            delivered: 'Delivered',
            completed: t('completed') || 'Completed'
          };

          const relatedQuote = mockQuotes.find(quote => quote.id === order.quoteId);
          const relatedLead = relatedQuote ? mockLeads.find(lead => lead.id === relatedQuote.leadId) : null;
          const paymentDetails = getOrderPaymentDetails(order.id, order.totalAmount);

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
                    <p><strong>{t('customerName')}:</strong> {companyName} - {businessProfile?.registeredAddress.city || 'Unknown'}</p>
                    <p><strong>{t('orderDate')}:</strong> {order.orderDate} | <strong>Delivery:</strong> {order.deliveryDate}</p>
                    <p><strong>Items:</strong> {order.items}</p>
                    <p><strong>{t('totalAmount')}:</strong> {formatCurrency(order.totalAmount)} (incl. GST)</p>
                    <p><strong>{t('orderStatus')}:</strong> {order.statusMessage}</p>
                  </div>

                  {/* Professional Production Tracking Items Section */}
                  {useStructuredData && hasStructuredItems(order) && (
                    <div className={styles.professionalItemsSection}>
                      <div 
                        className={styles.itemsToggleHeader}
                        onClick={() => toggleItemsExpansion(order.id)}
                      >
                        <div className={styles.itemsHeaderContent}>
                          <span className={styles.itemsHeaderIcon}>🏭</span>
                          <div className={styles.itemsHeaderText}>
                            <h4>Production Tracking & Item Details</h4>
                            <p>{getOrderItemsHeader(order)}</p>
                          </div>
                        </div>
                        <div className={styles.itemsExpandIcon}>
                          {expandedItems.has(order.id) ? '▼' : '▶'}
                        </div>
                      </div>
                      
                      {expandedItems.has(order.id) && (
                        <div className={styles.itemsContent}>
                          {renderOrderItemsDetails(order)}
                        </div>
                      )}
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
                      <p><strong>🏭 Production:</strong> {order.productionStatus}</p>
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