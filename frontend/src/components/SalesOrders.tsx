import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockSalesOrders, mockQuotes, mockLeads, formatCurrency } from '../data/mockData';
import styles from './SalesOrders.module.css';

interface SalesOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowLeadManagement?: () => void;
  onShowQuotationOrders?: () => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function SalesOrders({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
  onShowLeadManagement,
  onShowQuotationOrders,
  translations,
  filterState,
  onFilterChange
}: SalesOrdersProps) {
  const t = translations;
  
  return (
    <div className={styles.salesOrdersScreen}>
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className={styles.screenHeader}>
        <button className={styles.backButton} onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>💳 {t.salesOrder}</h1>
      </div>

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
            {t.readyForProduction}
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
            production: 'In Production',
            completed: 'Completed'
          };

          const relatedQuote = mockQuotes.find(quote => quote.id === order.quoteId);
          const relatedLead = relatedQuote ? mockLeads.find(lead => lead.id === relatedQuote.leadId) : null;

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
                  <p><strong>💳 Payment:</strong> {order.paymentStatus}</p>
                  <p><strong>🏭 Production:</strong> {order.productionStatus}</p>
                </div>
              </div>
              
              <div className={styles.orderActions}>
                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>📄 {t.viewPDF}</button>
                {order.status === 'pending' && (
                  <>
                    <button className={`${styles.actionBtn} ${styles.paymentBtn}`}>💳 {t.viewPaymentStatus}</button>
                    <button className={`${styles.actionBtn} ${styles.productionBtn}`}>🏭 Ready for Production</button>
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