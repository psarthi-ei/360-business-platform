import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockLeads, mockQuotes, mockSalesOrders, formatCurrency } from '../data/mockData';
import styles from './LeadManagement.module.css';

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
    <div className={styles.leadManagementScreen}>
      <LanguageSwitcher 
        currentLanguage={currentLanguage} 
        onLanguageChange={onLanguageChange} 
      />
      
      <div className={styles.screenHeader}>
        <button className={styles.backButton} onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>📋 {t.leadManagement}</h1>
        <button className={styles.addButton}>{t.addNewLead}</button>
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
            className={filterState === 'hotleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('hotleads')}
          >
            {t.showHotLeads}
          </button>
          <button 
            className={filterState === 'warmleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('warmleads')}
          >
            {t.showWarmLeads}
          </button>
          <button 
            className={filterState === 'coldleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('coldleads')}
          >
            {t.showColdLeads}
          </button>
        </div>
      </div>

      <div className={styles.leadsContainer}>
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
            <div key={lead.id} className={`${styles.leadCard} ${styles[lead.priority + 'Lead']}`}>
              <div className={styles.leadHeader}>
                <h3>
                  <span 
                    onClick={() => onShowCustomerProfile?.(lead.customerId)}
                    style={{cursor: 'pointer', textDecoration: 'underline'}}
                  >
                    {lead.customerName} - {lead.location}
                  </span>
                </h3>
                <span className={`${styles.priorityBadge} ${styles[lead.priority]}`}>
                  {priorityIcons[lead.priority]} {priorityLabels[lead.priority]}
                </span>
              </div>
              <div className={styles.leadDetails}>
                <p><strong>Contact:</strong> {lead.contact}</p>
                <p><strong>Business:</strong> {lead.business}</p>
                <p><strong>Inquiry:</strong> {lead.inquiry}</p>
                <p><strong>Budget:</strong> {lead.budget} | <strong>Timeline:</strong> {lead.timeline}</p>
                <p><strong>Last Contact:</strong> {lead.lastContact}</p>
              </div>

              {/* Related Quote and Order Information */}
              <div className={styles.leadMapping}>
                {relatedQuotes.length > 0 ? (
                  <div className={styles.mappingInfo}>
                    <p><strong>📄 Related Quotes ({relatedQuotes.length}):</strong></p>
                    {relatedQuotes.map((quote, index) => (
                      <p key={quote.id} style={{marginLeft: '20px', marginBottom: '8px'}}>
                        • <span className={styles.mappingLink} onClick={() => onShowQuotationOrders?.()}>
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
                            • <span className={styles.mappingLink} onClick={() => onShowSalesOrders?.()}>
                              {order.id}
                            </span> 
                            - {order.status} ({order.statusMessage})
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles.mappingInfo}>
                    <p><strong>📄 Quote Status:</strong> <span className={styles.noQuote}>No quotes created yet</span></p>
                  </div>
                )}
              </div>
              
              <div className={styles.leadActions}>
                <button className={`${styles.actionBtn} ${styles.callBtn}`}>📞 Call{lead.priority === 'hot' ? ' Now' : ''}</button>
                <button className={`${styles.actionBtn} ${styles.whatsappBtn}`}>💬 WhatsApp</button>
                <button className={`${styles.actionBtn} ${styles.quoteBtn}`} onClick={() => onShowQuoteFromLead?.(lead.id)}>
                  💰 {relatedQuotes.length > 0 ? `View Quotes (${relatedQuotes.length})` : 'Send Quote'}
                </button>
              </div>
              
              <div className={styles.leadNotes}>
                <p><strong>Notes:</strong> {lead.notes}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>{t.voiceCommandsHint}</strong> 
          "{t.addFabricInquiry}" • "{t.callRajesh}" • "{t.showCottonLeads}"
        </p>
      </div>
    </div>
  );
}

export default LeadManagement;