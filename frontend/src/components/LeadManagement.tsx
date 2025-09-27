import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductHeader from './ProductHeader';
import AddLeadModal from './AddLeadModal';
import { mockLeads, mockQuotes, mockSalesOrders, formatCurrency, Lead } from '../data/mockData';
import { useTranslation } from '../contexts/TranslationContext';
import styles from '../styles/LeadManagement.module.css';

interface LeadManagementProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
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
  currentLanguage,
  onLanguageChange,
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowCustomerProfile,
  onShowQuoteFromLead,
  onShowQuotationOrders,
  onShowSalesOrders,
  filterState,
  onFilterChange,
  openAddModal,
  onAddModalHandled
}: LeadManagementProps) {
  const { t } = useTranslation();
  const location = useLocation();
  
  // State for modal and leads
  const [showAddModal, setShowAddModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Auto-open modal based on URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add-lead') {
      setShowAddModal(true);
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

  return (
    <div className={styles.leadManagementScreen}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onHome={onNavigateHome}
        onDashboard={onNavigateBack}
        showDashboardButton={true}
        showThemeSelector={true}
      />
      
      <div className={styles.pageContent}>
        <div className={styles.screenHeader}>
          <h1 className={styles.centeredHeading}>📋 {t('leadManagement')}</h1>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            {t('addNewLead')}
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={styles.successMessage}>
            ✅ {successMessage}
          </div>
        )}

      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button 
            className={filterState === 'all' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('all')}
          >
            {t('showAll')}
          </button>
          <button 
            className={filterState === 'hotleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('hotleads')}
          >
            {t('showHotLeads')}
          </button>
          <button 
            className={filterState === 'warmleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('warmleads')}
          >
            {t('showWarmLeads')}
          </button>
          <button 
            className={filterState === 'coldleads' ? `${styles.filterBtn} ${styles.active}` : styles.filterBtn}
            onClick={() => onFilterChange('coldleads')}
          >
            {t('showColdLeads')}
          </button>
        </div>
      </div>

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
              <div className={styles.leadHeader}>
                <h3>
                  <span 
                    onClick={() => lead.businessProfileId ? onShowCustomerProfile?.(lead.businessProfileId) : null}
                    style={{cursor: lead.businessProfileId ? 'pointer' : 'default', textDecoration: lead.businessProfileId ? 'underline' : 'none'}}
                    title={lead.businessProfileId ? 'View customer profile' : 'Not yet converted to customer'}
                  >
                    {lead.companyName} - {lead.location}
                  </span>
                </h3>
                <span className={`${styles.priorityBadge} ${styles[lead.priority]}`}>
                  {priorityIcons[lead.priority]} {priorityLabels[lead.priority]}
                </span>
              </div>
              <div className={styles.leadDetails}>
                <p><strong>Contact:</strong> {lead.contact}</p>
                <p><strong>Business:</strong> {lead.business}</p>
                <p><strong>Inquiry:</strong> {lead.inquiry}</p>
                <p><strong>Budget:</strong> {lead.budget} | <strong>Timeline:</strong> {lead.timeline}</p>
                <p><strong>Last Contact:</strong> {lead.lastContact}</p>
              </div>

              {/* UC-L04: Fabric Requirements Display */}
              {lead.fabricRequirements && (
                lead.fabricRequirements.fabricType || 
                lead.fabricRequirements.gsm || 
                lead.fabricRequirements.quantity
              ) ? (
                <div className={styles.fabricRequirements}>
                  <div className={styles.fabricRequirementsHeader}>
                    <p><strong>🧵 Fabric Requirements:</strong></p>
                    <button 
                      className={styles.editRequirementsBtn}
                      onClick={() => handleAddRequirements(lead)}
                      title="Edit fabric requirements"
                    >
                      ✏️ Edit
                    </button>
                  </div>
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
                </div>
              ) : (
                <div className={styles.missingFabricRequirements}>
                  <div className={styles.missingRequirementsHeader}>
                    <p><strong>🧵 Fabric Requirements:</strong> <span className={styles.incompleteInfo}>Not specified</span></p>
                    <button 
                      className={styles.addRequirementsBtn}
                      onClick={() => handleAddRequirements(lead)}
                      title="Add fabric requirements"
                    >
                      + Add Details
                    </button>
                  </div>
                </div>
              )}

              {/* Related Quote and Order Information */}
              <div className={styles.leadMapping}>
                {relatedQuotes.length > 0 ? (
                  <div className={styles.mappingInfo}>
                    <p><strong>📄 Related Quotes ({relatedQuotes.length}):</strong></p>
                    {relatedQuotes.map((quote, index) => (
                      <p key={quote.id} style={{marginLeft: '20px', marginBottom: '8px'}}>
                        • <span className={styles.mappingLink} onClick={() => onShowQuotationOrders?.()}>
                          {quote.id}
                        </span> 
                        - {formatCurrency(quote.totalAmount)} ({quote.status})
                      </p>
                    ))}
                    {relatedOrders.length > 0 && (
                      <>
                        <p><strong>📦 Related Orders ({relatedOrders.length}):</strong></p>
                        {relatedOrders.map((order, index) => (
                          <p key={order.id} style={{marginLeft: '20px', marginBottom: '8px'}}>
                            • <span className={styles.mappingLink} onClick={() => onShowSalesOrders?.()}>
                              {order.id}
                            </span> 
                            - {order.status} ({order.statusMessage})
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className={styles.mappingInfo}>
                    <p><strong>📄 Quote Status:</strong> <span className={styles.noQuote}>No quotes created yet</span></p>
                  </div>
                )}
              </div>
              
              <div className={styles.leadActions}>
                <button className={`${styles.actionBtn} ${styles.callBtn}`}>📞 Call{lead.priority === 'hot' ? ' Now' : ''}</button>
                <button className={`${styles.actionBtn} ${styles.whatsappBtn}`}>💬 WhatsApp</button>
                <button className={`${styles.actionBtn} ${styles.quoteBtn}`} onClick={() => onShowQuoteFromLead?.(lead.id)}>
                  ₹ {relatedQuotes.length > 0 ? `View Quotes (${relatedQuotes.length})` : 'Send Quote'}
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.editBtn}`} 
                  onClick={() => handleEditLead(lead)}
                  title="Edit lead details"
                >
                  ✏️ Edit Lead
                </button>
              </div>
              
              <div className={styles.leadNotes}>
                <p><strong>Notes:</strong> {lead.notes}</p>
              </div>
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
    </div>
  );
}

export default LeadManagement;