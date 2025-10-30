import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { mockBusinessProfiles, formatCurrency, getBusinessProfileById } from '../../data/customerMockData';
import { 
  mockQuotes, 
  mockLeads, 
  mockSalesOrders,
  QuoteItem,
  Quote,
  calculateItemTotals
} from '../../data/salesMockData';
import { useTranslation } from '../../contexts/TranslationContext';
import { useCardExpansion } from '../../hooks/useCardExpansion';
import styles from './QuotationOrders.module.css';

interface QuotationOrdersProps {
  onShowSalesOrders: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  onShowLeadManagement?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
}

function QuotationOrders({
  onShowSalesOrders,
  onShowCustomerProfile,
  onShowLeadManagement,
  filterState,
  onFilterChange,
}: QuotationOrdersProps) {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Removed nested items expansion - items now shown directly in main expanded view
  
  // Get formatted items display for header (concise)
  const getQuoteItemsHeader = (quote: { items: QuoteItem[] }): string => {
    const items = quote.items;
    if (items.length === 1) {
      return `${items[0].description} (${items[0].quantity} ${items[0].unit})`;
    } else {
      // Show first item details + more count for multiple items
      const firstItem = items[0];
      const remainingCount = items.length - 1;
      return `${firstItem.description} (${firstItem.quantity} ${firstItem.unit}) + ${remainingCount} more items`;
    }
  };
  
  // Get formatted items display for details (comprehensive)
  const renderQuoteItemsDetails = (quote: { items: QuoteItem[] }) => {
    const items = quote.items;
    const totals = calculateItemTotals(items);
    
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
            <span className={styles.totalLabel}>GST (18%):</span>
            <span className={`${styles.totalValue} ${styles.totalTax}`}>{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className={styles.totalFinal}>
            <span className={styles.totalFinalLabel}>Grand Total:</span>
            <span className={styles.totalFinalValue}>
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper function to get company name from quote
  const getQuoteCompanyName = (quote: { businessProfileId?: string; leadId: string }) => {
    if (quote.businessProfileId) {
      const bp = getBusinessProfileById(quote.businessProfileId);
      return bp?.companyName || 'Unknown Company';
    }
    // For quotes without BusinessProfile, get from linked lead
    const lead = mockLeads.find(l => l.id === quote.leadId);
    if (lead?.businessProfileId) {
      const bp = getBusinessProfileById(lead.businessProfileId);
      return bp?.companyName || 'Unknown Company';
    }
    return 'Unknown Company';
  };

  // Helper function to get advance percentage from Quote data
  const getQuoteAdvancePercentage = (quote: Quote): number => {
    // Calculate percentage from Quote's advancePaymentRequired field
    if (quote.advancePaymentRequired && quote.totalAmount) {
      return Math.round((quote.advancePaymentRequired / quote.totalAmount) * 100);
    }
    return 0; // No advance data available
  };

  // Helper function to get company location from quote - Currently unused but kept for future enhancement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getQuoteCompanyLocation = (quote: { businessProfileId?: string; leadId: string }) => {
    if (quote.businessProfileId) {
      const bp = getBusinessProfileById(quote.businessProfileId);
      return bp ? `${bp.registeredAddress.city}, ${bp.registeredAddress.state}` : 'Unknown Location';
    }
    // For quotes without BusinessProfile, get from linked lead
    const lead = mockLeads.find(l => l.id === quote.leadId);
    if (lead?.businessProfileId) {
      const bp = getBusinessProfileById(lead.businessProfileId);
      return bp ? `${bp.registeredAddress.city}, ${bp.registeredAddress.state}` : 'Unknown Location';
    }
    return 'Unknown Location';
  };
  
  // Component state for workflow tracking
  const [workflowState, setWorkflowState] = useState({
    approvedQuotes: [] as string[],
    profileLinks: [] as {linkId: string, quoteId: string, expiresAt: Date}[],
    completedProfiles: [] as string[],
    processingQuotes: [] as string[]
  });
  const [workflowMessages, setWorkflowMessages] = useState<{[key: string]: string}>({});
  
  // Use card expansion hook for consistent single-card expansion behavior
  const { toggleExpansion, isExpanded } = useCardExpansion();
  
  // Use the hook's toggle function with our custom data attribute
  const toggleDetails = useCallback((quoteId: string) => {
    toggleExpansion(quoteId, 'data-quote-id');
  }, [toggleExpansion]);

  // Workflow Method 1: Handle Quote Approval
  const handleQuoteApproval = useCallback((quoteId: string) => {
    const quote = mockQuotes.find(q => q.id === quoteId);
    if (!quote) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Error: Quote not found'});
      return;
    }

    // Update quote status
    quote.status = 'approved';
    quote.approvalDate = new Date().toLocaleDateString();
    quote.statusMessage = 'Quote approved - Ready for next step';
    
    // Check if BusinessProfile already exists
    const existingProfile = quote.businessProfileId ? 
      mockBusinessProfiles.find(bp => bp.id === quote.businessProfileId) : null;

    if (existingProfile && existingProfile.customerStatus === 'customer') {
      // Customer already exists - can proceed directly to proforma invoice
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Quote approved! Customer exists - ready for proforma invoice.'});
    } else {
      // Prospect - need to collect business profile
      setWorkflowState(prev => ({
        ...prev,
        approvedQuotes: [...prev.approvedQuotes, quoteId]
      }));
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Quote approved! Send profile completion link to proceed.'});
    }
  }, [workflowMessages]);

  // Workflow Method 2: Handle Send Profile Link
  const handleSendProfileLink = useCallback((quoteId: string) => {
    const quote = mockQuotes.find(q => q.id === quoteId);
    if (!quote) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Error: Quote not found'});
      return;
    }

    // Generate secure profile link
    const linkId = 'LINK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const linkData = {
      linkId,
      quoteId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
    
    setWorkflowState(prev => ({
      ...prev,
      profileLinks: [...prev.profileLinks, linkData]
    }));

    // Create shareable WhatsApp message
    const profileUrl = `${window.location.origin}/profile-complete/${linkId}`;
    const whatsappMessage = `Hello ${getQuoteCompanyName(quote)}! 🏢\n\nThank you for approving our quote ${quoteId}. To proceed with your order, please complete your business profile using this secure link:\n\n${profileUrl}\n\n📋 This will take just 3 minutes\n🔒 Your information is secure\n⏰ Link expires in 7 days\n\nBest regards,\nElevateBusiness 360° Team`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    
    setWorkflowMessages({...workflowMessages, [quoteId]: `Profile link generated! Share via WhatsApp or copy: ${profileUrl}`});
    
    // Open WhatsApp sharing (optional)
    if (window.confirm('Open WhatsApp to share profile completion link?')) {
      window.open(whatsappUrl, '_blank');
    }
  }, [workflowMessages]);

  // Workflow Method 3: Handle Proforma Invoice Generation (for existing customers)
  const handleProformaGeneration = useCallback((quoteId: string) => {
    const quote = mockQuotes.find(q => q.id === quoteId);
    if (!quote || !quote.businessProfileId) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Error: Quote or customer not found'});
      return;
    }

    // Generate proforma invoice ID
    const proformaId = 'PI-' + Date.now();
    const advanceAmount = quote.advancePaymentRequired || 0;
    const advancePercentage = getQuoteAdvancePercentage(quote);
    
    // Update quote with proforma details
    quote.proformaInvoiceId = proformaId;
    quote.advancePaymentRequired = advanceAmount;
    quote.advancePaymentStatus = 'awaiting';
    quote.statusMessage = `Proforma invoice ${proformaId} generated. Advance payment of ${formatCurrency(advanceAmount)} (${advancePercentage}%) awaiting.`;
    
    setWorkflowMessages({...workflowMessages, [quoteId]: `Proforma invoice generated! Advance payment ${formatCurrency(advanceAmount)} requested.`});
  }, [workflowMessages]);

  // Workflow Method 4: Check Profile Completion Status
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkProfileStatus = useCallback((quoteId: string) => {
    const linkData = workflowState.profileLinks.find(pl => pl.quoteId === quoteId);
    if (!linkData) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'No profile link found for this quote'});
      return;
    }

    const isExpired = new Date() > linkData.expiresAt;
    const isCompleted = workflowState.completedProfiles.includes(quoteId);
    
    if (isCompleted) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Profile completed! Ready for proforma invoice generation.'});
    } else if (isExpired) {
      setWorkflowMessages({...workflowMessages, [quoteId]: 'Profile link expired. Generate new link.'});
    } else {
      const daysLeft = Math.ceil((linkData.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      setWorkflowMessages({...workflowMessages, [quoteId]: `Profile link active. ${daysLeft} days remaining.`});
    }
  }, [workflowState.profileLinks, workflowState.completedProfiles, workflowMessages]);

  // Auto-handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    const quoteId = params.get('quoteId');
    
    if (action === 'approve-quote' && quoteId) {
      handleQuoteApproval(quoteId);
    }
    
    // Clean URL after processing action
    if (action) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete('action');
      if (quoteId) newParams.delete('quoteId');
      window.history.replaceState({}, '', `${location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`);
    }
  }, [location, handleQuoteApproval]);

  
  return (
    <div className={styles.quotationOrdersScreen}>
      <div className={styles.pageContent}>

      <div className={styles.quotesContainer}>
        {mockQuotes.map(quote => {
          // Get related lead first for filtering and display logic
          const linkedLead = mockLeads.find(lead => lead.id === quote.leadId);
          
          // Enhanced filter logic - Hide quotes from leads converted to orders
          const isLeadConvertedToOrder = linkedLead?.conversionStatus === 'converted_to_order';
          
          const shouldShow = (
            !isLeadConvertedToOrder && // NEW: Hide quotes from converted leads
            (filterState === 'all' ||
             (filterState === 'pending' && quote.status === 'pending') ||
             (filterState === 'approved' && quote.status === 'approved') ||
             (filterState === 'expired' && quote.status === 'expired'))
          );

          if (!shouldShow) return null;

          const statusIcons = {
            pending: '⏳',
            under_review: '👁️',
            approved: '✅',
            rejected: '🚫',
            expired: '❌',
            proforma_sent: '📋',
            advance_requested: '💰',
            advance_overdue: '⚠️',
            advance_received: '✅',
            order_created: '🏭'
          };

          const statusLabels = {
            pending: t('pending') || 'Pending',
            under_review: 'Under Review',
            approved: t('approved') || 'Approved',
            rejected: 'Rejected',
            expired: t('expired') || 'Expired',
            proforma_sent: 'Proforma Sent',
            advance_requested: 'Advance Requested',
            advance_overdue: 'Payment Overdue',
            advance_received: 'Advance Received',
            order_created: 'Order Created'
          };
          
          const relatedOrder = mockSalesOrders.find(order => order.quoteId === quote.id);
          
          // Determine customer status for visual differentiation
          const businessProfile = quote.businessProfileId ? getBusinessProfileById(quote.businessProfileId) : null;
          const isCustomer = businessProfile?.customerStatus === 'customer';
          const isProspect = !businessProfile || businessProfile.customerStatus === 'prospect';

          return (
            <div key={quote.id} className="ds-card-container" data-quote-id={quote.id}>
              {/* Clickable Card Summary - Global Design System 140px Template */}
              <div 
                className={`ds-card ${quote.status === 'approved' ? 'ds-card-status-active' : (quote.status === 'pending' || quote.status === 'under_review') ? 'ds-card-status-pending' : quote.status === 'expired' ? 'ds-card-priority-high' : 'ds-card-status-inactive'} ${isExpanded(quote.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(quote.id)}
              >
                {/* Enhanced Header - Company Name + Items Context */}
                <div 
                  className="ds-card-header"
                  title={`${getQuoteCompanyName(quote)} - ${getQuoteItemsHeader(quote)} (Quote ID: ${quote.id})`}
                >
                  {getQuoteCompanyName(quote)} — {getQuoteItemsHeader(quote)}
                </div>
                
                {/* Enhanced Status - Quote Status + Payment Progress */}
                <div className="ds-card-status">
                  {statusIcons[quote.status]} {statusLabels[quote.status]} • {(() => {
                    const paymentLabels = {
                      not_requested: 'Payment Not Requested',
                      awaiting: '⏳ Payment Awaiting',
                      overdue: '⚠️ Payment Overdue', 
                      received: '✅ Payment Received'
                    };
                    return paymentLabels[quote.advancePaymentStatus as keyof typeof paymentLabels] || 'Pending';
                  })()}
                </div>
                
                {/* Business-Optimized Meta - Financial + Urgency + Timing */}
                <div 
                  className="ds-card-meta"
                  title={`${formatCurrency(quote.totalAmount)} • Due: ${quote.validUntil} • ${quote.quoteDate}`}
                >
                  {formatCurrency(quote.totalAmount)} • Due: {quote.validUntil}<br />
                  {quote.id} • {quote.quoteDate}
                </div>

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {isExpanded(quote.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Progressive Disclosure - Detailed Information */}
              {isExpanded(quote.id) && (
                <div className="ds-expanded-details">
                  <div className="ds-details-content">
                    {/* Enhanced Quote Details - Focus on NEW information not in card */}
                    <div className={styles.quoteDetailsSection}>
                      <p><strong>Status Details:</strong> {quote.statusMessage}</p>
                      {quote.advancePaymentRequired && (
                        <p><strong>Advance Required:</strong> {formatCurrency(quote.advancePaymentRequired)} ({Math.round((quote.advancePaymentRequired / quote.totalAmount) * 100)}%)</p>
                      )}
                    </div>

                    {/* Comprehensive Item Details - Always Visible */}
                    <div className={styles.itemsSection}>
                      <h4 className={styles.sectionTitle}>📋 Item Details</h4>
                      {renderQuoteItemsDetails(quote)}
                    </div>

                    {/* Related Lead and Order Information - Moved after item details */}
                    <div className={styles.quoteMapping}>
                      <div className={styles.mappingInfo}>
                        {linkedLead && (
                          <p><strong>📋 From Lead:</strong> 
                            <span className={styles.mappingLink} onClick={() => onShowLeadManagement?.()}>
                              {linkedLead.id}
                            </span> 
                          - {linkedLead.priority} priority ({linkedLead.budget})</p>
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
                  </div>
                  
                  {/* Action Buttons - Only visible when expanded */}
                  <div className={styles.cardActions}>
                    {/* Single-row button layout with natural wrapping */}
                    <div className={styles.actionButtons}>
                  <button className="ds-btn ds-btn-primary">
                    📞 Call
                  </button>
                  <button className="ds-btn ds-btn-primary">
                    📱 WhatsApp
                  </button>
                  <button className="ds-btn ds-btn-secondary">
                    📄 View PDF
                  </button>
                  
                  {/* Context-specific action based on quote status */}
                  {quote.status === 'pending' && isProspect && (
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={() => handleQuoteApproval(quote.id)}
                    >
                      ✅ Approve
                    </button>
                  )}
                  
                  {quote.status === 'approved' && isProspect && !workflowState.profileLinks.find(pl => pl.quoteId === quote.id) && (
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={() => handleSendProfileLink(quote.id)}
                    >
                      📝 Send Link
                    </button>
                  )}
                  
                  {quote.status === 'approved' && isCustomer && !relatedOrder && (
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={() => handleProformaGeneration(quote.id)}
                    >
                      📋 Proforma
                    </button>
                  )}
                  
                  {relatedOrder && (
                    <button className="ds-btn ds-btn-secondary" onClick={() => onShowSalesOrders()}>
                      📦 View Order
                    </button>
                  )}
                  
                  {quote.status === 'expired' && (
                    <button className="ds-btn ds-btn-secondary">
                      🔄 Renew
                    </button>
                  )}
                  
                </div>
                  </div>
                  
                  {/* Workflow Messages - Also only visible when expanded */}
                  {workflowMessages[quote.id] && (
                    <div className={styles.workflowMessage}>
                      💬 {workflowMessages[quote.id]}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default QuotationOrders;