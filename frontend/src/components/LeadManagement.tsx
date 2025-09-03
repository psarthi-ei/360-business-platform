import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockLeads, mockQuotes, mockSalesOrders, formatCurrency } from '../data/mockData';

interface LeadManagementProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowCustomerProfile?: (customerId: string) => void;
  onShowQuoteFromLead?: (leadId: string) => void;
  onShowQuotationOrders?: () => void;
  onShowSalesOrders?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  translations: any;
}

function LeadManagement({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
  onShowCustomerProfile,
  onShowQuoteFromLead,
  onShowQuotationOrders,
  onShowSalesOrders,
  filterState,
  onFilterChange,
  translations
}: LeadManagementProps) {
  const t = translations;
  return (
    <div className="lead-management-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>📋 {t.leadManagement}</h1>
        <button className="add-button">{t.addNewLead}</button>
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
            className={filterState === 'hotleads' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('hotleads')}
          >
            {t.showHotLeads}
          </button>
          <button 
            className={filterState === 'warmleads' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('warmleads')}
          >
            {t.showWarmLeads}
          </button>
          <button 
            className={filterState === 'coldleads' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => onFilterChange('coldleads')}
          >
            {t.showColdLeads}
          </button>
        </div>
      </div>

      <div className="leads-container">
        {mockLeads.map(lead => {
          // Filter logic
          const shouldShow = (
            filterState === 'all' ||
            (filterState === 'hotleads' && lead.priority === 'hot') ||
            (filterState === 'warmleads' && lead.priority === 'warm') ||
            (filterState === 'coldleads' && lead.priority === 'cold')
          );

          if (!shouldShow) return null;

          const priorityIcons = {
            hot: '🔥',
            warm: '🔶', 
            cold: '🔵'
          };

          const priorityLabels = {
            hot: t.hotLead,
            warm: t.warmLead,
            cold: t.coldLead
          };

          const relatedQuotes = mockQuotes.filter(quote => quote.leadId === lead.id);
          const relatedOrders = relatedQuotes.length > 0 ? 
            mockSalesOrders.filter(order => relatedQuotes.some(quote => quote.id === order.quoteId)) : [];

          return (
            <div key={lead.id} className={`lead-card ${lead.priority}-lead`}>
              <div className="lead-header">
                <h3>
                  <span 
                    onClick={() => onShowCustomerProfile?.(lead.customerId)}
                    style={{cursor: 'pointer', textDecoration: 'underline'}}
                  >
                    {lead.customerName} - {lead.location}
                  </span>
                </h3>
                <span className={`priority-badge ${lead.priority}`}>
                  {priorityIcons[lead.priority]} {priorityLabels[lead.priority]}
                </span>
              </div>
              <div className="lead-details">
                <p><strong>Contact:</strong> {lead.contact}</p>
                <p><strong>Business:</strong> {lead.business}</p>
                <p><strong>Inquiry:</strong> {lead.inquiry}</p>
                <p><strong>Budget:</strong> {lead.budget} | <strong>Timeline:</strong> {lead.timeline}</p>
                <p><strong>Last Contact:</strong> {lead.lastContact}</p>
              </div>

              {/* Related Quote and Order Information */}
              <div className="lead-mapping">
                {relatedQuotes.length > 0 ? (
                  <div className="mapping-info">
                    <p><strong>📄 Related Quotes ({relatedQuotes.length}):</strong></p>
                    {relatedQuotes.map((quote, index) => (
                      <p key={quote.id} style={{marginLeft: '20px', marginBottom: '8px'}}>
                        • <span className="mapping-link" onClick={() => onShowQuotationOrders?.()}>
                          {quote.id}
                        </span> 
                        - {formatCurrency(quote.totalAmount)} ({quote.status})
                      </p>
                    ))}
                    {relatedOrders.length > 0 && (
                      <>
                        <p><strong>📦 Related Orders ({relatedOrders.length}):</strong></p>
                        {relatedOrders.map((order, index) => (
                          <p key={order.id} style={{marginLeft: '20px', marginBottom: '8px'}}>
                            • <span className="mapping-link" onClick={() => onShowSalesOrders?.()}>
                              {order.id}
                            </span> 
                            - {order.status} ({order.statusMessage})
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mapping-info">
                    <p><strong>📄 Quote Status:</strong> <span className="no-quote">No quotes created yet</span></p>
                  </div>
                )}
              </div>
              
              <div className="lead-actions">
                <button className="action-btn call-btn">📞 Call{lead.priority === 'hot' ? ' Now' : ''}</button>
                <button className="action-btn whatsapp-btn">💬 WhatsApp</button>
                <button className="action-btn quote-btn" onClick={() => onShowQuoteFromLead?.(lead.id)}>
                  💰 {relatedQuotes.length > 0 ? `View Quotes (${relatedQuotes.length})` : 'Send Quote'}
                </button>
              </div>
              
              <div className="lead-notes">
                <p><strong>Notes:</strong> {lead.notes}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="voice-commands">
        <p className="voice-hint">
          🎤 <strong>{t.voiceCommandsHint}</strong> 
          "{t.addFabricInquiry}" • "{t.callRajesh}" • "{t.showCottonLeads}"
        </p>
      </div>
    </div>
  );
}

export default LeadManagement;