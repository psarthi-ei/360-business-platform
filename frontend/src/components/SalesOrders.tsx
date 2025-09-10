import React from 'react';
import ProductHeader from './ProductHeader';
import { mockSalesOrders, mockQuotes, mockLeads, formatCurrency } from '../data/mockData';
import styles from '../styles/SalesOrders.module.css';

interface SalesOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowLeadManagement?: () => void;
  onShowQuotationOrders?: () => void;
  onShowAdvancePaymentManagement?: () => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function SalesOrders({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowLeadManagement,
  onShowQuotationOrders,
  onShowAdvancePaymentManagement,
  translations,
  filterState,
  onFilterChange
}: SalesOrdersProps) {
  const t = translations;
  
  // Helper function to calculate payment details for an order
  const getOrderPaymentDetails = (orderId: string, totalAmount: number) => {
    const advancePercentage = 50; // Standard 50% advance
    const advanceAmount = Math.round(totalAmount * (advancePercentage / 100));
    
    // Simulate different payment states based on order ID (same logic as AdvancePaymentManagement)
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
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onContextNavigation={onNavigateBack}
        contextNavigationText="Dashboard"
        contextNavigationIcon="📊"
        showContextNavigation={true}
        showThemeSelector={true}
      />
      
      <div className={styles.pageContent}>
        <h1 className={styles.centeredHeading}>💳 {t.salesOrder}</h1>

      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button 
            className={filterState === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('all')}
          >
            {t.showAll}
          </button>
          <button 
            className={filterState === 'pending' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('pending')}
          >
            {t.showPending}
          </button>
          <button 
            className={filterState === 'production' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('production')}
          >
            🏭 {t.readyForProduction}
          </button>
        </div>
      </div>

      <div className={styles.ordersContainer}>
        {mockSalesOrders.map(order => {
          // Filter logic
          const shouldShow = (
            filterState === 'all' ||
            (filterState === 'pending' && order.status === 'pending') ||
            (filterState === 'production' && order.status === 'production')
          );

          if (!shouldShow) return null;

          const statusIcons = {
            pending: '⏳',
            production: '🏭',
            completed: '✅'
          };

          const statusLabels = {
            pending: t.pending,
            production: t.inProduction,
            completed: t.completed || 'Completed'
          };

          const relatedQuote = mockQuotes.find(quote => quote.id === order.quoteId);
          const relatedLead = relatedQuote ? mockLeads.find(lead => lead.id === relatedQuote.leadId) : null;
          const paymentDetails = getOrderPaymentDetails(order.id, order.totalAmount);

          return (
            <div key={order.id} className={`${styles.orderCard} ${styles[order.status + 'Order']}`}>
              <div className={styles.orderHeader}>
                <h3>{order.id} - {order.customerName}</h3>
                <span className={`${styles.statusBadge} ${styles.approved}`}>
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </span>
              </div>
              <div className={styles.orderDetails}>
                <p><strong>{t.customerName}:</strong> {order.customerName} - {order.location}</p>
                <p><strong>{t.orderDate}:</strong> {order.orderDate} | <strong>Delivery:</strong> {order.deliveryDate}</p>
                <p><strong>Items:</strong> {order.items}</p>
                <p><strong>{t.totalAmount}:</strong> {formatCurrency(order.totalAmount)} (incl. GST)</p>
                <p><strong>{t.orderStatus}:</strong> {order.statusMessage}</p>
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
                      onClick={() => onShowAdvancePaymentManagement && onShowAdvancePaymentManagement()}
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
                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>📄 {t.viewPDF}</button>
                {order.status === 'pending' && (
                  <>
                    <button 
                      className={`${styles.actionBtn} ${styles.paymentBtn}`}
                      onClick={() => onShowAdvancePaymentManagement && onShowAdvancePaymentManagement()}
                    >
                      💳 {t.viewPaymentStatus}
                    </button>
                    <button className={`${styles.actionBtn} ${styles.productionBtn}`}>🏭 {t.readyForProduction}</button>
                  </>
                )}
                {order.status === 'production' && (
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
          🎤 <strong>{t.voiceCommandsHint}</strong> 
          "{t.viewPaymentStatus}" • "{t.sendPaymentReminder}"
        </p>
      </div>
    </div>
  );
}

export default SalesOrders;