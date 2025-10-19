import React, { useState, useCallback } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { mockSalesOrders, mockQuotes, mockLeads } from '../../data/salesMockData';
import { useTranslation } from '../../contexts/TranslationContext';
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
  
  // Progressive disclosure state for 140px template cards
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Sequential expansion toggle function - smooth visual flow
  const toggleDetails = useCallback(async (orderId: string) => {
    if (expandedDetails.has(orderId)) {
      // Simple collapse - no sequencing needed
      setExpandedDetails(new Set());
    } else {
      // Sequential: First collapse any open card
      if (expandedDetails.size > 0) {
        setExpandedDetails(new Set());
        // Wait for collapse animation to complete
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Then expand the new card
      setExpandedDetails(new Set([orderId]));
      
      // Scroll to ensure the card is visible
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-order-id="${orderId}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, [expandedDetails]);
  
  
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
            <div key={order.id} className={styles.orderCardContainer} data-order-id={order.id}>
              {/* Clickable Card Summary - 140px Template */}
              <div 
                className={`${styles.orderCard} ${styles[order.status + 'Order']} ${expandedDetails.has(order.id) ? styles.expanded : ''}`}
                onClick={() => toggleDetails(order.id)}
              >
                {/* Template Header - Company Name Only */}
                <div 
                  className={styles.cardHeader}
                  title={`${companyName} (Order ID: ${order.id})`}
                >
                  {companyName}
                </div>
                
                {/* Template Status */}
                <div className={styles.cardStatus}>
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </div>
                
                {/* Template Meta - 2 lines */}
                <div 
                  className={styles.cardMeta}
                  title={`${order.items} • ${formatCurrency(order.totalAmount)} • ${order.id} • Delivery: ${order.deliveryDate}`}
                >
                  {order.items} • {formatCurrency(order.totalAmount)}<br />
                  {order.id} • Delivery: {order.deliveryDate}
                </div>

                {/* Expand Indicator */}
                <div className={styles.expandIndicator}>
                  {expandedDetails.has(order.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Progressive Disclosure - Detailed Information */}
              {expandedDetails.has(order.id) && (
                <div className="ds-expanded-details">
                  <div className="ds-details-content">
                    <p><strong>{t('customerName')}:</strong> {companyName} - {businessProfile?.registeredAddress.city || 'Unknown'}</p>
                    <p><strong>{t('orderDate')}:</strong> {order.orderDate} | <strong>Delivery:</strong> {order.deliveryDate}</p>
                    <p><strong>Items:</strong> {order.items}</p>
                    <p><strong>{t('totalAmount')}:</strong> {formatCurrency(order.totalAmount)} (incl. GST)</p>
                    <p><strong>{t('orderStatus')}:</strong> {order.statusMessage}</p>
                  </div>

                  
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