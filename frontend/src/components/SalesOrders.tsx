import React from 'react';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import { mockSalesOrders, mockQuotes, mockLeads, formatCurrency, getBusinessProfileById, mockBusinessProfiles } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import { ActionParams } from '../services/nlp/types';
import styles from '../styles/SalesOrders.module.css';

interface SalesOrdersProps {
  onShowLeadManagement?: () => void;
  onShowQuotationOrders?: () => void;
  onShowPayments?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  onUniversalAction?: (actionType: string, params?: ActionParams) => void;
}

function SalesOrders({
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowPayments,
  filterState,
  onFilterChange,
  onUniversalAction
}: SalesOrdersProps) {
  const { t } = useTranslation();
  
  // Action handler for sales order-specific commands only
  function handleAction(actionType: string, params?: ActionParams) {
    switch (actionType) {
      case 'UPDATE_ORDER_STATUS':
        // Future: Handle order status updates
        // TODO: Implement update order status
        break;
      case 'SEND_PAYMENT_REMINDER':
        // Future: Handle payment reminders
        // TODO: Implement send payment reminder
        break;
      case 'MARK_READY_FOR_PRODUCTION':
        // Future: Handle production readiness
        // TODO: Implement mark ready for production
        break;
      default:
        // TODO: Handle unhandled sales order action
    }
  }
  
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
        <h1 className={styles.centeredHeading}>💳 {t('salesOrder')}</h1>

      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button 
            className={filterState === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('all')}
          >
            {t('showAll')}
          </button>
          <button 
            className={filterState === 'pending' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('pending')}
          >
            ✅ Order Confirmed
          </button>
          <button 
            className={filterState === 'production' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('production')}
          >
            🏭 In Production
          </button>
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

          return (
            <div key={order.id} className={`${styles.orderCard} ${styles[order.status + 'Order']}`}>
              <div className={styles.orderHeader}>
                <h3>{order.id} - Order</h3>
                <span className={`${styles.statusBadge} ${styles.approved}`}>
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </span>
              </div>
              <div className={styles.orderDetails}>
                <p><strong>{t('customerName')}:</strong> {getBusinessProfileById(order.businessProfileId)?.companyName || 'Unknown'} - {getBusinessProfileById(order.businessProfileId)?.registeredAddress.city || 'Unknown'}</p>
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
              
              <div className={styles.orderActions}>
                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>📄 {t('viewPDF')}</button>
                {order.status === 'order_confirmed' && (
                  <>
                    <button 
                      className={`${styles.actionBtn} ${styles.paymentBtn}`}
                      onClick={() => onShowPayments && onShowPayments()}
                    >
                      💳 {t('viewPaymentStatus')}
                    </button>
                    <button className={`${styles.actionBtn} ${styles.productionBtn}`}>🏭 {t('readyForProduction')}</button>
                  </>
                )}
                {order.status === 'production_started' && (
                  <button className={`${styles.actionBtn} ${styles.productionBtn}`}>🏭 Production Status</button>
                )}
                {order.status === 'completed' && (
                  <button className={`${styles.actionBtn} ${styles.viewBtn}`}>📋 Delivery Receipt</button>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>{t('voiceCommandsHint')}</strong> 
          "{t('viewPaymentStatus')}" • "{t('sendPaymentReminder')}" • "Mark ready for production"
        </p>
      </div>

      {/* Voice Assistant for Sales Order Management */}
      <FloatingVoiceAssistant
        currentProcessStage="orders"
        onUniversalAction={onUniversalAction}
        onAction={handleAction}
        businessData={{
          hotLeads: mockLeads.filter(lead => lead.priority === 'hot').length,
          overduePayments: mockSalesOrders.filter(order => {
            const paymentDetails = getOrderPaymentDetails(order.id, order.totalAmount);
            return paymentDetails.paymentStatus === 'overdue';
          }).length,
          readyToShip: mockSalesOrders.filter(order => order.status === 'ready_to_ship').length,
          totalCustomers: mockBusinessProfiles.filter(profile => profile.customerStatus === 'customer').length
        }}
        onPerformSearch={(query) => {
          // Search orders by customer name or order content
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const filteredOrders = mockSalesOrders.filter(order => {
            const customer = getBusinessProfileById(order.businessProfileId);
            return customer?.companyName.toLowerCase().includes(query.toLowerCase()) ||
                   order.items.toLowerCase().includes(query.toLowerCase());
          });
          // TODO: Display filtered orders
        }}
      />
    </div>
  );
}

export default SalesOrders;