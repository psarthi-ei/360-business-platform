import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadModal from './AddLeadModal';
import GenerateQuoteModal from './GenerateQuoteModal';
import RequestedItemCard from './RequestedItemCard';
import { mockLeads, Lead } from '../../data/salesMockData';
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
  
  // Quote generation modal state
  const [showGenerateQuoteModal, setShowGenerateQuoteModal] = useState(false);
  const [selectedLeadForQuote, setSelectedLeadForQuote] = useState<Lead | null>(null);

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
      case 'revise':
        handleReviseQuote(lead);
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
      default:
        // Unknown quote action - no handler available
    }
  };

  // Quote Action Implementations (Phase 2.2)
  const handleGenerateQuote = (lead: Lead) => {
    setSelectedLeadForQuote(lead);
    setShowGenerateQuoteModal(true);
  };

  const handleViewQuote = (lead: Lead) => {
    // View quote logic to be implemented
    if (onShowQuoteFromLead) {
      onShowQuoteFromLead(lead.id);
    }
  };

  const handleReviseQuote = (lead: Lead) => {
    // Revise quote logic to be implemented
    // TODO: Implement quote revision
    alert('Revise Quote - Implementation coming soon!');
  };

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

  // Handle adding new lead
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToOrderDate'>) => {
    const newLead: Lead = {
      ...leadData,
      id: generateLeadId(),
      lastContact: new Date().toLocaleDateString(),
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
  const handleCloseGenerateQuoteModal = () => {
    setShowGenerateQuoteModal(false);
    setSelectedLeadForQuote(null);
  };

  const handleQuoteGenerated = (quoteId: string) => {
    // Show success message
    setSuccessMessage(`Quote ${quoteId} generated successfully!`);
    
    // Close modal
    handleCloseGenerateQuoteModal();
    
    // Optionally refresh the leads to show updated status
    // For now, we'll keep it simple and just show the success message
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Handle updating existing lead
  const handleUpdateLead = (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToOrderDate'>) => {
    if (!editingLead) return;

    const updatedLead: Lead = {
      ...leadData,
      id: editingLead.id,
      lastContact: `Updated on ${new Date().toLocaleDateString()}`,
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
                      {lead.notes && (
                        <div className={styles.projectNotes}>
                          <p><strong>Special Requirements:</strong> {lead.notes}</p>
                        </div>
                      )}
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
                      <p><strong>Created:</strong> {lead.lastContact}</p>
                      {lead.convertedToOrderDate && (
                        <p><strong>Converted:</strong> {lead.convertedToOrderDate}</p>
                      )}
                    </div>
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

      {/* Generate Rate Modal (Surat terminology) */}
      <GenerateQuoteModal
        isOpen={showGenerateQuoteModal}
        onClose={handleCloseGenerateQuoteModal}
        lead={selectedLeadForQuote}
        onQuoteGenerated={handleQuoteGenerated}
      />
    </div>
  );
}

export default LeadManagement;