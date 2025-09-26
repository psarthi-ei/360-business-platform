import React from 'react';
import ProductHeader from './ProductHeader';
import { mockProformaInvoices, formatCurrency, getBusinessProfileById, ProformaInvoice } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/ProformaInvoiceManagement.module.css';

interface ProformaInvoiceManagementProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowQuotationOrders?: () => void;
  onShowAdvancePayments?: () => void;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function ProformaInvoiceManagement({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowQuotationOrders,
  onShowAdvancePayments,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: ProformaInvoiceManagementProps) {
  const { t } = useTranslation();

  // Filter proforma invoices based on filter state
  function getFilteredProformaInvoices() {
    return mockProformaInvoices.filter(invoice => {
      switch (filterState) {
        case 'pending': return invoice.status === 'pending';
        case 'sent': return invoice.status === 'sent';
        case 'paid': return invoice.status === 'payment_received';
        case 'expired': return invoice.status === 'expired';
        case 'all':
        default: return true;
      }
    });
  }

  const filteredInvoices = getFilteredProformaInvoices();

  // Get business profile details for display
  function getInvoiceDisplayData(invoice: ProformaInvoice) {
    const businessProfile = getBusinessProfileById(invoice.businessProfileId);
    return {
      companyName: businessProfile?.companyName || 'Unknown Company',
      location: businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Unknown Location',
      contactPerson: businessProfile?.contactPerson || 'Unknown Contact',
      mobile: businessProfile?.phone || 'No Contact'
    };
  }

  // Status badge styling
  function getStatusBadgeClass(status: string) {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'sent': return styles.statusSent;
      case 'payment_received': return styles.statusPaid;
      case 'expired': return styles.statusExpired;
      default: return styles.statusPending;
    }
  }

  // Handle proforma invoice actions
  function handleViewInvoice(invoiceId: string) {
    
    // Implementation for viewing invoice details
  }

  function handleDownloadInvoice(invoiceId: string) {
    
    // Implementation for downloading invoice
  }

  function handleViewQuote(quoteId: string) {
    
    if (onShowQuotationOrders) {
      onShowQuotationOrders();
    }
  }

  function handleViewAdvancePayments() {
    if (onShowAdvancePayments) {
      onShowAdvancePayments();
    }
  }

  return (
    <div className={styles.proformaInvoiceScreen}>
      {/* Header */}
      <ProductHeader 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />

      {/* Screen Header with Navigation */}
      <div className={styles.screenHeader}>
        <h1>{t('proformaInvoiceManagement')}</h1>
        <div className={styles.headerActions}>
          <button 
            className={styles.backButton} 
            onClick={onNavigateBack}
            type="button"
          >
            ← {t('back')}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${filterState === 'all' ? styles.active : ''}`}
            onClick={() => onFilterChange('all')}
            type="button"
          >
            {t('all')} ({mockProformaInvoices.length})
          </button>
          <button 
            className={`${styles.filterBtn} ${filterState === 'pending' ? styles.active : ''}`}
            onClick={() => onFilterChange('pending')}
            type="button"
          >
            {t('pending')} ({mockProformaInvoices.filter(pi => pi.status === 'pending').length})
          </button>
          <button 
            className={`${styles.filterBtn} ${filterState === 'sent' ? styles.active : ''}`}
            onClick={() => onFilterChange('sent')}
            type="button"
          >
            {t('sent')} ({mockProformaInvoices.filter(pi => pi.status === 'sent').length})
          </button>
          <button 
            className={`${styles.filterBtn} ${filterState === 'paid' ? styles.active : ''}`}
            onClick={() => onFilterChange('paid')}
            type="button"
          >
            {t('paid')} ({mockProformaInvoices.filter(pi => pi.status === 'payment_received').length})
          </button>
          <button 
            className={`${styles.filterBtn} ${filterState === 'expired' ? styles.active : ''}`}
            onClick={() => onFilterChange('expired')}
            type="button"
          >
            {t('expired')} ({mockProformaInvoices.filter(pi => pi.status === 'expired').length})
          </button>
        </div>
      </div>

      {/* Proforma Invoices Container */}
      <div className={styles.invoicesContainer}>
        {filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>{t('noProformaInvoicesFound')}</h3>
            <p>{t('checkFiltersOrCreateNewInvoices')}</p>
          </div>
        ) : (
          filteredInvoices.map(invoice => {
            const displayData = getInvoiceDisplayData(invoice);
            return (
              <div key={invoice.id} className={`${styles.invoiceCard} ${styles[`${invoice.status}Invoice`]}`}>
                {/* Invoice Header */}
                <div className={styles.invoiceHeader}>
                  <div className={styles.invoiceTitle}>
                    <h3>{invoice.id}</h3>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(invoice.status)}`}>
                      {t(invoice.status)}
                    </span>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className={styles.invoiceDetails}>
                  <p><strong>{t('company')}:</strong> {displayData.companyName}</p>
                  <p><strong>{t('location')}:</strong> {displayData.location}</p>
                  <p><strong>{t('contact')}:</strong> {displayData.contactPerson} - {displayData.mobile}</p>
                  <p><strong>{t('quoteId')}:</strong> {invoice.quoteId}</p>
                  <p><strong>{t('issueDate')}:</strong> {invoice.issueDate}</p>
                  <p><strong>{t('dueDate')}:</strong> {invoice.dueDate}</p>
                  <p><strong>{t('totalAmount')}:</strong> {formatCurrency(invoice.totalAmount)}</p>
                  <p><strong>{t('advanceAmount')}:</strong> {formatCurrency(invoice.advanceAmount)}</p>
                </div>

                {/* Invoice Actions */}
                <div className={styles.invoiceActions}>
                  <button 
                    className={`${styles.actionBtn} ${styles.viewBtn}`}
                    onClick={() => handleViewInvoice(invoice.id)}
                    type="button"
                  >
                    👁️ {t('view')}
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.downloadBtn}`}
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    type="button"
                  >
                    📄 {t('download')}
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.quoteBtn}`}
                    onClick={() => handleViewQuote(invoice.quoteId)}
                    type="button"
                  >
                    📋 {t('viewQuote')}
                  </button>
                  {onShowCustomerProfile && (
                    <button 
                      className={`${styles.actionBtn} ${styles.customerBtn}`}
                      onClick={() => onShowCustomerProfile(invoice.businessProfileId)}
                      type="button"
                    >
                      👤 {t('customer')}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions Section */}
      <div className={styles.quickActions}>
        <button 
          className={styles.quickActionBtn}
          onClick={onShowQuotationOrders}
          type="button"
        >
          📋 {t('viewQuotes')}
        </button>
        <button 
          className={styles.quickActionBtn}
          onClick={handleViewAdvancePayments}
          type="button"
        >
          💰 {t('viewAdvancePayments')}
        </button>
      </div>

      {/* Voice Commands Hint */}
      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 {t('voiceHint')}: "{t('showPendingInvoices')}", "{t('downloadInvoice')}", "{t('viewQuote')}"
        </p>
      </div>
    </div>
  );
}

export default ProformaInvoiceManagement;