import React from 'react';
import ProductHeader from './ProductHeader';
import { mockQuotes, mockLeads, mockSalesOrders, formatCurrency } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/QuotationOrders.module.css';

interface QuotationOrdersProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  onShowLeadManagement?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function QuotationOrders({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowSalesOrders,
  onShowCustomerProfile,
  onShowLeadManagement,
  filterState,
  onFilterChange
}: QuotationOrdersProps) {
  const { t } = useTranslation();
  
  return (
    <div className={styles.quotationOrdersScreen}>
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
        <div className={styles.screenHeader}>
          <h1 className={styles.centeredHeading}>📄 {t('quotationOrders')}</h1>
          <button className={styles.addButton}>{t('addNewQuote')}</button>
        </div>

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
            {t('showPending')}
          </button>
          <button 
            className={filterState === 'approved' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('approved')}
          >
            {t('showApproved')}
          </button>
          <button 
            className={filterState === 'expired' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('expired')}
          >
            {t('showExpired')}
          </button>
        </div>
      </div>

      <div className={styles.quotesContainer}>
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
            expired: '❌',
            rejected: '🚫',
            converted_to_proforma: '📋'
          };

          const statusLabels = {
            pending: t('pending'),
            approved: t('approved'),
            expired: t('expired'),
            rejected: 'Rejected',
            converted_to_proforma: 'Converted'
          };

          const relatedLead = mockLeads.find(lead => lead.id === quote.leadId);
          const relatedOrder = mockSalesOrders.find(order => order.quoteId === quote.id);

          return (
            <div key={quote.id} className={`${styles.quoteCard} ${styles[quote.status + 'Quote']}`}>
              <div className={styles.quoteHeader}>
                <h3>
                  <span 
                    onClick={() => {
                      // Navigate to customer profile if quote is linked to a BusinessProfile
                      if (quote.businessProfileId) {
                        onShowCustomerProfile(quote.businessProfileId);
                      }
                    }}
                    style={{cursor: quote.businessProfileId ? 'pointer' : 'default', textDecoration: quote.businessProfileId ? 'underline' : 'none'}}
                    title={quote.businessProfileId ? 'View customer profile' : 'Not yet converted to customer'}
                  >
                    {quote.id} - {quote.companyName}
                  </span>
                </h3>
                <span className={`${styles.statusBadge} ${styles[quote.status]}`}>
                  {statusIcons[quote.status]} {statusLabels[quote.status]}
                </span>
              </div>
              <div className={styles.quoteDetails}>
                <p><strong>Company:</strong> {quote.companyName} - {quote.location}</p>
                <p><strong>{t('quoteDate')}:</strong> {quote.quoteDate} | <strong>{t('validUntil')}:</strong> {quote.validUntil}</p>
                <p><strong>Items:</strong> {quote.items}</p>
                <p><strong>{t('totalAmount')}:</strong> {formatCurrency(quote.totalAmount)} (incl. GST)</p>
                <p><strong>Status:</strong> {quote.statusMessage}</p>
              </div>

              {/* Related Lead and Order Information */}
              <div className={styles.quoteMapping}>
                <div className={styles.mappingInfo}>
                  {relatedLead && (
                    <p><strong>📋 From Lead:</strong> 
                      <span className={styles.mappingLink} onClick={() => onShowLeadManagement?.()}>
                        {relatedLead.id}
                      </span> 
                    - {relatedLead.priority} priority ({relatedLead.budget})</p>
                  )}
                  {relatedOrder ? (
                    <p><strong>📦 Converted to Order:</strong> 
                      <span className={styles.mappingLink} onClick={() => onShowSalesOrders()}>
                        {relatedOrder.id}
                      </span> 
                    - {relatedOrder.status} ({relatedOrder.statusMessage})</p>
                  ) : (
                    <p><strong>📦 Order Status:</strong> <span className={styles.noOrder}>Not converted to order yet</span></p>
                  )}
                </div>
              </div>
              
              <div className={styles.quoteActions}>
                <button className={`${styles.actionBtn} ${styles.viewBtn}`}>📄 {t('viewPDF')}</button>
                {quote.status === 'pending' && (
                  <button className={`${styles.actionBtn} ${styles.approveBtn}`}>✅ {t('approve')}</button>
                )}
                {(quote.status === 'approved' || quote.status === 'pending') && (
                  <button className={`${styles.actionBtn} ${styles.convertBtn}`} onClick={() => onShowSalesOrders()}>
                    🔄 {relatedOrder ? 'View Order' : t('convertToOrder')}
                  </button>
                )}
                {quote.status === 'expired' && (
                  <button className={`${styles.actionBtn} ${styles.approveBtn}`}>🔄 Renew Quote</button>
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
          "{t('createQuoteRajesh')}" • "{t('showApprovedQuotes')}" • "{t('convertToOrder')}"
        </p>
      </div>
    </div>
  );
}

export default QuotationOrders;