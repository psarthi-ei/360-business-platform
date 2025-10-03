import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AddLeadModal from './AddLeadModal';
// import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import { mockLeads, mockQuotes, mockSalesOrders, formatCurrency, Lead } from '../../data/mockData';
import { useTranslation } from '../../contexts/TranslationContext';
// import { ActionParams, SetPriorityParams, EditLeadParams } from '../services/nlp/types';
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
  // onUniversalAction?: (actionType: string, params?: ActionParams) => void;
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
  // onUniversalAction
}: LeadManagementProps) {
  const { t } = useTranslation();
  const location = useLocation();
  
  // State for modal and leads
  const [showAddModal, setShowAddModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // Mobile UX V2: Progressive disclosure state
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [expandedFabricReqs, setExpandedFabricReqs] = useState<Set<string>>(new Set());
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());

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

  // Handle adding new lead
  const handleAddLead = (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToCustomerDate'>) => {
    const newLead: Lead = {
      ...leadData,
      id: generateLeadId(),
      lastContact: new Date().toLocaleDateString(),
      conversionStatus: 'active_lead',
      convertedToCustomerDate: undefined
    };

    // Add new lead to the beginning of the list
    setLeads(prev => [newLead, ...prev]);
    
    // Show success message
    setSuccessMessage(`Lead "${newLead.companyName}" has been successfully added!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Handle updating existing lead
  const handleUpdateLead = (leadData: Omit<Lead, 'id' | 'lastContact' | 'conversionStatus' | 'convertedToCustomerDate'>) => {
    if (!editingLead) return;

    const updatedLead: Lead = {
      ...leadData,
      id: editingLead.id,
      lastContact: `Updated on ${new Date().toLocaleDateString()}`,
      conversionStatus: editingLead.conversionStatus,
      convertedToCustomerDate: editingLead.convertedToCustomerDate
    };

    // Update the lead in the list
    setLeads(prev => prev.map(lead => 
      lead.id === editingLead.id ? updatedLead : lead
    ));
    
    // Show success message
    setSuccessMessage(`Lead "${updatedLead.companyName}" has been updated!`);
    
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

  // Handle add requirements action
  const handleAddRequirements = (lead: Lead) => {
    setEditingLead(lead);
    setShowAddModal(true);
    // The modal will auto-expand fabric requirements section
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingLead(null);
  };

  // Handle quick priority change - UC-L05
  const handlePriorityChange = (leadId: string, newPriority: 'hot' | 'warm' | 'cold') => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, priority: newPriority, lastContact: `Priority changed to ${newPriority} on ${new Date().toLocaleDateString()}` }
        : lead
    ));
    
    // Show success message
    const leadName = leads.find(l => l.id === leadId)?.companyName || 'Lead';
    setSuccessMessage(`${leadName} priority updated to ${newPriority.toUpperCase()}!`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Mobile UX V2: Progressive disclosure toggle functions
  const toggleDetails = (leadId: string) => {
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const toggleFabricRequirements = (leadId: string) => {
    setExpandedFabricReqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const toggleHistory = (leadId: string) => {
    setExpandedHistory(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.leadManagementScreen}>
      <div className={styles.pageContent}>
        {/* Mobile UX V2: Unified Smart Header Bar */}
        <div className={styles.unifiedHeader}>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            + Add
          </button>
          
          <div className={styles.filterDropdownContainer}>
            <select 
              className={styles.filterDropdown}
              value={filterState}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="all">All Leads</option>
              <option value="hotleads">🔥 Hot Leads</option>
              <option value="warmleads">🔶 Warm Leads</option>
              <option value="coldleads">🔵 Cold Leads</option>
            </select>
          </div>
          
          <div className={styles.leadCounter}>
            📊 {leads.filter(lead => {
              if (filterState === 'all') return true;
              if (filterState === 'hotleads') return lead.priority === 'hot';
              if (filterState === 'warmleads') return lead.priority === 'warm';
              if (filterState === 'coldleads') return lead.priority === 'cold';
              return true;
            }).length} leads
          </div>
        </div>

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
            (filterState === 'hotleads' && lead.priority === 'hot') ||
            (filterState === 'warmleads' && lead.priority === 'warm') ||
            (filterState === 'coldleads' && lead.priority === 'cold')
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

          const relatedQuotes = mockQuotes.filter(quote => quote.leadId === lead.id);
          const relatedOrders = relatedQuotes.length > 0 ? 
            mockSalesOrders.filter(order => relatedQuotes.some(quote => quote.id === order.quoteId)) : [];

          return (
            <div key={lead.id} className={`${styles.leadCard} ${styles[lead.priority + 'Lead']}`}>
              {/* Clean Header - Company Name and Priority Badge */}
              <div className={styles.leadHeader}>
                <h3 className={styles.companyName}>
                  <span 
                    onClick={() => lead.businessProfileId ? onShowCustomerProfile?.(lead.businessProfileId) : null}
                    style={{cursor: lead.businessProfileId ? 'pointer' : 'default', textDecoration: lead.businessProfileId ? 'underline' : 'none'}}
                    title={lead.businessProfileId ? 'View customer profile' : 'Not yet converted to customer'}
                  >
                    {lead.businessProfileId ? '✅' : '🔸'} {lead.id} - {lead.companyName}
                  </span>
                </h3>
                <div className={styles.badgeContainer}>
                  <div className={styles.prioritySection}>
                    <span className={`${styles.priorityBadge} ${styles[lead.priority]}`}>
                      {priorityIcons[lead.priority]} {priorityLabels[lead.priority]}
                    </span>
                    
                    {/* UC-L05: Priority Quick Change Buttons */}
                    <div className={styles.priorityQuickActions}>
                      <button
                        className={`${styles.priorityBtn} ${lead.priority === 'hot' ? styles.active : ''}`}
                        onClick={() => handlePriorityChange(lead.id, 'hot')}
                        disabled={lead.priority === 'hot'}
                        title="Set as Hot Lead"
                      >
                        🔥
                      </button>
                      <button
                        className={`${styles.priorityBtn} ${lead.priority === 'warm' ? styles.active : ''}`}
                        onClick={() => handlePriorityChange(lead.id, 'warm')}
                        disabled={lead.priority === 'warm'}
                        title="Set as Warm Lead"
                      >
                        🔶
                      </button>
                      <button
                        className={`${styles.priorityBtn} ${lead.priority === 'cold' ? styles.active : ''}`}
                        onClick={() => handlePriorityChange(lead.id, 'cold')}
                        disabled={lead.priority === 'cold'}
                        title="Set as Cold Lead"
                      >
                        🔵
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Essential Preview - Always Visible */}
              <div className={styles.essentialPreview}>
                <span className={styles.materialInfo}>
                  {lead.fabricRequirements?.fabricType || lead.inquiry} • {lead.budget} • {lead.timeline}
                </span>
              </div>

              {/* Priority-Based Card Actions - Structured Layout */}
              <div className={styles.cardActions}>
                {/* Hot Leads: Urgent actions */}
                {lead.priority === 'hot' && (
                  <>
                    <div className={styles.primaryActions}>
                      <button className={`${styles.actionBtn} ${styles.urgentBtn}`}>
                        🔥 Call Now
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.primaryBtn}`} 
                        onClick={() => onShowQuoteFromLead?.(lead.id)}
                      >
                        📋 Rush Quote
                      </button>
                    </div>
                    <div className={styles.secondaryActions}>
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn} ${styles.moreBtn}`}
                        onClick={() => toggleDetails(lead.id)}
                      >
                        {expandedDetails.has(lead.id) ? 'Less...' : 'More...'}
                      </button>
                    </div>
                  </>
                )}
                
                {/* Warm Leads: Standard business actions */}
                {lead.priority === 'warm' && (
                  <>
                    <div className={styles.primaryActions}>
                      <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        📞 Call
                      </button>
                      <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        💬 WhatsApp
                      </button>
                    </div>
                    <div className={styles.secondaryActions}>
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn}`} 
                        onClick={() => onShowQuoteFromLead?.(lead.id)}
                      >
                        {relatedQuotes.length > 0 ? `📋 Quote (${relatedQuotes.length})` : '📋 Quote'}
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn} ${styles.moreBtn}`}
                        onClick={() => toggleDetails(lead.id)}
                      >
                        {expandedDetails.has(lead.id) ? 'Less...' : 'More...'}
                      </button>
                    </div>
                  </>
                )}
                
                {/* Cold Leads: Gentle approach */}
                {lead.priority === 'cold' && (
                  <>
                    <div className={styles.primaryActions}>
                      <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        📞 Call
                      </button>
                      <button className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        💬 Message
                      </button>
                    </div>
                    <div className={styles.secondaryActions}>
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn}`} 
                        onClick={() => onShowQuoteFromLead?.(lead.id)}
                      >
                        {relatedQuotes.length > 0 ? `📋 Quote (${relatedQuotes.length})` : '📋 Quote'}
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn} ${styles.moreBtn}`}
                        onClick={() => toggleDetails(lead.id)}
                      >
                        {expandedDetails.has(lead.id) ? 'Less...' : 'More...'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile UX V2: Progressive Disclosure - Details */}
              {expandedDetails.has(lead.id) && (
                <div className={styles.expandedDetails}>
                  <div className={styles.detailsContent}>
                    <p><strong>Contact:</strong> {lead.contact}</p>
                    <p><strong>Business:</strong> {lead.business}</p>
                    <p><strong>Inquiry:</strong> {lead.inquiry}</p>
                    <p><strong>Last Contact:</strong> {lead.lastContact}</p>
                    <p><strong>Notes:</strong> {lead.notes}</p>
                  </div>
                  
                  <div className={styles.expandedActions}>
                    <button 
                      className={`${styles.actionBtn} ${styles.secondaryBtn}`} 
                      onClick={() => handleEditLead(lead)}
                      title="Edit lead details"
                    >
                      ✏️ Edit Lead
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile UX V2: Progressive Disclosure - Fabric Requirements */}
              {expandedDetails.has(lead.id) && (
                <div className={styles.fabricRequirementsSection}>
                  <button 
                    className={styles.sectionToggleBtn}
                    onClick={() => toggleFabricRequirements(lead.id)}
                    title={expandedFabricReqs.has(lead.id) ? "Hide fabric requirements" : "Show fabric requirements"}
                  >
                    <span>🧵 Fabric Requirements</span>
                    <span className={styles.toggleIcon}>
                      {expandedFabricReqs.has(lead.id) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedFabricReqs.has(lead.id) && (
                    <div className={styles.fabricContent}>
                      {lead.fabricRequirements && (
                        lead.fabricRequirements.fabricType || 
                        lead.fabricRequirements.gsm || 
                        lead.fabricRequirements.quantity
                      ) ? (
                        <>
                          <div className={styles.fabricDetails}>
                            {lead.fabricRequirements.fabricType && (
                              <span className={styles.fabricTag}>{lead.fabricRequirements.fabricType}</span>
                            )}
                            {lead.fabricRequirements.gsm && (
                              <span className={styles.fabricTag}>{lead.fabricRequirements.gsm} GSM</span>
                            )}
                            {lead.fabricRequirements.width && (
                              <span className={styles.fabricTag}>{lead.fabricRequirements.width}</span>
                            )}
                            {lead.fabricRequirements.weaveType && (
                              <span className={styles.fabricTag}>{lead.fabricRequirements.weaveType}</span>
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
                          {lead.fabricRequirements.colors && (
                            <p className={styles.fabricColors}><strong>Colors:</strong> {lead.fabricRequirements.colors}</p>
                          )}
                          {lead.fabricRequirements.specialProcessing && (
                            <p className={styles.fabricProcessing}><strong>Processing:</strong> {lead.fabricRequirements.specialProcessing}</p>
                          )}
                        </>
                      ) : (
                        <p className={styles.noFabricData}>No fabric requirements specified yet.</p>
                      )}
                      <button 
                        className={`${styles.actionBtn} ${styles.secondaryBtn}`}
                        onClick={() => handleAddRequirements(lead)}
                        title="Edit fabric requirements"
                      >
                        ✏️ Edit Requirements
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile UX V2: Progressive Disclosure - History */}
              {expandedDetails.has(lead.id) && (
                <div className={styles.historySection}>
                  <button 
                    className={styles.sectionToggleBtn}
                    onClick={() => toggleHistory(lead.id)}
                    title={expandedHistory.has(lead.id) ? "Hide history" : "Show history"}
                  >
                    <span>📚 History ({relatedQuotes.length + relatedOrders.length})</span>
                    <span className={styles.toggleIcon}>
                      {expandedHistory.has(lead.id) ? '▼' : '▶'}
                    </span>
                  </button>
                  
                  {expandedHistory.has(lead.id) && (
                    <div className={styles.historyContent}>
                      {relatedQuotes.length > 0 || relatedOrders.length > 0 ? (
                        <>
                          {relatedQuotes.length > 0 && (
                            <div className={styles.quotesHistory}>
                              <p><strong>📄 Quotes ({relatedQuotes.length}):</strong></p>
                              {relatedQuotes.map((quote) => (
                                <p key={quote.id} className={styles.historyItem}>
                                  • <span className={styles.historyLink} onClick={() => onShowQuotationOrders?.()}>
                                    {quote.id}
                                  </span> 
                                  - {formatCurrency(quote.totalAmount)} ({quote.status})
                                </p>
                              ))}
                            </div>
                          )}
                          
                          {relatedOrders.length > 0 && (
                            <div className={styles.ordersHistory}>
                              <p><strong>📦 Orders ({relatedOrders.length}):</strong></p>
                              {relatedOrders.map((order) => (
                                <p key={order.id} className={styles.historyItem}>
                                  • <span className={styles.historyLink} onClick={() => onShowSalesOrders?.()}>
                                    {order.id}
                                  </span> 
                                  - {order.status} ({order.statusMessage})
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className={styles.noHistoryData}>No quotes or orders yet. Create a quote to get started!</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>{t('voiceCommandsHint')}</strong> 
          "{t('addFabricInquiry')}" • "{t('callRajesh')}" • "{t('showCottonLeads')}"
        </p>
      </div>
      </div>

      {/* Add/Edit Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onAddLead={editingLead ? handleUpdateLead : handleAddLead}
        editingLead={editingLead}
      />

      {/* Voice functionality now handled by universal FloatingVoiceAssistant in App.tsx */}
    </div>
  );
}

export default LeadManagement;