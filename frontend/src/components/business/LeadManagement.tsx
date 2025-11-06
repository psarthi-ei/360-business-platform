import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadModal from './AddLeadModal';
import RequestedItemCard from './RequestedItemCard';
import { mockLeads, Lead } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import { calculateItemPrice } from '../../data/catalogMockData';
import { useTranslation } from '../../contexts/TranslationContext';
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
    
    return businessProfile.customerStatus === 'prospect' ? '🆕 New Customer' : '🔄 Existing Customer';
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
                  title={`${getBusinessProfileById(lead.businessProfileId)?.companyName || 'Unknown Company'} - ${lead.inquiry} (Lead ID: ${lead.id})`}
                >
                  {getBusinessProfileById(lead.businessProfileId)?.companyName || 'Unknown Company'} — {lead.inquiry}
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
                      active_lead: 'Active Lead',
                      quote_sent: 'Quote Sent',
                      verbally_approved: 'Approved',
                      proforma_sent: 'Proforma Sent',
                      awaiting_payment: 'Payment Pending',
                      converted_to_order: 'Converted to Order'
                    };
                    return conversionLabels[lead.conversionStatus] || 'Active Lead';
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
                return (
                <div className={styles.expandedSection}>
                  {/* Lead Details Section */}
                  <div className={styles.leadDetailsSection}>
                    <h4>Lead Details</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Lead ID:</strong> {lead.id}</p>
                      <p><strong>Customer Type:</strong> {getCustomerTypeIndicator(lead)}</p>
                      <p><strong>Created Date:</strong> {lead.lastContact}</p>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className={styles.companySection}>
                    <h4>Company Information</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Company:</strong> {getBusinessProfileById(lead.businessProfileId)?.companyName || 'Unknown Company'}</p>
                      <p><strong>Business Type:</strong> {(() => {
                        const bp = getBusinessProfileById(lead.businessProfileId);
                        return bp ? `${bp.businessType} - ${bp.specialization}` : 'Unknown Business';
                      })()}</p>
                      {lead.contactPerson && <p><strong>Contact Person:</strong> {lead.contactPerson}</p>}
                      {lead.designation && <p><strong>Designation:</strong> {lead.designation}</p>}
                      {lead.department && <p><strong>Department:</strong> {lead.department}</p>}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className={styles.contactSection}>
                    <h4>Contact Information</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Primary Contact:</strong> {lead.phone || lead.contact}</p>
                      {lead.email && <p><strong>Email:</strong> {lead.email}</p>}
                      <p><strong>Last Contact:</strong> {lead.lastContact}</p>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className={styles.projectSection}>
                    <h4>Project Information</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Inquiry:</strong> {lead.inquiry}</p>
                      <p><strong>Budget:</strong> {lead.budget}</p>
                      <p><strong>Timeline:</strong> {lead.timeline}</p>
                      {lead.notes && <p><strong>Notes:</strong> {lead.notes}</p>}
                    </div>
                  </div>

                  {/* Requested Items */}
                  <div className={styles.fabricSection}>
                    <div className={styles.sectionHeader}>
                      <h4>Requested Items</h4>
                      {totalCalculation.itemCount > 0 && (
                        <span className={styles.itemCount}>{totalCalculation.itemCount} items</span>
                      )}
                    </div>
                    {lead.requestedItems && lead.requestedItems.length > 0 ? (
                      <div className={styles.fabricContent}>
                        {lead.requestedItems.map((item, index) => (
                          <RequestedItemCard
                            key={index}
                            item={item}
                            businessModel={lead.leadType}
                            showActions={false}
                            index={index}
                          />
                        ))}
                        {totalCalculation.totalValue > 0 && (
                          <div className={styles.totalSection}>
                            <div className={styles.totalRow}>
                              <span className={styles.totalLabel}>Estimated Total Value:</span>
                              <span className={styles.totalAmount}>{formatCurrency(totalCalculation.totalValue)}</span>
                            </div>
                            {totalCalculation.calculatedItemCount !== totalCalculation.itemCount && (
                              <p className={styles.calculationNote}>
                                * Total based on {totalCalculation.calculatedItemCount} of {totalCalculation.itemCount} items with available pricing
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className={styles.noData}>No items requested yet.</p>
                    )}
                  </div>

                  {/* Conversion Tracking */}
                  <div className={styles.conversionSection}>
                    <h4>Conversion Tracking</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Conversion Status:</strong> {lead.conversionStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      {lead.convertedToOrderDate && (
                        <p><strong>Converted Date:</strong> {lead.convertedToOrderDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Proper 44px Touch Targets */}
                  <div className={styles.expandedActions}>
                    <button className="ds-btn ds-btn-secondary">
                      Call
                    </button>
                    <button className="ds-btn ds-btn-secondary">
                      WhatsApp
                    </button>
                    <button 
                      className="ds-btn ds-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowQuoteFromLead?.(lead.id);
                      }}
                    >
                      Quote
                    </button>
                    <button 
                      className="ds-btn ds-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}
                    >
                      Edit
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
    </div>
  );
}

export default LeadManagement;