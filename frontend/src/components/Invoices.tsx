import React, { useState, useEffect } from 'react';
import ProductHeader from './ProductHeader';
import { 
  mockProformaInvoices, 
  mockFinalInvoices, 
  formatCurrency, 
  getBusinessProfileById
} from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/Invoices.module.css';

interface InvoicesProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
  onShowQuotationOrders?: () => void;
  onShowPayments?: () => void;
  onShowSalesOrders?: () => void;
  onShowCustomerProfile?: (customerId: string) => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

interface InvoiceRecord {
  id: string;
  type: 'proforma' | 'final';
  invoiceNumber: string;
  customerName: string;
  location: string;
  totalAmount: number;
  status: 'pending' | 'sent' | 'payment_received' | 'expired' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  relatedId?: string; // quoteId for proforma, salesOrderId for final
  contactInfo: string;
  paymentTerms: string;
  gstAmount?: number;
  netAmount?: number;
}

function Invoices({
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowQuotationOrders,
  onShowPayments,
  onShowSalesOrders,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: InvoicesProps) {
  const { t } = useTranslation();
  
  // Invoice type filter state
  const [invoiceType, setInvoiceType] = useState<'proforma' | 'final' | 'all'>('all');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create combined invoice records from both proforma and final invoices
  const createInvoiceRecords = (): InvoiceRecord[] => {
    const proformaRecords: InvoiceRecord[] = mockProformaInvoices.map(invoice => {
      const businessProfile = getBusinessProfileById(invoice.businessProfileId);
      
      return {
        id: invoice.id,
        type: 'proforma' as const,
        invoiceNumber: invoice.id, // Use ID as invoice number
        customerName: businessProfile?.companyName || `Company (${invoice.businessProfileId})`,
        location: businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Location not available',
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        relatedId: invoice.quoteId,
        contactInfo: businessProfile?.phone || 'No contact available',
        paymentTerms: 'Advance payment required', // Default for proforma invoices
        gstAmount: invoice.gstAmount,
        netAmount: invoice.subtotal // Use subtotal as net amount
      };
    });

    const finalRecords: InvoiceRecord[] = mockFinalInvoices.map(invoice => {
      const businessProfile = getBusinessProfileById(invoice.customerId);
      
      return {
        id: invoice.id,
        type: 'final' as const,
        invoiceNumber: invoice.id, // Use ID as invoice number
        customerName: businessProfile?.companyName || invoice.customerName,
        location: businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Location not available',
        totalAmount: invoice.totalAmount,
        status: invoice.status === 'paid' ? 'paid' : (invoice.status === 'pending' ? 'pending' : 'overdue'),
        issueDate: invoice.invoiceDate,
        dueDate: invoice.dueDate || invoice.invoiceDate, // Use invoice date if no due date
        relatedId: invoice.salesOrderId,
        contactInfo: businessProfile?.phone || 'No contact available',
        paymentTerms: 'As per sales order', // Default for final invoices
        gstAmount: invoice.gstAmount,
        netAmount: invoice.subtotal // Use subtotal as net amount
      };
    });

    return [...proformaRecords, ...finalRecords];
  };

  const allInvoiceRecords = createInvoiceRecords();

  // Filter invoice records based on both type and status
  const getFilteredInvoices = () => {
    let filtered = allInvoiceRecords;
    
    // Filter by invoice type
    if (invoiceType !== 'all') {
      filtered = filtered.filter(invoice => invoice.type === invoiceType);
    }
    
    // Filter by status
    if (filterState !== 'all') {
      filtered = filtered.filter(invoice => {
        if (filterState === 'pending') return invoice.status === 'pending' || invoice.status === 'sent';
        if (filterState === 'paid') return invoice.status === 'payment_received' || invoice.status === 'paid';
        if (filterState === 'expired') return invoice.status === 'expired';
        if (filterState === 'overdue') return invoice.status === 'overdue';
        return true;
      });
    }
    
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();

  const handleSendInvoice = (invoiceId: string, customerName: string, contactInfo: string) => {
    console.log(`Sending invoice ${invoiceId} to ${customerName} at ${contactInfo}`);
    // Implementation: Send invoice via WhatsApp/Email
  };

  const handleFollowUp = (invoiceId: string, customerName: string, contactInfo: string) => {
    console.log(`Following up on invoice ${invoiceId} with ${customerName}`);
    // Implementation: Send follow-up reminder
  };

  const getInvoiceStatusInfo = (status: InvoiceRecord['status']) => {
    switch (status) {
      case 'pending':
        return { 
          icon: '⏳', 
          label: 'Pending', 
          bgColor: '#fff3cd', 
          color: '#856404' 
        };
      case 'sent':
        return { 
          icon: '📤', 
          label: 'Sent', 
          bgColor: '#cce5ff', 
          color: '#0066cc' 
        };
      case 'payment_received':
      case 'paid':
        return { 
          icon: '✅', 
          label: 'Paid', 
          bgColor: '#d4edda', 
          color: '#155724' 
        };
      case 'expired':
        return { 
          icon: '🔴', 
          label: 'Expired', 
          bgColor: '#f8d7da', 
          color: '#721c24' 
        };
      case 'overdue':
        return { 
          icon: '⚠️', 
          label: 'Overdue', 
          bgColor: '#f8d7da', 
          color: '#721c24' 
        };
      default:
        return { 
          icon: '❓', 
          label: 'Unknown', 
          bgColor: '#f8f9fa', 
          color: '#6c757d' 
        };
    }
  };

  return (
    <div className={styles.invoicesScreen}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onHome={onNavigateHome}
        onDashboard={onNavigateBack}
        showDashboardButton={true}
        showThemeSelector={true}
      />
      
      <div className={styles.pageContent}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span onClick={onNavigateBack} className={styles.breadcrumbLink}>Dashboard</span>
          <span className={styles.breadcrumbSeparator}>→</span>
          <span className={styles.breadcrumbCurrent}>Invoices</span>
        </div>

        <h1 className={styles.centeredHeading}>📄 {t('invoices')}</h1>

        {/* Invoice Type Filter */}
        <div className={styles.filtersSection}>
          <div className={styles.filterLabel}>Invoice Type:</div>
          <div className={styles.filterButtons}>
            <button 
              className={invoiceType === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setInvoiceType('all')}
            >
              All Invoices
            </button>
            <button 
              className={invoiceType === 'proforma' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setInvoiceType('proforma')}
            >
              📋 Proforma
            </button>
            <button 
              className={invoiceType === 'final' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => setInvoiceType('final')}
            >
              📄 Final
            </button>
          </div>
        </div>

        {/* Status Filter Section */}
        <div className={styles.filtersSection}>
          <div className={styles.filterLabel}>Invoice Status:</div>
          <div className={styles.filterButtons}>
            <button 
              className={filterState === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('all')}
            >
              Show All
            </button>
            <button 
              className={filterState === 'pending' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('pending')}
            >
              ⏳ Pending
            </button>
            <button 
              className={filterState === 'paid' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('paid')}
            >
              ✅ Paid
            </button>
            <button 
              className={filterState === 'expired' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('expired')}
            >
              🔴 Expired
            </button>
            <button 
              className={filterState === 'overdue' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
              onClick={() => onFilterChange('overdue')}
            >
              ⚠️ Overdue
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>📄</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {allInvoiceRecords.length}
              </div>
              <div className={styles.summaryLabel}>Total Invoices</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>⏳</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {allInvoiceRecords.filter(i => i.status === 'pending' || i.status === 'sent').length}
              </div>
              <div className={styles.summaryLabel}>Pending Payment</div>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>💰</div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryValue}>
                {formatCurrency(allInvoiceRecords.reduce((sum, i) => sum + i.totalAmount, 0))}
              </div>
              <div className={styles.summaryLabel}>Total Invoice Value</div>
            </div>
          </div>
        </div>

        {/* Invoice Records */}
        <div className={styles.invoicesContainer}>
          {filteredInvoices.length === 0 ? (
            <div className={styles.noInvoices}>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📄</div>
                <h3>No invoices found</h3>
                <p>No invoices match the selected filter criteria.</p>
              </div>
            </div>
          ) : (
            filteredInvoices.map(invoice => {
              const statusInfo = getInvoiceStatusInfo(invoice.status);
              
              return (
                <div key={invoice.id} className={styles.invoiceCard}>
                  <div className={styles.invoiceHeader}>
                    <div className={styles.customerInfo}>
                      <h3 
                        className={styles.customerLink}
                        onClick={() => onShowCustomerProfile && onShowCustomerProfile(invoice.customerName.toLowerCase().replace(/\s/g, '-'))}
                      >
                        {invoice.customerName} - {invoice.location}
                      </h3>
                      <div className={styles.invoiceDetails}>
                        <span className={styles.invoiceNumber}>
                          {invoice.invoiceNumber}
                        </span>
                        <div className={styles.invoiceTypeBadge}>
                          {invoice.type === 'proforma' ? '📋 Proforma Invoice' : '📄 Final Invoice'}
                        </div>
                      </div>
                    </div>
                    <div 
                      className={styles.invoiceStatus}
                      style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color
                      }}
                    >
                      {statusInfo.icon} {statusInfo.label}
                    </div>
                  </div>

                  <div className={styles.invoiceDetails}>
                    <div className={styles.invoiceInfo}>
                      <div className={styles.detailRow}>
                        <strong>Issue Date:</strong> {invoice.issueDate}
                      </div>
                      <div className={styles.detailRow}>
                        <strong>Due Date:</strong> {invoice.dueDate}
                      </div>
                      {invoice.relatedId && (
                        <div className={styles.detailRow}>
                          <strong>
                            {invoice.type === 'proforma' ? 'Quote:' : 'Sales Order:'}
                          </strong> 
                          <span 
                            className={styles.relatedLink}
                            onClick={() => {
                              if (invoice.type === 'proforma' && onShowQuotationOrders) {
                                onShowQuotationOrders();
                              } else if (invoice.type === 'final' && onShowSalesOrders) {
                                onShowSalesOrders();
                              }
                            }}
                          >
                            {invoice.relatedId} →
                          </span>
                        </div>
                      )}
                      <div className={styles.detailRow}>
                        <strong>Payment Terms:</strong> {invoice.paymentTerms}
                      </div>
                    </div>

                    <div className={styles.amountBreakdown}>
                      {invoice.netAmount && (
                        <div className={styles.amountRow}>
                          <span>Net Amount:</span>
                          <strong>{formatCurrency(invoice.netAmount)}</strong>
                        </div>
                      )}
                      {invoice.gstAmount && (
                        <div className={styles.amountRow}>
                          <span>GST Amount:</span>
                          <strong>{formatCurrency(invoice.gstAmount)}</strong>
                        </div>
                      )}
                      <div className={`${styles.amountRow} ${styles.totalRow}`}>
                        <span>Total Amount:</span>
                        <strong className={styles.totalAmount}>
                          {formatCurrency(invoice.totalAmount)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Customer Contact Section */}
                  <div className={styles.customerContact}>
                    <div className={styles.contactHeader}>
                      <strong>Contact: {invoice.customerName.split(' ')[0]} - {invoice.contactInfo}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => console.log(`Viewing invoice ${invoice.invoiceNumber}`)}
                    >
                      📄 View PDF
                    </button>
                    <button 
                      className={styles.sendBtn}
                      onClick={() => handleSendInvoice(invoice.id, invoice.customerName, invoice.contactInfo)}
                    >
                      📱 Send Invoice
                    </button>
                    {invoice.type === 'proforma' && onShowPayments && (
                      <button 
                        className={styles.paymentsBtn}
                        onClick={() => onShowPayments()}
                      >
                        💰 View Payments
                      </button>
                    )}
                    {(invoice.status === 'sent' || invoice.status === 'pending' || invoice.status === 'overdue') && (
                      <button 
                        className={styles.followUpBtn}
                        onClick={() => handleFollowUp(invoice.id, invoice.customerName, invoice.contactInfo)}
                      >
                        📢 Follow Up
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Voice Commands Section */}
        <div className={styles.voiceSection}>
          <h3>Voice Commands</h3>
          <div className={styles.voiceCommands}>
            <div className={styles.voiceCommand}>
              <strong>"Show pending invoices"</strong> - Filter to pending payment invoices
            </div>
            <div className={styles.voiceCommand}>
              <strong>"Send invoice to [customer]"</strong> - Quick invoice sending
            </div>
            <div className={styles.voiceCommand}>
              <strong>"Show proforma invoices"</strong> - Filter to proforma invoices only
            </div>
            <div className={styles.voiceCommand}>
              <strong>"Follow up overdue"</strong> - Filter to overdue invoices
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoices;