import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockSalesOrders, mockQuotes, mockLeads, formatCurrency } from '../data/mockData';

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
    <div className="sales-orders-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>💳 {t.salesOrder}</h1>
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          <button 
            className={filterState === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('all')}
          >
            {t.showAll}
          </button>
          <button 
            className={filterState === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('pending')}
          >
            {t.showPending}
          </button>
          <button 
            className={filterState === 'production' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('production')}
          >
            {t.readyForProduction}
          </button>
        </div>
      </div>

      <div className="orders-container">
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
            <div key={order.id} className={`order-card ${order.status}-order`}>
              <div className="order-header">
                <h3>{order.id} - {order.customerName}</h3>
                <span className="status-badge approved">
                  {statusIcons[order.status]} {statusLabels[order.status]}
                </span>
              </div>
              <div className="order-details">
                <p><strong>{t.customerName}:</strong> {order.customerName} - {order.location}</p>
                <p><strong>{t.orderDate}:</strong> {order.orderDate} | <strong>Delivery:</strong> {order.deliveryDate}</p>
                <p><strong>Items:</strong> {order.items}</p>
                <p><strong>{t.totalAmount}:</strong> {formatCurrency(order.totalAmount)} (incl. GST)</p>
                <p><strong>{t.orderStatus}:</strong> {order.statusMessage}</p>
              </div>

              {/* Related Quote and Lead Information */}
              <div className="order-mapping">
                <div className="mapping-info">
                  {relatedLead && (
                    <p><strong>📋 Original Lead:</strong> 
                      <span className="mapping-link" onClick={() => onShowLeadManagement?.()}>
                        {relatedLead.id}
                      </span> 
                    - {relatedLead.priority} priority (Budget: {relatedLead.budget})</p>
                  )}
                  {relatedQuote && (
                    <p><strong>📄 From Quote:</strong> 
                      <span className="mapping-link" onClick={() => onShowQuotationOrders?.()}>
                        {relatedQuote.id}
                      </span> 
                    - {relatedQuote.quoteDate} ({relatedQuote.status})</p>
                  )}
                  <p><strong>💳 Payment:</strong> {order.paymentStatus}</p>
                  <p><strong>🏭 Production:</strong> {order.productionStatus}</p>
                </div>
              </div>
              
              <div className="order-actions">
                <button className="action-btn view-btn">📄 {t.viewPDF}</button>
                {order.status === 'pending' && (
                  <>
                    <button className="action-btn payment-btn">💳 {t.viewPaymentStatus}</button>
                    <button className="action-btn production-btn">🏭 Ready for Production</button>
                  </>
                )}
                {order.status === 'production' && (
                  <button className="action-btn production-btn">🏭 Production Status</button>
                )}
                {order.status === 'completed' && (
                  <button className="action-btn view-btn">📋 Delivery Receipt</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="voice-commands">
        <p className="voice-hint">
          🎤 <strong>{t.voiceCommandsHint}</strong> 
          "{t.viewPaymentStatus}" • "{t.sendPaymentReminder}"
        </p>
      </div>
    </div>
  );
}

export default SalesOrders;