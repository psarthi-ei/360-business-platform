import React, { useState, useCallback } from 'react';
import { 
  mockProformaInvoices, 
  mockFinalInvoices, 
  formatCurrency, 
  getBusinessProfileById
} from '../../data/mockData';
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
              
              // Determine customer status for visual differentiation
              const businessProfile = getBusinessProfileById(invoice.businessProfileId);
              const isCustomer = businessProfile?.customerStatus === 'customer';
              
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
                      Status: {statusInfo.icon} {statusInfo.label} • {isCustomer ? '✅ Customer' : '🔸 Prospect'}
                    </div>
                    
                    {/* Template Meta - 2 lines */}
                    <div 
                      className={styles.cardMeta}
                      title={`${invoice.location} • Due: ${invoice.dueDate} • Amount: ${formatCurrency(invoice.totalAmount)} • ${invoice.paymentTerms}`}
                    >
                      📍 {invoice.location} • Due: {invoice.dueDate}<br />
                      💰 {formatCurrency(invoice.totalAmount)} • {invoice.paymentTerms}
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