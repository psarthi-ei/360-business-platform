import React, { useState, useCallback } from 'react';
import { formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockProformaInvoices, 
  mockFinalInvoices, 
  getAdvancePaymentByProformaId,
  mockFinalPayments,
  getFeatureToggleState,
  setFeatureToggle,
  isProformaWithStructuredItems,
  isFinalInvoiceWithStructuredItems,
  ProformaItem,
  InvoiceItem,
  calculateProformaItemTotals,
  calculateInvoiceItemTotals,
  ProformaInvoice,
  FinalInvoice
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

// Helper function to get original invoice data for structured items access
const getOriginalInvoiceData = (invoiceRecord: InvoiceRecord): ProformaInvoice | FinalInvoice | null => {
  if (invoiceRecord.type === 'proforma') {
    return mockProformaInvoices.find(inv => inv.id === invoiceRecord.id) || null;
  } else {
    return mockFinalInvoices.find(inv => inv.id === invoiceRecord.id) || null;
  }
};

function Invoices({
  onShowQuotationOrders,
  onShowPayments,
  onShowSalesOrders,
  onShowCustomerProfile,
  filterState,
  onFilterChange
}: InvoicesProps) {
  
  // Professional Invoice Display with Feature Toggle Support
  const [useStructuredData, setUseStructuredData] = useState(getFeatureToggleState('STRUCTURED_ITEMS_ENABLED'));
  
  // State for collapsible professional items sections
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Progressive disclosure state for 140px template cards
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Sequential expansion toggle function - smooth visual flow
  const toggleDetails = useCallback(async (invoiceId: string) => {
    if (expandedDetails.has(invoiceId)) {
      // Simple collapse - no sequencing needed
      setExpandedDetails(new Set());
      // Also collapse items section when main card collapses
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(invoiceId);
        return newSet;
      });
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

  // Handle toggle change
  const handleToggleChange = (enabled: boolean) => {
    setFeatureToggle('STRUCTURED_ITEMS_ENABLED', enabled);
    setUseStructuredData(enabled);
  };

  // Handle items section expansion toggle
  const toggleItemsExpansion = (invoiceId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(invoiceId)) {
        newSet.delete(invoiceId);
      } else {
        newSet.add(invoiceId);
      }
      return newSet;
    });
  };

  // Get formatted items display for header (concise)
  const getInvoiceItemsHeader = (invoice: InvoiceRecord): string => {
    if (useStructuredData) {
      const originalInvoice = getOriginalInvoiceData(invoice);
      
      // Handle Proforma Invoice
      if (invoice.type === 'proforma' && originalInvoice && isProformaWithStructuredItems(originalInvoice)) {
        const proformaInvoice = originalInvoice as ProformaInvoice;
        const items = proformaInvoice.itemsStructured as ProformaItem[];
        if (items.length === 1) {
          return `${items[0].description} (${items[0].quantity} ${items[0].unit})`;
        } else {
          // Show first item details + more count for multiple items
          const firstItem = items[0];
          const remainingCount = items.length - 1;
          return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
        }
      }
      
      // Handle Final Invoice
      if (invoice.type === 'final' && originalInvoice && isFinalInvoiceWithStructuredItems(originalInvoice)) {
        const finalInvoice = originalInvoice as FinalInvoice;
        const items = finalInvoice.items as InvoiceItem[];
        if (items.length === 1) {
          return `${items[0].description} (${items[0].quantity} ${items[0].unit})`;
        } else {
          // Show first item details + more count for multiple items
          const firstItem = items[0];
          const remainingCount = items.length - 1;
          return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
        }
      }
    }
    // Fallback to existing string display or basic info
    return 'Invoice items';
  };

  // Get formatted items display for details (comprehensive)
  const renderInvoiceItemsDetails = (invoice: InvoiceRecord) => {
    if (useStructuredData && invoice.type === 'proforma') {
      const originalInvoice = getOriginalInvoiceData(invoice);
      if (originalInvoice && isProformaWithStructuredItems(originalInvoice)) {
        const proformaInvoice = originalInvoice as ProformaInvoice;
        const items = proformaInvoice.itemsStructured as ProformaItem[];
        const totals = calculateProformaItemTotals(items);
      
      return (
        <div className={styles.itemsEnhanced}>
          <div className={styles.itemsList}>
            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.itemRowHeader}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCodeBadge}>
                        {item.itemCode}
                      </span>
                      <span className={styles.itemDescription}>
                        {item.description}
                      </span>
                    </div>
                    <div className={styles.itemDetails}>
                      <span>
                        <strong>HSN:</strong> {item.hsnCode}
                      </span>
                      <span>
                        <strong>Qty:</strong> {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      <span>
                        <strong>Rate:</strong> {formatCurrency(item.rate)}/{item.unit}
                      </span>
                    </div>
                  </div>
                  <div className={styles.itemAmount}>
                    <div className={styles.itemAmountValue}>
                      {formatCurrency(item.taxableAmount)}
                    </div>
                    {item.discount > 0 && (
                      <div className={styles.itemDiscount}>
                        -{item.discount}% discount
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.itemsTotals}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Subtotal (Before Tax):</span>
              <span className={styles.totalValue}>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>CGST (9%):</span>
              <span className={`${styles.totalValue} ${styles.totalTax}`}>{formatCurrency(totals.cgstAmount)}</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>SGST (9%):</span>
              <span className={`${styles.totalValue} ${styles.totalTax}`}>{formatCurrency(totals.sgstAmount)}</span>
            </div>
            <div className={styles.totalFinal}>
              <span className={styles.totalFinalLabel}>Grand Total:</span>
              <span className={styles.totalFinalValue}>
                {formatCurrency(totals.total)}
              </span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Advance Required (50%):</span>
              <span className={`${styles.totalValue} ${styles.totalAdvance}`}>{formatCurrency(totals.total * 0.5)}</span>
            </div>
          </div>
        </div>
      );
      }
    }
    
    // Handle Final Invoice structured items
    if (useStructuredData && invoice.type === 'final') {
      const originalInvoice = getOriginalInvoiceData(invoice);
      if (originalInvoice && isFinalInvoiceWithStructuredItems(originalInvoice)) {
        const finalInvoice = originalInvoice as FinalInvoice;
        const items = finalInvoice.items as InvoiceItem[];
        const totals = calculateInvoiceItemTotals(items);
      
        return (
          <div className={styles.itemsEnhanced}>
            <div className={styles.itemsList}>
              {items.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemRowHeader}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemCodeBadge}>
                          {item.itemCode}
                        </span>
                        <span className={styles.itemDescription}>
                          {item.description}
                        </span>
                      </div>
                      <div className={styles.itemDetails}>
                        <span>
                          <strong>HSN:</strong> {item.hsnCode}
                        </span>
                        <span>
                          <strong>Qty:</strong> {item.quantity.toLocaleString()} {item.unit}
                        </span>
                        <span>
                          <strong>Rate:</strong> {formatCurrency(item.rate)}/{item.unit}
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemAmount}>
                      <div className={styles.itemAmountValue}>
                        {formatCurrency(item.taxableAmount)}
                      </div>
                      {item.discount > 0 && (
                        <div className={styles.itemDiscount}>
                          -{item.discount}% discount
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.itemsTotals}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal:</span>
                <span className={styles.totalValue}>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total Discount:</span>
                  <span className={`${styles.totalValue} ${styles.totalDiscount}`}>-{formatCurrency(totals.totalDiscount)}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Taxable Amount:</span>
                <span className={styles.totalValue}>{formatCurrency(totals.taxableAmount)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>GST (5%):</span>
                <span className={`${styles.totalValue} ${styles.totalTax}`}>{formatCurrency(totals.totalTax)}</span>
              </div>
              <div className={styles.totalFinal}>
                <span className={styles.totalFinalLabel}>Final Amount:</span>
                <span className={styles.totalFinalValue}>
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>
        );
      }
    }
    
    // Fallback to existing string display
    return <p><strong>Items:</strong> No items specified</p>;
  };

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

        {/* Professional Display Toggle (Phase 2) */}
        <div className={styles.professionalToggle}>
          <span>Item Display:</span>
          <label className={styles.toggleButton}>
            <input 
              type="checkbox" 
              checked={useStructuredData}
              onChange={(e) => handleToggleChange(e.target.checked)}
            />
            <span className={styles.toggleSlider}>
              {useStructuredData ? 'Professional' : 'Basic'}
            </span>
          </label>
        </div>

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
                <div key={invoice.id} className="ds-card-container" data-invoice-id={invoice.id}>
                  {/* Clickable Card Summary - Global Design System 140px Template */}
                  <div 
                    className={`ds-card ${invoice.status === 'paid' || invoice.status === 'payment_received' ? 'ds-card-status-active' : invoice.status === 'overdue' || invoice.status === 'expired' ? 'ds-card-priority-high' : invoice.status === 'sent' ? 'ds-card-priority-low' : 'ds-card-status-pending'} ${expandedDetails.has(invoice.id) ? 'ds-card-expanded' : ''}`}
                    onClick={() => toggleDetails(invoice.id)}
                  >
                    {/* Enhanced Header - Customer Name + Financial Value */}
                    <div 
                      className="ds-card-header"
                      title={`${invoice.customerName} - ${formatCurrency(invoice.totalAmount)} (Invoice ID: ${invoice.invoiceNumber})`}
                    >
                      {invoice.customerName} — {formatCurrency(invoice.totalAmount)}
                    </div>
                    
                    {/* Template Status */}
                    <div className="ds-card-status">
                      {invoice.type === 'proforma' ? '📋 Proforma' : '📄 Final'} • {statusInfo.icon} {statusInfo.label}
                    </div>
                    
                    {/* Business-Optimized Meta - Financial Value + Urgency + Reference */}
                    <div 
                      className="ds-card-meta"
                      title={`${formatCurrency(invoice.totalAmount)} • ${formatDueDate(invoice.dueDate, invoice.status)} • ${invoice.invoiceNumber}`}
                    >
                      {formatCurrency(invoice.totalAmount)} • {formatDueDate(invoice.dueDate, invoice.status)}<br />
                      {invoice.invoiceNumber} • {invoice.issueDate}
                    </div>

                    {/* Expand Indicator */}
                    <div className="ds-card-expand-indicator">
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

                      {/* Professional Items Display Section (Phase 2) - Moved before related records for better UX */}
                      <div className={styles.professionalItemsSection}>
                        <div 
                          className={styles.itemsToggleHeader}
                          onClick={() => toggleItemsExpansion(invoice.id)}
                        >
                          <div className={styles.itemsHeaderContent}>
                            <span className={styles.itemsHeaderIcon}>📋</span>
                            <div className={styles.itemsHeaderText}>
                              <h4>Item Details</h4>
                              <p>{getInvoiceItemsHeader(invoice)}</p>
                            </div>
                          </div>
                          <div className={`${styles.itemsExpandIcon} ds-card-expand-indicator`}>
                            {expandedItems.has(invoice.id) ? '▼' : '▶'}
                          </div>
                        </div>
                        
                        {expandedItems.has(invoice.id) && (
                          <div className={styles.itemsContent}>
                            {renderInvoiceItemsDetails(invoice)}
                          </div>
                        )}
                      </div>

                      {/* Related Record Information - Moved after item details */}
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
                          : mockFinalPayments.find(p => p.finalInvoiceId === invoice.id);
                        
                        if (!paymentData) return null;
                        
                        return (
                          <div className={styles.relationshipSection}>
                            <h4>💰 Payment Details</h4>
                            <div className={styles.detailsGrid}>
                              <p><strong>Payment Method:</strong> {paymentData.paymentMethod}</p>
                              <p><strong>Payment Date:</strong> {'paymentDate' in paymentData ? paymentData.paymentDate : (paymentData.receivedDate || paymentData.dueDate)}</p>
                              <p><strong>Amount Paid:</strong> {formatCurrency('paymentDate' in paymentData ? paymentData.amount : (paymentData.receivedAmount || paymentData.amount))}</p>
                              <p><strong>Transaction Reference:</strong> {paymentData.transactionReference}</p>
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