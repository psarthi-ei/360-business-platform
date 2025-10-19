import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { mockQuotes, mockLeads, mockSalesOrders, formatCurrency, getBusinessProfileById, mockBusinessProfiles } from '../../data/mockData';
import { useTranslation } from '../../contexts/TranslationContext';
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
  
  // Component state for workflow tracking
  const [workflowState, setWorkflowState] = useState({
    approvedQuotes: [] as string[],
    profileLinks: [] as {linkId: string, quoteId: string, expiresAt: Date}[],
    completedProfiles: [] as string[],
    processingQuotes: [] as string[]
  });
  const [workflowMessages, setWorkflowMessages] = useState<{[key: string]: string}>({});
  
  // Progressive disclosure state for 140px template cards
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Sequential expansion toggle function - smooth visual flow
  const toggleDetails = useCallback(async (quoteId: string) => {
    if (expandedDetails.has(quoteId)) {
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
      setExpandedDetails(new Set([quoteId]));
      
      // Scroll to ensure the card is visible
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-quote-id="${quoteId}"]`);
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
    const whatsappMessage = `Hello ${quote.companyName}! 🏢\n\nThank you for approving our quote ${quoteId}. To proceed with your order, please complete your business profile using this secure link:\n\n${profileUrl}\n\n📋 This will take just 3 minutes\n🔒 Your information is secure\n⏰ Link expires in 7 days\n\nBest regards,\nElevateBusiness 360° Team`;
    
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
    const advanceAmount = Math.round(quote.totalAmount * 0.5); // 50% advance
    
    // Update quote with proforma details
    quote.proformaInvoiceId = proformaId;
    quote.advancePaymentRequired = advanceAmount;
    quote.advancePaymentStatus = 'awaiting';
    quote.statusMessage = `Proforma invoice ${proformaId} generated. Advance payment of ${formatCurrency(advanceAmount)} awaiting.`;
    
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

          const relatedLead = mockLeads.find(lead => lead.id === quote.leadId);
          const relatedOrder = mockSalesOrders.find(order => order.quoteId === quote.id);
          
          // Determine customer status for visual differentiation
          const businessProfile = quote.businessProfileId ? getBusinessProfileById(quote.businessProfileId) : null;
          const isCustomer = businessProfile?.customerStatus === 'customer';
          const isProspect = !businessProfile || businessProfile.customerStatus === 'prospect';

          return (
            <div key={quote.id} className={styles.quoteCardContainer} data-quote-id={quote.id}>
              {/* Clickable Card Summary - 140px Template */}
              <div 
                className={`${styles.quoteCard} ${styles[quote.status + 'Quote']} ${isCustomer ? styles.customerCard : styles.prospectCard} ${expandedDetails.has(quote.id) ? styles.expanded : ''}`}
                onClick={() => toggleDetails(quote.id)}
              >
                {/* Template Header - Company Name Only */}
                <div 
                  className={styles.cardHeader}
                  title={`${quote.companyName} (Quote ID: ${quote.id})`}
                >
                  {quote.companyName}
                </div>
                
                {/* Template Status */}
                <div className={styles.cardStatus}>
                  {statusIcons[quote.status]} {statusLabels[quote.status]} • {isCustomer ? '✅ Customer' : '🔸 Prospect'}
                </div>
                
                {/* Template Meta - 2 lines */}
                <div 
                  className={styles.cardMeta}
                  title={`${quote.items} • ${formatCurrency(quote.totalAmount)} • ${quote.id} • ${quote.quoteDate}`}
                >
                  {quote.items} • {formatCurrency(quote.totalAmount)}<br />
                  {quote.id} • {quote.quoteDate}
                </div>

                {/* Expand Indicator */}
                <div className={styles.expandIndicator}>
                  {expandedDetails.has(quote.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Progressive Disclosure - Detailed Information */}
              {expandedDetails.has(quote.id) && (
                <div className="ds-expanded-details">
                  <div className="ds-details-content">
                    <p><strong>Company:</strong> {quote.companyName} - {quote.location}</p>
                    <p><strong>{t('quoteDate')}:</strong> {quote.quoteDate} | <strong>{t('validUntil')}:</strong> {quote.validUntil}</p>
                    <p><strong>Items:</strong> {quote.items}</p>
                    <p><strong>{t('totalAmount')}:</strong> {formatCurrency(quote.totalAmount)} (incl. GST)</p>
                    <p><strong>Status:</strong> {quote.statusMessage}</p>
                    
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