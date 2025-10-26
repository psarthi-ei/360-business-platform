import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadModal from './AddLeadModal';
import { mockLeads, Lead } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
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
    
    return businessProfile.customerStatus === 'prospect' ? '🆕 New' : '🔄 Existing';
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
                
                {/* Enhanced Status - Customer Type + Priority + Conversion Stage */}
                <div className="ds-card-status">
                  {getCustomerTypeIndicator(lead)} • {priorityIcons[lead.priority]} {priorityLabels[lead.priority]} • {(() => {
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
              {expandedDetails.has(lead.id) && (
                <div className={styles.expandedSection}>
                  {/* Lead Details Section */}
                  <div className={styles.leadDetailsSection}>
                    <h4>Lead Details</h4>
                    <div className={styles.detailsGrid}>
                      <p><strong>Lead ID:</strong> {lead.id}</p>
                      <p><strong>Priority:</strong> {priorityIcons[lead.priority]} {priorityLabels[lead.priority]}</p>
                      <p><strong>Status:</strong> {lead.conversionStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p><strong>Location:</strong> {(() => {
                        const bp = getBusinessProfileById(lead.businessProfileId);
                        return bp ? `${bp.registeredAddress.city}, ${bp.registeredAddress.state}` : 'Unknown Location';
                      })()}</p>
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
                      <p><strong>Contact:</strong> {lead.contact}</p>
                      {lead.phone && <p><strong>Phone:</strong> {lead.phone}</p>}
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

                  {/* Fabric Requirements */}
                  <div className={styles.fabricSection}>
                    <h4>Fabric Requirements</h4>
                    {lead.fabricRequirements && (
                      lead.fabricRequirements.fabricType || 
                      lead.fabricRequirements.gsm || 
                      lead.fabricRequirements.quantity
                    ) ? (
                      <div className={styles.fabricContent}>
                        <div className={styles.fabricGrid}>
                          {lead.fabricRequirements.fabricType && (
                            <span className={styles.fabricTag}>{lead.fabricRequirements.fabricType}</span>
                          )}
                          {lead.fabricRequirements.gsm && (
                            <span className={styles.fabricTag}>{lead.fabricRequirements.gsm} GSM</span>
                          )}
                          {lead.fabricRequirements.quantity && (
                            <span className={styles.fabricTag}>
                              {lead.fabricRequirements.quantity} {lead.fabricRequirements.unit || 'units'}
                            </span>
                          )}
                          {lead.fabricRequirements.qualityGrade && (
                            <span className={styles.fabricTag}>{lead.fabricRequirements.qualityGrade}</span>
                          )}
                        </div>
                        {lead.fabricRequirements.width && (
                          <p><strong>Width:</strong> {lead.fabricRequirements.width}</p>
                        )}
                        {lead.fabricRequirements.weaveType && (
                          <p><strong>Weave Type:</strong> {lead.fabricRequirements.weaveType}</p>
                        )}
                        {lead.fabricRequirements.colors && (
                          <p><strong>Colors:</strong> {lead.fabricRequirements.colors}</p>
                        )}
                        {lead.fabricRequirements.specialProcessing && (
                          <p><strong>Special Processing:</strong> {lead.fabricRequirements.specialProcessing}</p>
                        )}
                        {lead.fabricRequirements.deliveryTimeline && (
                          <p><strong>Delivery Timeline:</strong> {lead.fabricRequirements.deliveryTimeline}</p>
                        )}
                      </div>
                    ) : (
                      <p className={styles.noData}>No fabric requirements specified yet.</p>
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
              )}
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