import React, { useState, useCallback } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockProformaInvoices, 
  mockFinalInvoices, 
  getAdvancePaymentByProformaId,
  mockAdvancePayments
} from '../../data/salesMockData';
import styles from './Invoices.module.css';

interface InvoicesProps {
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
  businessProfileId: string; // For customer status lookup
}

function Invoices({
  onShowQuotationOrders,
  onShowPayments,
  onShowSalesOrders,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: InvoicesProps) {
  
  // Progressive disclosure state for 140px template cards
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Sequential expansion toggle function - smooth visual flow
  const toggleDetails = useCallback(async (invoiceId: string) => {
    if (expandedDetails.has(invoiceId)) {
      // Simple collapse - no sequencing needed
      setExpandedDetails(new Set());
    } else {
      // Sequential: First collapse any open card
      if (expandedDetails.size > 0) {
        setExpandedDetails(new Set());
        // Wait for collapse animation to complete
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Then expand the new card
      setExpandedDetails(new Set([invoiceId]));
      
      // Scroll to ensure the card is visible
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-invoice-id="${invoiceId}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }, [expandedDetails]);

  // Create combined invoice records from both proforma and final invoices
  const createInvoiceRecords = (): InvoiceRecord[] => {
    const proformaRecords: InvoiceRecord[] = mockProformaInvoices.map(invoice => {
      const businessProfile = getBusinessProfileById(invoice.businessProfileId);
      
      return {
        id: invoice.id,
        type: 'proforma' as const,
        invoiceNumber: invoice.id, // Use ID as invoice number
        customerName: businessProfile?.companyName || `Customer ${invoice.businessProfileId}`,
        location: businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Location not available',
        totalAmount: invoice.totalAmount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        relatedId: invoice.quoteId,
        contactInfo: businessProfile?.phone || 'No contact available',
        paymentTerms: 'Advance payment required', // Default for proforma invoices
        gstAmount: invoice.gstAmount,
        netAmount: invoice.subtotal, // Use subtotal as net amount
        businessProfileId: invoice.businessProfileId
      };
    });

    const finalRecords: InvoiceRecord[] = mockFinalInvoices.map(invoice => {
      const businessProfile = getBusinessProfileById(invoice.businessProfileId);
      
      return {
        id: invoice.id,
        type: 'final' as const,
        invoiceNumber: invoice.id, // Use ID as invoice number
        customerName: businessProfile?.companyName || `Customer ${invoice.businessProfileId}`,
        location: businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Location not available',
        totalAmount: invoice.totalAmount,
        status: invoice.status === 'paid' ? 'paid' : (invoice.status === 'pending' ? 'pending' : 'overdue'),
        issueDate: invoice.invoiceDate,
        dueDate: invoice.dueDate || invoice.invoiceDate, // Use invoice date if no due date
        relatedId: invoice.salesOrderId,
        contactInfo: businessProfile?.phone || 'No contact available',
        paymentTerms: 'As per sales order', // Default for final invoices
        gstAmount: invoice.gstAmount,
        netAmount: invoice.subtotal, // Use subtotal as net amount
        businessProfileId: invoice.businessProfileId
      };
    });

    return [...proformaRecords, ...finalRecords];
  };

  const allInvoiceRecords = createInvoiceRecords();

  // Filter invoice records based on status
  const getFilteredInvoices = () => {
    let filtered = allInvoiceRecords;
    
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



  const handleFollowUp = (invoiceId: string, customerName: string, contactInfo: string) => {
    
    // Implementation: Send follow-up reminder
  };

  const formatDueDate = (dueDate: string, status: InvoiceRecord['status']): string => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // For paid invoices, show "Paid on" with the date
    if (status === 'paid' || status === 'payment_received') {
      return `Paid on ${date.toLocaleDateString('en-IN')}`;
    }
    
    // For unpaid invoices, show urgency messaging
    switch (status) {
      case 'pending':
      case 'sent':
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        if (diffDays === 0) return 'Due today';
        return `Due by ${date.toLocaleDateString('en-IN')}`;
        
      case 'overdue':
        return `${Math.abs(diffDays)} days overdue`;
        
      case 'expired':
        return 'Expired';
        
      default:
        return date.toLocaleDateString('en-IN');
    }
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
      <div className={styles.pageContent}>

        {/* Invoice Records - 140px Template */}
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
                <div key={invoice.id} className={styles.invoiceCardContainer} data-invoice-id={invoice.id}>
                  {/* Clickable Card Summary - 140px Template */}
                  <div 
                    className={`${styles.invoiceCard} ${styles[invoice.status + 'Invoice']} ${expandedDetails.has(invoice.id) ? styles.expanded : ''}`}
                    onClick={() => toggleDetails(invoice.id)}
                  >
                    {/* Template Header - Company Name Only */}
                    <div 
                      className={styles.cardHeader}
                      title={`${invoice.customerName} (Invoice ID: ${invoice.invoiceNumber})`}
                    >
                      {invoice.customerName}
                    </div>
                    
                    {/* Template Status */}
                    <div className={styles.cardStatus}>
                      {invoice.type === 'proforma' ? '📋 Proforma' : '📄 Final'} • {statusInfo.icon} {statusInfo.label}
                    </div>
                    
                    {/* Template Meta - Business Critical Information */}
                    <div 
                      className={styles.cardMeta}
                      title={`${invoice.type} Invoice • Amount: ${formatCurrency(invoice.totalAmount)} • Due: ${invoice.dueDate} • ${invoice.invoiceNumber}`}
                    >
                      {invoice.type === 'proforma' ? 'Proforma' : 'Final Invoice'} • ₹{invoice.totalAmount.toLocaleString()}<br />
                      {formatDueDate(invoice.dueDate, invoice.status)} • {invoice.invoiceNumber}
                    </div>

                    {/* Expand Indicator */}
                    <div className={styles.expandIndicator}>
                      {expandedDetails.has(invoice.id) ? 'Less' : 'More'}
                    </div>
                  </div>

                  {/* Expanded Details - Match LeadManagement Structure */}
                  {expandedDetails.has(invoice.id) && (
                    <div className={styles.expandedSection}>
                      {/* Invoice Details Section */}
                      <div className={styles.invoiceDetailsSection}>
                        <h4>Invoice Details</h4>
                        <div className={styles.detailsGrid}>
                          <p><strong>Company:</strong> {invoice.customerName} - {invoice.location}</p>
                          <p><strong>Issue Date:</strong> {invoice.issueDate} | <strong>Due Date:</strong> {invoice.dueDate}</p>
                          <p><strong>Type:</strong> {invoice.type === 'proforma' ? '📋 Proforma Invoice' : '📄 Final Invoice'}</p>
                          <p><strong>Amount:</strong> {formatCurrency(invoice.totalAmount)} (incl. GST)</p>
                          <p><strong>Status:</strong> {statusInfo.label}</p>
                        </div>
                      </div>

                      {/* Related Record Information */}
                      {invoice.relatedId && (
                        <div className={styles.relationshipSection}>
                          <h4>Related Records</h4>
                          <div className={styles.detailsGrid}>
                            <p>
                              <strong>
                                {invoice.type === 'proforma' ? '📋 From Quote:' : '📦 From Order:'}
                              </strong> 
                              <span 
                                className={styles.mappingLink}
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
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Payment Details Section - For Paid Invoices */}
                      {(invoice.status === 'paid' || invoice.status === 'payment_received') && (() => {
                        // Get payment data for this invoice
                        const paymentData = invoice.type === 'proforma' 
                          ? getAdvancePaymentByProformaId(invoice.id)
                          : mockAdvancePayments.find(p => p.businessProfileId === invoice.businessProfileId);
                        
                        if (!paymentData) return null;
                        
                        return (
                          <div className={styles.relationshipSection}>
                            <h4>💰 Payment Details</h4>
                            <div className={styles.detailsGrid}>
                              <p><strong>Payment Method:</strong> {paymentData.paymentMethod}</p>
                              <p><strong>Payment Date:</strong> {paymentData.receivedDate || paymentData.dueDate}</p>
                              <p><strong>Amount Paid:</strong> {formatCurrency(paymentData.receivedAmount || paymentData.amount)}</p>
                              <p><strong>Bank Reference:</strong> {paymentData.bankReference}</p>
                              <p>
                                <strong>Payment ID:</strong> 
                                <span 
                                  className={styles.mappingLink}
                                  onClick={() => {
                                    if (onShowPayments) onShowPayments();
                                  }}
                                >
                                  {paymentData.id} →
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Action Buttons - Proper 44px Touch Targets */}
                      <div className={styles.expandedActions}>
                        <button className="ds-btn ds-btn-secondary">
                          📞 Call
                        </button>
                        <button className="ds-btn ds-btn-secondary">
                          📱 WhatsApp
                        </button>
                        <button className="ds-btn ds-btn-primary">
                          📄 View PDF
                        </button>
                        
                        {/* Type-specific actions */}
                        {invoice.type === 'proforma' && onShowPayments && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => onShowPayments()}
                          >
                            💰 View Payments
                          </button>
                        )}
                        
                        {invoice.type === 'final' && invoice.status === 'paid' && (
                          <button className="ds-btn ds-btn-secondary">
                            📋 Delivery Receipt
                          </button>
                        )}
                        
                        {(invoice.status === 'sent' || invoice.status === 'pending' || invoice.status === 'overdue') && (
                          <button 
                            className="ds-btn ds-btn-primary"
                            onClick={() => handleFollowUp(invoice.id, invoice.customerName, invoice.contactInfo)}
                          >
                            📢 Follow Up
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

export default Invoices;