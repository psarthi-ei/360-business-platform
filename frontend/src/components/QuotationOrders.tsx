import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockQuotes, mockLeads, mockSalesOrders, formatCurrency } from '../data/mockData';

interface QuotationOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  onShowLeadManagement?: () => void;
  translations: any;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function QuotationOrders({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
  onShowSalesOrders,
  onShowCustomerProfile,
  onShowLeadManagement,
  translations,
  filterState,
  onFilterChange
}: QuotationOrdersProps) {
  const t = translations;
  
  return (
    <div className="quotation-orders-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>📄 {t.quotationOrders}</h1>
        <button className="add-button">{t.addNewQuote}</button>
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
            className={filterState === 'approved' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('approved')}
          >
            {t.showApproved}
          </button>
          <button 
            className={filterState === 'expired' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('expired')}
          >
            {t.showExpired}
          </button>
        </div>
      </div>

      <div className="quotes-container">
        {mockQuotes.map(quote => {
          // Filter logic
          const shouldShow = (
            filterState === 'all' ||
            (filterState === 'pending' && quote.status === 'pending') ||
            (filterState === 'approved' && quote.status === 'approved') ||
            (filterState === 'expired' && quote.status === 'expired')
          );

          if (!shouldShow) return null;

          const statusIcons = {
            pending: '⏳',
            approved: '✅',
            expired: '❌'
          };

          const statusLabels = {
            pending: t.pending,
            approved: t.approved,
            expired: t.expired
          };

          const relatedLead = mockLeads.find(lead => lead.id === quote.leadId);
          const relatedOrder = mockSalesOrders.find(order => order.quoteId === quote.id);

          return (
            <div key={quote.id} className={`quote-card ${quote.status}-quote`}>
              <div className="quote-header">
                <h3>
                  <span 
                    onClick={() => onShowCustomerProfile(quote.customerId)}
                    style={{cursor: 'pointer', textDecoration: 'underline'}}
                  >
                    {quote.id} - {quote.customerName}
                  </span>
                </h3>
                <span className={`status-badge ${quote.status}`}>
                  {statusIcons[quote.status]} {statusLabels[quote.status]}
                </span>
              </div>
              <div className="quote-details">
                <p><strong>{t.customerName}:</strong> {quote.customerName} - {quote.location}</p>
                <p><strong>{t.quoteDate}:</strong> {quote.quoteDate} | <strong>{t.validUntil}:</strong> {quote.validUntil}</p>
                <p><strong>Items:</strong> {quote.items}</p>
                <p><strong>{t.totalAmount}:</strong> {formatCurrency(quote.totalAmount)} (incl. GST)</p>
                <p><strong>Status:</strong> {quote.statusMessage}</p>
              </div>

              {/* Related Lead and Order Information */}
              <div className="quote-mapping">
                <div className="mapping-info">
                  {relatedLead && (
                    <p><strong>📋 From Lead:</strong> 
                      <span className="mapping-link" onClick={() => onShowLeadManagement?.()}>
                        {relatedLead.id}
                      </span> 
                    - {relatedLead.priority} priority ({relatedLead.budget})</p>
                  )}
                  {relatedOrder ? (
                    <p><strong>📦 Converted to Order:</strong> 
                      <span className="mapping-link" onClick={() => onShowSalesOrders()}>
                        {relatedOrder.id}
                      </span> 
                    - {relatedOrder.status} ({relatedOrder.statusMessage})</p>
                  ) : (
                    <p><strong>📦 Order Status:</strong> <span className="no-order">Not converted to order yet</span></p>
                  )}
                </div>
              </div>
              
              <div className="quote-actions">
                <button className="action-btn view-btn">📄 {t.viewPDF}</button>
                {quote.status === 'pending' && (
                  <button className="action-btn approve-btn">✅ {t.approve}</button>
                )}
                {(quote.status === 'approved' || quote.status === 'pending') && (
                  <button className="action-btn convert-btn" onClick={() => onShowSalesOrders()}>
                    🔄 {relatedOrder ? 'View Order' : t.convertToOrder}
                  </button>
                )}
                {quote.status === 'expired' && (
                  <button className="action-btn approve-btn">🔄 Renew Quote</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="voice-commands">
        <p className="voice-hint">
          🎤 <strong>{t.voiceCommandsHint}</strong> 
          "{t.createQuoteRajesh}" • "{t.showApprovedQuotes}" • "{t.convertToOrder}"
        </p>
      </div>
    </div>
  );
}

export default QuotationOrders;