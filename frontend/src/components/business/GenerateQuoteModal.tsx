import React, { useState, useEffect, useCallback } from 'react';
import { Lead, LeadRequestedItem, QuoteItem, Quote } from '../../data/salesMockData';
import { getBusinessProfileById } from '../../data/customerMockData';
import ModalPortal from '../ui/ModalPortal';
import CatalogItemSelector from './CatalogItemSelector';
import QuoteItemEditor from './QuoteItemEditor';
import QuoteService from '../../services/QuoteService';
import LeadStatusService from '../../services/LeadStatusService';
import { useTerminologyTerms } from '../../contexts/TerminologyContext';
import styles from './GenerateQuoteModal.module.css';

// Extended interface for quote editing with additional fields
interface QuoteEditableItem extends LeadRequestedItem {
  customPrice?: number;
  discountPercentage?: number;
  calculatedTotal?: number;
  discountAmount?: number;
  quantity?: number;
}

interface GenerateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onQuoteGenerated: (quoteId: string) => void;
}

interface QuoteSummary {
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  itemCount: number;
}

function GenerateQuoteModal({
  isOpen,
  onClose,
  lead,
  onQuoteGenerated
}: GenerateQuoteModalProps) {
  const terms = useTerminologyTerms();
  
  // State for quote items (starts with lead's requested items)
  const [quoteItems, setQuoteItems] = useState<LeadRequestedItem[]>([]);
  const [showCatalogSelector, setShowCatalogSelector] = useState(false);
  const [quoteSummary, setQuoteSummary] = useState<QuoteSummary>({
    subtotal: 0,
    totalDiscount: 0,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    totalAmount: 0,
    itemCount: 0
  });
  
  // Quote metadata
  const [quoteNotes, setQuoteNotes] = useState('');
  const [validityDays, setValidityDays] = useState(15); // Default validity
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQuoteSummaryCollapsed, setIsQuoteSummaryCollapsed] = useState(false); // Start expanded

  // Initialize quote items from lead when modal opens
  useEffect(() => {
    if (isOpen && lead) {
      // Start with lead's requested items
      const initialItems = lead.requestedItems ? [...lead.requestedItems] : [];
      setQuoteItems(initialItems);
      setQuoteNotes(`${terms.quote} for ${lead.inquiry}`);
      
      // Set business model specific validity
      setValidityDays(lead.leadType === 'job_work' ? 7 : 15);
    } else {
      // Reset state when modal closes
      setQuoteItems([]);
      setQuoteNotes('');
      setValidityDays(15);
      setShowCatalogSelector(false);
    }
  }, [isOpen, lead, terms.quote]);

  // Calculate quote summary whenever items change
  useEffect(() => {
    if (!lead) return;

    let subtotal = 0;
    let totalDiscount = 0;

    quoteItems.forEach(item => {
      const editableItem = item as QuoteEditableItem;
      const itemTotal = editableItem.calculatedTotal || 0;
      const discountAmount = editableItem.discountAmount || 0;
      
      subtotal += itemTotal + discountAmount; // Add back discount to get pre-discount subtotal
      totalDiscount += discountAmount;
    });

    const taxableAmount = subtotal - totalDiscount;
    
    // GST calculation (9% CGST + 9% SGST = 18% total)
    const cgst = Math.round(taxableAmount * 0.09);
    const sgst = Math.round(taxableAmount * 0.09);
    const totalAmount = taxableAmount + cgst + sgst;

    setQuoteSummary({
      subtotal,
      totalDiscount,
      taxableAmount,
      cgst,
      sgst,
      totalAmount,
      itemCount: quoteItems.length
    });
  }, [quoteItems, lead]);

  // Handle adding new item from catalog
  const handleItemSelected = (newItem: LeadRequestedItem) => {
    setQuoteItems(prev => [...prev, newItem]);
    setShowCatalogSelector(false);
  };

  // Handle updating existing item - memoized to prevent infinite loops
  const handleItemUpdate = useCallback((index: number) => (updatedItem: QuoteEditableItem) => {
    setQuoteItems(prev => prev.map((item, i) => i === index ? updatedItem : item));
  }, []);

  // Handle removing item
  const handleItemRemove = (index: number) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  // Get already selected item IDs for catalog selector
  const getSelectedItemIds = () => {
    return quoteItems.map(item => item.masterItemId);
  };

  if (!lead) {
    return null;
  }

  const businessProfile = getBusinessProfileById(lead.businessProfileId);
  const companyName = businessProfile?.companyName || 'Unknown Company';

  // Generate quote
  const handleGenerateQuote = async () => {
    if (quoteItems.length === 0) {
      alert(`Please add at least one item to generate ${terms.quote.toLowerCase()}.`);
      return;
    }

    setIsGenerating(true);
    try {
      // Convert quote items to proper QuoteItem format
      const convertedItems: QuoteItem[] = quoteItems.map((item, index) => {
        const editableItem = item as QuoteEditableItem;
        const quantity = editableItem.quantity || item.requestedQuantity;
        const rate = editableItem.customPrice || editableItem.budgetExpectation || 0;
        const discountPercent = editableItem.discountPercentage || 0;
        const taxableAmount = editableItem.calculatedTotal || (quantity * rate);

        return {
          itemCode: `QUOTE-${index + 1}`, // Generate quote-specific item code
          description: `${item.masterItemId} - Custom Quote Item`,
          hsnCode: getHSNCodeForItem(item.masterItemId),
          quantity,
          unit: getUnitForItem(item.masterItemId),
          rate,
          discount: discountPercent,
          taxableAmount,
          catalogItemId: item.masterItemId,
          businessModelPricing: lead.leadType === 'sales' ? 'sales_premium' : 'job_work_competitive'
        };
      });

      // Create quote object
      const newQuote = {
        id: generateQuoteId(),
        leadId: lead.id,
        businessProfileId: lead.businessProfileId,
        quoteDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        }),
        validUntil: getValidityDate(validityDays),
        totalAmount: quoteSummary.totalAmount,
        status: 'draft' as const,
        statusMessage: `${terms.quote} generated - Ready for review`,
        advancePaymentRequired: calculateAdvancePayment(),
        advancePaymentStatus: 'not_requested' as const,
        businessModel: lead.leadType,
        businessModelTerms: getBusinessModelTerms(),
        items: convertedItems,
        revisionNumber: 1,
        isActive: true,
        leadQuoteState: 'generated'
      };

      // Add quote to mockQuotes (simulating save)
      const mockQuotes = await import('../../data/salesMockData');
      (mockQuotes.mockQuotes as Quote[]).push(newQuote as Quote);

      // Update lead status and tracking
      LeadStatusService.updateLeadStatus(lead.id, 'active_lead', `${terms.quote} generated successfully`);
      QuoteService.updateLeadQuoteTracking(lead.id, newQuote.id, 'generated');

      // Notify parent component
      onQuoteGenerated(newQuote.id);
      onClose();
      
      // Show success message
      setTimeout(() => {
        alert(`${terms.quote} ${newQuote.id} generated successfully! Total: ₹${quoteSummary.totalAmount.toLocaleString()}`);
      }, 100);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating quote:', error);
      alert(`Failed to generate ${terms.quote.toLowerCase()}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions
  const generateQuoteId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const businessPrefix = lead.leadType === 'job_work' ? 'JW' : 'SO';
    return `QT-${businessPrefix}-${timestamp}`;
  };

  const getValidityDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAdvancePayment = () => {
    // Business model specific advance payment calculation
    const percentage = lead.leadType === 'sales' ? 0.30 : 0.50; // 30% for sales, 50% for job work
    return Math.round(quoteSummary.totalAmount * percentage);
  };

  const getBusinessModelTerms = () => {
    if (lead.leadType === 'job_work') {
      return {
        paymentTerms: '50% advance, 50% on completion',
        processingDays: 7,
        specialConditions: [
          'Customer to provide materials',
          'Quality as per customer specifications',
          'Material handling charges extra if applicable'
        ]
      };
    } else {
      return {
        paymentTerms: '30% advance, 70% on delivery',
        deliveryDays: 14,
        specialConditions: [
          'All materials included',
          'Standard quality assurance',
          'Free delivery within city limits'
        ]
      };
    }
  };

  const getHSNCodeForItem = (itemId: string): string => {
    // Default HSN codes based on item type
    if (itemId.includes('cotton') || itemId.includes('fabric')) return '5208';
    if (itemId.includes('silk')) return '5007';
    if (itemId.includes('button')) return '3926';
    if (itemId.includes('dye')) return '3204';
    if (itemId.includes('service') || itemId.includes('dyeing') || itemId.includes('finishing')) return '9983';
    return '9999'; // Generic code
  };

  const getUnitForItem = (itemId: string): string => {
    if (itemId.includes('fabric') || itemId.includes('cotton') || itemId.includes('silk')) return 'meters';
    if (itemId.includes('button')) return 'pieces';
    if (itemId.includes('dye')) return 'kg';
    if (itemId.includes('service')) return 'meters';
    return 'units';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleClose = () => {
    if (quoteItems.length > 0) {
      const confirmed = window.confirm(`You have unsaved changes to this ${terms.quote.toLowerCase()}. Are you sure you want to close?`);
      if (!confirmed) return;
    }
    onClose();
  };

  return (
    <ModalPortal isOpen={isOpen} onBackdropClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2>🎯 {terms.generateQuote}</h2>
            <div className={styles.companyInfo}>
              <span className={styles.companyName}>{companyName}</span>
              <span className={styles.businessModel}>
                {lead.leadType === 'sales' ? '🏪 Sales Order' : '⚙️ Job Work'}
              </span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>×</button>
        </div>

        {/* Modal Content - Single scrollable container like AddLeadModal */}
        <div className={styles.modalForm}>
          {/* Quote Items Section */}
          <div className={styles.itemsSection}>
            <div className={styles.sectionHeader}>
              <h3>{terms.quote} Items ({quoteItems.length})</h3>
              <button 
                className="ds-btn ds-btn-secondary ds-btn-sm"
                onClick={() => setShowCatalogSelector(true)}
              >
                + Add Item from Catalog
              </button>
            </div>

            {quoteItems.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No items in {terms.quote.toLowerCase()}. Add items from your catalog to get started.</p>
                <button 
                  className="ds-btn ds-btn-primary"
                  onClick={() => setShowCatalogSelector(true)}
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className={styles.itemsList}>
                {quoteItems.map((item, index) => (
                  <QuoteItemEditor
                    key={`${item.masterItemId}-${index}`}
                    item={item}
                    businessModel={lead.leadType}
                    onUpdate={handleItemUpdate(index)}
                    onRemove={() => handleItemRemove(index)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quote Summary - Collapsible for space saving */}
          {quoteItems.length > 0 && (
            <div className={styles.quoteSummary}>
              <div 
                className={styles.summaryHeader}
                onClick={() => setIsQuoteSummaryCollapsed(!isQuoteSummaryCollapsed)}
              >
                <h3>{terms.quote} Summary ({quoteSummary.itemCount} items - {formatCurrency(quoteSummary.totalAmount)})</h3>
                <span className={styles.collapseIcon}>
                  {isQuoteSummaryCollapsed ? '▼' : '▲'}
                </span>
              </div>
              {!isQuoteSummaryCollapsed && (
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(quoteSummary.subtotal)}</span>
                  </div>
                  {quoteSummary.totalDiscount > 0 && (
                    <div className={styles.summaryRow}>
                      <span>Total Discount:</span>
                      <span className={styles.discountAmount}>-{formatCurrency(quoteSummary.totalDiscount)}</span>
                    </div>
                  )}
                  <div className={styles.summaryRow}>
                    <span>Taxable Amount:</span>
                    <span>{formatCurrency(quoteSummary.taxableAmount)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>CGST (9%):</span>
                    <span>{formatCurrency(quoteSummary.cgst)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>SGST (9%):</span>
                    <span>{formatCurrency(quoteSummary.sgst)}</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total Amount:</span>
                    <span>{formatCurrency(quoteSummary.totalAmount)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Advance Required ({lead.leadType === 'sales' ? '30%' : '50%'}):</span>
                    <span className={styles.advanceAmount}>{formatCurrency(calculateAdvancePayment())}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quote Settings */}
          <div className={styles.settingsSection}>
            <h3>{terms.quote} Settings</h3>
            <div className={styles.settingsGrid}>
              <div className={styles.settingField}>
                <label htmlFor="validity">Validity (Days)</label>
                <input
                  type="number"
                  id="validity"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
                  className={styles.settingInput}
                  min="1"
                  max="90"
                />
                <span className={styles.settingNote}>
                  Valid until: {getValidityDate(validityDays)}
                </span>
              </div>
              <div className={styles.settingField}>
                <label htmlFor="notes">{terms.quote} Notes</label>
                <textarea
                  id="notes"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className={styles.notesTextarea}
                  placeholder={`Add any special terms, conditions, or notes for this ${terms.quote.toLowerCase()}...`}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Modal Actions - Inside the form like AddLeadModal */}
          <div className={styles.modalActions}>
            <div className={styles.footerInfo}>
              {quoteItems.length > 0 && (
                <span className={styles.totalPreview}>
                  Total: {formatCurrency(quoteSummary.totalAmount)}
                </span>
              )}
            </div>
            <div className={styles.footerActions}>
              <button 
                className="ds-btn ds-btn-secondary"
                onClick={handleClose}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button 
                className="ds-btn ds-btn-primary"
                onClick={handleGenerateQuote}
                disabled={isGenerating || quoteItems.length === 0}
              >
                {isGenerating ? 'Generating...' : terms.generateQuote}
              </button>
            </div>
          </div>
        </div>

        {/* Catalog Item Selector Modal */}
        <CatalogItemSelector
          isOpen={showCatalogSelector}
          onClose={() => setShowCatalogSelector(false)}
          businessModel={lead.leadType}
          onItemSelected={handleItemSelected}
          excludeItemIds={getSelectedItemIds()}
        />
      </div>
    </ModalPortal>
  );
}

export default GenerateQuoteModal;