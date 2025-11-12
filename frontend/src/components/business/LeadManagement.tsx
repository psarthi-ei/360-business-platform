import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadModal from './AddLeadModal';
import GenerateQuoteModal from './GenerateQuoteModal';
import EditQuoteModal from './EditQuoteModal';
import AddNotesModal from './AddNotesModal';
import RequestedItemCard from './RequestedItemCard';
import { mockLeads, Lead, Quote } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import { calculateItemPrice } from '../../data/catalogMockData';
import { useTranslation } from '../../contexts/TranslationContext';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import QuoteService from '../../services/QuoteService';
import styles from './LeadManagement.module.css';

interface LeadManagementProps {
  mobile?: boolean;
  onShowCustomerProfile?: (customerId: string) => void;
  onShowQuoteFromLead?: (leadId: string) => void;
  onShowQuotationOrders?: () => void;
  onShowSalesOrders?: () => void;
  filterState: string;
  onFilterChange: (filter: string) => void;
  openAddModal?: boolean;
  onAddModalHandled?: () => void;
}

function LeadManagement({
  mobile,
  onShowCustomerProfile,
  onShowQuoteFromLead,
  onShowQuotationOrders,
  onShowSalesOrders,
  filterState,
  onFilterChange,
  openAddModal,
  onAddModalHandled,
}: LeadManagementProps) {
  const { t } = useTranslation();
  const terms = useTerminologyTerms();
  const location = useLocation();
  
  // State for modal and leads - Filter out converted leads for active display
  const [showAddModal, setShowAddModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(
    mockLeads.filter(lead => lead.conversionStatus !== 'converted_to_order')
  );
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Mobile UX V2: Progressive disclosure state
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Quote modal state - unified modal with mode support
  const [quoteModal, setQuoteModal] = useState<{
    open: boolean;
    lead: Lead | null;
    mode: 'generate' | 'view';
    quote?: Quote;
  }>({ open: false, lead: null, mode: 'generate' });
  
  // Edit Quote modal state - separate modal for dedicated editing
  const [editQuoteModal, setEditQuoteModal] = useState<{
    open: boolean;
    lead: Lead | null;
    quote: Quote | null;
  }>({ open: false, lead: null, quote: null });
  
  // Notes modal state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<Lead | null>(null);

  // Auto-open modal based on URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    
    if (action === 'add-lead') {
      setShowAddModal(true);
      
      // Clean URL after processing action
      const newParams = new URLSearchParams(location.search);
      newParams.delete('action');
      window.history.replaceState({}, '', `${location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`);
    }
  }, [location]);

  // Auto-open modal based on voice command prop
  useEffect(() => {
    if (openAddModal) {
      setShowAddModal(true);
      // Notify parent that we handled the prop
      if (onAddModalHandled) {
        onAddModalHandled();
      }
    }
  }, [openAddModal, onAddModalHandled]);

  // Generate unique lead ID
  const generateLeadId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `LEAD-${year}-${timestamp}-${random}`;
  };

  // Get customer type indicator based on BusinessProfile status (single source of truth)
  const getCustomerTypeIndicator = (lead: Lead) => {
    const businessProfile = getBusinessProfileById(lead.businessProfileId);
    if (!businessProfile) return '❓ Unknown';
    
    return businessProfile.customerStatus === 'prospect' ? `🆕 New ${terms.customer}` : `🔄 Existing ${terms.customer}`;
  };

  // Calculate total value for requested items
  const calculateTotalValue = (lead: Lead) => {
    if (!lead.requestedItems || lead.requestedItems.length === 0) {
      return { totalValue: 0, itemCount: 0, calculatedItemCount: 0 };
    }

    let totalValue = 0;
    let successfulCalculations = 0;

    lead.requestedItems.forEach(item => {
      try {
        const calculation = calculateItemPrice(item.masterItemId, item.requestedQuantity, lead.leadType);
        totalValue += calculation.finalPrice;
        successfulCalculations++;
      } catch {
        // Skip items that can't be calculated
      }
    });

    return { 
      totalValue, 
      itemCount: lead.requestedItems.length,
      calculatedItemCount: successfulCalculations 
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // PHASE 2.1: Dynamic Quote Actions based on Quote State
  const renderDynamicQuoteActions = (lead: Lead) => {
    const quoteState = QuoteService.getQuoteStateForLead(lead.id, { quote: terms.quote, generateQuote: terms.generateQuote });
    const availableActions = quoteState.availableActions;

    if (availableActions.length === 0) {
      return null; // No quote actions available
    }

    return availableActions.map((action) => (
      <button
        key={action.action}
        className={action.buttonClass}
        onClick={(e) => {
          e.stopPropagation();
          handleQuoteAction(action.action, lead);
        }}
      >
        {action.label}
      </button>
    ));
  };

  // Quote Action Handler
  const handleQuoteAction = (actionType: string, lead: Lead) => {
    switch (actionType) {
      case 'generate':
        handleGenerateQuote(lead);
        break;
      case 'view':
        handleViewQuote(lead);
        break;
      case 'send':
        handleSendQuote(lead);
        break;
      case 'approve':
        handleApproveQuote(lead);
        break;
      case 'generate_proforma':
        handleGenerateProforma(lead);
        break;
      case 'create_job_order':
        handleCreateJobOrder(lead);
        break;
      default:
        // Unknown quote action - no handler available
    }
  };

  // Quote Action Implementations (Phase 2.2)
  const handleGenerateQuote = (lead: Lead) => {
    setQuoteModal({ open: true, lead, mode: 'generate' });
  };

  const handleViewQuote = (lead: Lead) => {
    const quoteState = QuoteService.getQuoteStateForLead(lead.id);
    if (quoteState.activeQuoteId) {
      const quote = QuoteService.getQuoteById(quoteState.activeQuoteId);
      setQuoteModal({ 
        open: true, 
        lead, 
        mode: 'view',
        quote
      });
    } else {
      alert('No active quote found for this lead');
    }
  };

  // Edit functionality is available through the view modal -> edit transition

  const handleSendQuote = (lead: Lead) => {
    // Send quote logic to be implemented
    // TODO: Implement quote sending
    alert('Send Quote - Implementation coming soon!');
  };

  const handleApproveQuote = (lead: Lead) => {
    // Approve quote logic to be implemented
    // TODO: Implement quote approval
    alert('Approve Quote - Implementation coming soon!');
  };

  const handleGenerateProforma = (lead: Lead) => {
    // Generate proforma logic to be implemented
    // TODO: Implement proforma generation
    alert('Generate Proforma - Implementation coming soon!');
  };

  const handleCreateJobOrder = (lead: Lead) => {
    // Create job order directly for job work (skip proforma)
    const quoteState = QuoteService.getQuoteStateForLead(lead.id);
    if (quoteState.activeQuoteId) {
      // Update quote status to indicate order creation
      const quote = QuoteService.getQuoteById(quoteState.activeQuoteId);
      if (quote) {
        quote.status = 'order_created';
        quote.statusMessage = 'Job order created - Processing started';
        
        // Update lead conversion status
        const conversionDate = new Date().toISOString();
        const updatedLeads = leads.map(l => 
          l.id === lead.id 
            ? { ...l, conversionStatus: 'converted_to_order' as const, convertedToOrderDate: conversionDate }
            : l
        );
        setLeads(updatedLeads);
        
        setSuccessMessage(`Job Order created successfully for ${lead.contactPerson}!`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } else {
      alert('No active quote found to convert to job order');
    }
  };

  // Handle adding new lead
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'conversionStatus' | 'convertedToOrderDate'>) => {
    const newLead: Lead = {
      ...leadData,
      id: generateLeadId(),
      conversionStatus: 'active_lead',
      convertedToOrderDate: undefined
    };

    // Add new lead to the beginning of the list
    setLeads(prev => [newLead, ...prev]);
    
    // Show success message
    setSuccessMessage(`Lead for "${newLead.contactPerson}" has been successfully added!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Quote modal handlers
  const handleCloseQuoteModal = () => {
    setQuoteModal({ open: false, lead: null, mode: 'generate' });
  };
  
  const handleCloseEditQuoteModal = () => {
    setEditQuoteModal({ open: false, lead: null, quote: null });
  };

  const handleQuoteGenerated = (quoteId: string) => {
    // Show success message
    setSuccessMessage(`Quote ${quoteId} generated successfully!`);
    
    // Close modal
    handleCloseQuoteModal();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };
  
  const handleQuoteUpdated = (quoteId: string) => {
    // Show success message
    setSuccessMessage(`Quote ${quoteId} updated successfully!`);
    
    // Get the updated quote and lead data
    const currentLead = editQuoteModal.lead;
    const updatedQuote = QuoteService.getQuoteById(quoteId);
    
    // Close edit modal
    handleCloseEditQuoteModal();
    
    // Reopen view modal with updated data to show changes
    if (currentLead && updatedQuote) {
      setTimeout(() => {
        setQuoteModal({
          open: true,
          lead: currentLead,
          mode: 'view',
          quote: updatedQuote
        });
      }, 100); // Small delay to ensure edit modal closes first
    }
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Handler for transitioning from view to edit
  const handleEditQuoteFromView = (quoteId: string) => {
    // Get the current quote and lead from the view modal
    const currentQuote = quoteModal.quote;
    const currentLead = quoteModal.lead;
    
    // Close view modal
    handleCloseQuoteModal();
    
    // Open edit modal with the quote data
    if (currentQuote && currentLead) {
      setEditQuoteModal({
        open: true,
        lead: currentLead,
        quote: currentQuote
      });
    }
  };

  // Handler for sending quote from view modal
  const handleSendQuoteFromView = (quoteId: string) => {
    // Call the existing send quote handler
    if (quoteModal.lead) {
      handleSendQuote(quoteModal.lead);
    }
  };

  // Notes modal handlers
  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setSelectedLeadForNotes(null);
  };

  const handleSaveNotes = (noteContent: string) => {
    if (!selectedLeadForNotes || !noteContent.trim()) return;
    
    // Create new note entry
    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent.trim(),
      timestamp: new Date().toISOString(),
      createdBy: 'current_user' // Future enhancement for multi-user
    };
    
    // Update lead with new note in history
    const updatedLeads = leads.map(lead => 
      lead.id === selectedLeadForNotes.id 
        ? { 
            ...lead, 
            notesHistory: [newNote, ...(lead.notesHistory || [])] // Add to beginning for newest first
          }
        : lead
    );
    
    setLeads(updatedLeads);
    
    // Show success message
    setSuccessMessage('Note added successfully!');
    
    // Close modal
    handleCloseNotesModal();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Handle updating existing lead
  const handleUpdateLead = (leadData: Omit<Lead, 'id' | 'conversionStatus' | 'convertedToOrderDate'>) => {
    if (!editingLead) return;

    const updatedLead: Lead = {
      ...leadData,
      id: editingLead.id,
      conversionStatus: editingLead.conversionStatus,
      convertedToOrderDate: editingLead.convertedToOrderDate
    };

    // Update the lead in the list
    setLeads(prev => prev.map(lead => 
      lead.id === editingLead.id ? updatedLead : lead
    ));
    
    // Show success message
    setSuccessMessage(`Lead for "${updatedLead.contactPerson}" has been updated!`);
    
    // Clear editing state
    setEditingLead(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Handle edit lead action
  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowAddModal(true);
  };

  // Handle add notes action
  const handleAddNotes = (lead: Lead) => {
    setSelectedLeadForNotes(lead);
    setShowNotesModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingLead(null);
  };

  // Sequential expansion toggle function - smooth visual flow
  const toggleDetails = async (leadId: string) => {
    if (expandedDetails.has(leadId)) {
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
      setExpandedDetails(new Set([leadId]));
      
      // Scroll to ensure the card is visible
      setTimeout(() => {
        const cardElement = document.querySelector(`[data-lead-id="${leadId}"]`);
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  };

  return (
    <div className={styles.leadManagementScreen}>
      <div className={styles.pageContent}>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            ✅ {successMessage}
          </div>
        )}

      <div className={styles.leadsContainer}>
        {leads.map(lead => {
          // Filter logic
          const shouldShow = (
            filterState === 'all' ||
            (filterState === 'hot' && lead.priority === 'hot') ||
            (filterState === 'warm' && lead.priority === 'warm') ||
            (filterState === 'cold' && lead.priority === 'cold')
          );

          if (!shouldShow) return null;

          const priorityIcons = {
            hot: '🔥',
            warm: '🔶', 
            cold: '🔵'
          };

          const priorityLabels = {
            hot: t('hotLead'),
            warm: t('warmLead'),
            cold: t('coldLead')
          };


          return (
            <div key={lead.id} className="ds-card-container" data-lead-id={lead.id}>
              {/* Clickable Card Summary - Global Design System 140px Template */}
              <div 
                className={`ds-card ${lead.priority === 'hot' ? 'ds-card-priority-high' : lead.priority === 'warm' ? 'ds-card-priority-medium' : 'ds-card-priority-low'} ${expandedDetails.has(lead.id) ? 'ds-card-expanded' : ''}`}
                onClick={() => toggleDetails(lead.id)}
              >
                {/* Enhanced Header - Company Name + Inquiry Context */}
                <div 
                  className="ds-card-header"
                  title={`${getBusinessProfileById(lead.businessProfileId)?.companyName || 'Unknown ' + terms.customer} - ${lead.inquiry} (${terms.lead} ID: ${lead.id})`}
                >
                  {getBusinessProfileById(lead.businessProfileId)?.companyName || 'Unknown ' + terms.customer} — {lead.inquiry}
                </div>
                
                {/* Simplified Status - Business Model + Priority + Conversion Stage */}
                <div className="ds-card-status">
                  {(() => {
                    const businessModelLabels = {
                      sales: '🛒 Sales Order',
                      job_work: '⚙️ Job Work'
                    };
                    return businessModelLabels[lead.leadType] || 'Unknown';
                  })()} • {priorityIcons[lead.priority]} {priorityLabels[lead.priority]} • {(() => {
                    const conversionLabels = {
                      active_lead: `Active ${terms.lead}`,
                      quote_sent: `${terms.quote} Sent`,
                      quote_rejected: `${terms.quote} Rejected`,
                      quote_expired: `${terms.quote} Expired`,
                      negotiation: 'In Negotiation',
                      verbally_approved: 'Approved',
                      proforma_sent: 'Proforma Sent',
                      payment_failed: 'Payment Failed',
                      awaiting_payment: 'Payment Pending',
                      converted_to_order: `Converted to ${terms.order}`
                    };
                    return conversionLabels[lead.conversionStatus] || `Active ${terms.lead}`;
                  })()}
                </div>
                
                {/* Business-Optimized Meta - Financial + Urgency + Geography */}
                <div 
                  className="ds-card-meta"
                  title={`${lead.budget} • ${lead.timeline} • ${(() => {
                    const bp = getBusinessProfileById(lead.businessProfileId);
                    return bp ? `${bp.registeredAddress.city}, ${bp.registeredAddress.state}` : 'Unknown Location';
                  })()}`}
                >
                  {lead.budget} • {lead.timeline} • {(() => {
                    const bp = getBusinessProfileById(lead.businessProfileId);
                    return bp ? `${bp.registeredAddress.city}, ${bp.registeredAddress.state}` : 'Unknown Location';
                  })()}
                </div>

                {/* Expand Indicator */}
                <div className="ds-card-expand-indicator">
                  {expandedDetails.has(lead.id) ? 'Less' : 'More'}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedDetails.has(lead.id) && (() => {
                const totalCalculation = calculateTotalValue(lead);
                const businessProfile = getBusinessProfileById(lead.businessProfileId);
                return (
                <div className={styles.expandedSection}>
                  
                  {/* SECTION 1: Company & Contact Information (Merged) */}
                  <div className={styles.companyContactSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🏢</span>
                        {terms.customer} & Contact Information
                      </h4>
                    </div>
                    <div className={styles.companyContactGrid}>
                      <div className={styles.companyDetails}>
                        <p><strong>{terms.customer}:</strong> {businessProfile?.companyName || 'Unknown ' + terms.customer}</p>
                        <p><strong>{terms.customer} Type:</strong> {businessProfile ? `${businessProfile.businessType} - ${businessProfile.specialization}` : `Unknown ${terms.customer}`}</p>
                        <p><strong>{terms.customer} Category:</strong> {getCustomerTypeIndicator(lead)}</p>
                        <p><strong>Location:</strong> {businessProfile ? `${businessProfile.registeredAddress.city}, ${businessProfile.registeredAddress.state}` : 'Unknown Location'}</p>
                      </div>
                      <div className={styles.contactDetails}>
                        {lead.contactPerson && <p><strong>Contact Person:</strong> {lead.contactPerson}</p>}
                        {lead.designation && <p><strong>Designation:</strong> {lead.designation}</p>}
                        <p><strong>Phone:</strong> {lead.phone || lead.contact}</p>
                        {lead.email && <p><strong>Email:</strong> {lead.email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Project Details (Enhanced for Job Work) */}
                  <div className={styles.projectDetailsSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>⚙️</span>
                        Job Work Project Details
                      </h4>
                    </div>
                    <div className={styles.projectDetailsGrid}>
                      <div className={styles.projectOverview}>
                        <p><strong>Processing Inquiry:</strong> {lead.inquiry}</p>
                        <p><strong>Budget Range:</strong> {lead.budget}</p>
                        <p><strong>Processing Timeline:</strong> {lead.timeline}</p>
                        <p><strong>Priority Level:</strong> {lead.priority === 'hot' ? '🔥 Urgent Processing' : lead.priority === 'warm' ? '🔶 Planning Stage' : '🔵 Initial Inquiry'}</p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: Requested Services (Job Work Focused) */}
                  <div className={styles.servicesSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>🛠️</span>
                        Requested Processing Services
                      </h4>
                      {totalCalculation.itemCount > 0 && (
                        <span className={styles.serviceCount}>{totalCalculation.itemCount} services</span>
                      )}
                    </div>
                    {lead.requestedItems && lead.requestedItems.length > 0 ? (
                      <div className={styles.servicesContent}>
                        <div className={styles.servicesList}>
                          {lead.requestedItems.map((item, index) => (
                            <RequestedItemCard
                              key={index}
                              item={item}
                              businessModel={lead.leadType}
                              showActions={false}
                              index={index}
                            />
                          ))}
                        </div>
                        {totalCalculation.totalValue > 0 && (
                          <div className={styles.jobValueSection}>
                            <div className={styles.valueHeader}>
                              <span className={styles.valueLabel}>Estimated Job Value:</span>
                              <span className={styles.valueAmount}>{formatCurrency(totalCalculation.totalValue)}</span>
                            </div>
                            {totalCalculation.calculatedItemCount !== totalCalculation.itemCount && (
                              <p className={styles.calculationNote}>
                                * Based on {totalCalculation.calculatedItemCount} of {totalCalculation.itemCount} services with available pricing
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.noServicesState}>
                        <p>No processing services specified yet.</p>
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: Lead Status (Simplified) */}
                  <div className={styles.leadStatusSection}>
                    <div className={styles.sectionHeader}>
                      <h4 className={styles.sectionTitle}>
                        <span className={styles.sectionIcon}>📊</span>
                        {terms.lead} Status & Tracking
                      </h4>
                    </div>
                    <div className={styles.statusGrid}>
                      <p><strong>{terms.lead} ID:</strong> {lead.id}</p>
                      <p><strong>Status:</strong> <span className={styles.conversionStatus}>{lead.conversionStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></p>
                      <p><strong>Last Contact:</strong> {
                        lead.notesHistory && lead.notesHistory.length > 0 
                          ? lead.notesHistory[0].content
                          : 'No interactions yet'
                      }</p>
                      {lead.convertedToOrderDate && (
                        <p><strong>Converted:</strong> {lead.convertedToOrderDate}</p>
                      )}
                    </div>

                    {/* Initial Notes */}
                    {lead.notes && (
                      <p className={styles.initialNotesSimple}>
                        <strong>Notes:</strong> {lead.notes}
                      </p>
                    )}

                    {/* Additional Notes */}
                    {lead.notesHistory && lead.notesHistory.length > 0 && (
                      <div className={styles.conversationHistory}>
                        <div className={styles.sectionHeader}>
                          <h4 className={styles.sectionTitle}>
                            <span className={styles.sectionIcon}>💬</span>
                            Additional Notes
                          </h4>
                        </div>
                        <div className={styles.notesHistoryList}>
                          {lead.notesHistory.slice(0, 5).map((note, index) => (
                            <div key={note.id} className={styles.noteEntry}>
                              <div className={styles.noteTimestamp}>
                                {new Date(note.timestamp).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className={styles.noteContent}>{note.content}</div>
                            </div>
                          ))}
                          {lead.notesHistory.length > 5 && (
                            <div className={styles.showMoreNotes}>
                              +{lead.notesHistory.length - 5} more notes
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Keep at bottom for consistency */}
                  <div className={styles.expandedActions}>
                    <button className="ds-btn ds-btn-secondary">
                      📞 Call
                    </button>
                    <button className="ds-btn ds-btn-secondary">
                      📱 WhatsApp
                    </button>
                    {renderDynamicQuoteActions(lead)}
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNotes(lead);
                      }}
                    >
                      📝 Add Notes
                    </button>
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
                );
              })()}
            </div>
          );
        })}
      </div>
      </div>

      {/* Add/Edit Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onAddLead={editingLead ? handleUpdateLead : handleAddLead}
        editingLead={editingLead}
      />

      {/* Quote Modal - Unified with mode support */}
      <GenerateQuoteModal
        isOpen={quoteModal.open}
        onClose={handleCloseQuoteModal}
        lead={quoteModal.lead}
        mode={quoteModal.mode}
        quote={quoteModal.quote}
        onQuoteGenerated={handleQuoteGenerated}
        onEditQuote={handleEditQuoteFromView}
        onSendQuote={handleSendQuoteFromView}
      />
      
      {/* Edit Quote Modal - Separate modal for dedicated editing */}
      <EditQuoteModal
        isOpen={editQuoteModal.open}
        onClose={handleCloseEditQuoteModal}
        lead={editQuoteModal.lead}
        quote={editQuoteModal.quote}
        onQuoteUpdated={handleQuoteUpdated}
      />

      {/* Add Notes Modal */}
      <AddNotesModal
        isOpen={showNotesModal}
        onClose={handleCloseNotesModal}
        onSave={handleSaveNotes}
        lead={selectedLeadForNotes}
      />
    </div>
  );
}

export default LeadManagement;