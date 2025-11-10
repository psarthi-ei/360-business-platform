// PHASE 1.2: Quote Service for Quote Lifecycle Management
// Enhanced quote lifecycle management with revision tracking

import { 
  Quote, 
  Lead, 
  QuoteChanges, 
  QuoteState, 
  QuoteAction,
  mockQuotes,
  mockLeads,
  generateQuoteFromLead 
} from '../data/salesMockData';
import LeadStatusService from './LeadStatusService';

export class QuoteService {
  /**
   * Generate a new quote from lead items
   */
  static generateQuoteFromLead(leadId: string): Quote | null {
    const lead = this.getLeadById(leadId);
    if (!lead || !lead.requestedItems || lead.requestedItems.length === 0) {
      return null;
    }

    // Use existing generateQuoteFromLead function and enhance with revision fields
    const baseQuote = generateQuoteFromLead(leadId);
    if (!baseQuote) return null;

    const enhancedQuote = {
      ...baseQuote,
      revisionNumber: 1,
      isActive: true,
      status: 'draft' as const
    };

    // Update lead quote tracking
    this.updateLeadQuoteTracking(leadId, enhancedQuote.id, 'generated');

    return enhancedQuote;
  }

  /**
   * Create a revision of an existing quote
   */
  static createQuoteRevision(
    baseQuoteId: string, 
    changes: Partial<Quote>,
    revisionReason?: string
  ): Quote | null {
    const baseQuote = this.getQuoteById(baseQuoteId);
    if (!baseQuote) return null;

    const revisionNumber = this.getNextRevisionNumber(baseQuoteId);
    
    const newQuote: Quote = {
      ...baseQuote,
      ...changes,
      id: this.generateRevisionId(baseQuoteId, revisionNumber),
      parentQuoteId: baseQuoteId,
      revisionNumber,
      isActive: true,
      lastRevisionDate: new Date().toISOString(),
      revisionReason,
      status: 'draft',
      quoteDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    // Mark previous quote as inactive
    this.markQuoteInactive(baseQuoteId);
    
    // Update lead quote tracking
    this.updateLeadQuoteTracking(newQuote.leadId, newQuote.id, 'revised');

    return newQuote;
  }

  /**
   * Get active quote for a lead
   */
  static getActiveQuoteForLead(leadId: string): Quote | null {
    return mockQuotes.find(quote => 
      quote.leadId === leadId && quote.isActive
    ) || null;
  }

  /**
   * Get all quotes for a lead (including revisions)
   */
  static getQuotesForLead(leadId: string): Quote[] {
    return mockQuotes.filter(quote => quote.leadId === leadId);
  }

  /**
   * Get quote history (all revisions)
   */
  static getQuoteHistory(quoteId: string): Quote[] {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return [];

    // If this quote has a parent, get the original quote ID
    const originalQuoteId = quote.parentQuoteId || quoteId;
    
    // Get all quotes with same original ID or parent ID
    return mockQuotes
      .filter(q => 
        q.id === originalQuoteId || 
        q.parentQuoteId === originalQuoteId ||
        (q.parentQuoteId === quote.parentQuoteId && quote.parentQuoteId)
      )
      .sort((a, b) => (a.revisionNumber || 1) - (b.revisionNumber || 1));
  }

  /**
   * Get quote state for lead (determines available actions)
   */
  static getQuoteStateForLead(leadId: string, terminology?: { quote: string; generateQuote: string }): QuoteState {
    const activeQuote = this.getActiveQuoteForLead(leadId);
    const allQuotes = this.getQuotesForLead(leadId);
    const lead = this.getLeadById(leadId);

    const state: QuoteState = {
      leadId,
      hasQuote: !!activeQuote,
      activeQuoteId: activeQuote?.id,
      latestQuoteStatus: activeQuote?.status,
      revisionCount: allQuotes.length,
      availableActions: []
    };

    // Determine available actions based on state
    state.availableActions = this.getAvailableActions(state, activeQuote, lead, terminology);

    return state;
  }

  /**
   * Get available actions for current quote state
   */
  static getAvailableActions(
    state: QuoteState, 
    activeQuote?: Quote | null, 
    lead?: Lead | null,
    terminology?: { quote: string; generateQuote: string }
  ): QuoteAction[] {
    const actions: QuoteAction[] = [];

    // No quote exists - show generate action if lead has items
    if (!state.hasQuote && lead?.requestedItems && lead.requestedItems.length > 0) {
      actions.push({
        action: 'generate',
        label: terminology ? `🎯 ${terminology.generateQuote}` : '🎯 Generate Quote',
        icon: '🎯',
        buttonClass: 'ds-btn ds-btn-primary'
      });
    }

    // Quote exists - show state-based actions
    if (activeQuote) {
      // Always available actions
      actions.push({
        action: 'view',
        label: terminology ? `📄 View ${terminology.quote}` : '📄 View Quote',
        icon: '📄',
        buttonClass: 'ds-btn ds-btn-secondary'
      });

      actions.push({
        action: 'revise',
        label: terminology ? `✏️ Revise ${terminology.quote}` : '✏️ Revise Quote',
        icon: '✏️',
        buttonClass: 'ds-btn ds-btn-secondary'
      });

      // Status-specific actions
      if (activeQuote.status === 'pending' || activeQuote.status === 'under_review') {
        actions.push({
          action: 'send',
          label: terminology ? `📧 Send ${terminology.quote}` : '📧 Send Quote',
          icon: '📧',
          buttonClass: 'ds-btn ds-btn-primary'
        });
      }

      if (activeQuote.status === 'approved') {
        actions.push({
          action: 'generate_proforma',
          label: '📋 Send Proforma',
          icon: '📋',
          buttonClass: 'ds-btn ds-btn-primary'
        });
      }
    }

    return actions;
  }

  /**
   * Mark quote as sent and update lead status
   */
  static markQuoteSent(quoteId: string): boolean {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return false;

    // Update quote status
    quote.status = 'sent';
    quote.statusMessage = 'Quote sent to customer - Awaiting response';

    // Update lead status to quote_sent
    LeadStatusService.updateLeadStatus(quote.leadId, 'quote_sent', 'Quote sent to customer');
    
    // Update lead quote tracking
    this.updateLeadQuoteTracking(quote.leadId, quoteId, 'sent');

    return true;
  }

  /**
   * Mark quote as approved and update lead status
   */
  static markQuoteApproved(quoteId: string): boolean {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return false;

    // Update quote status
    quote.status = 'approved';
    quote.statusMessage = 'Quote approved by customer';
    quote.approvalDate = new Date().toISOString();

    // Update lead status to verbally_approved
    LeadStatusService.updateLeadStatus(quote.leadId, 'verbally_approved', 'Quote approved by customer');
    
    // Update lead quote tracking
    this.updateLeadQuoteTracking(quote.leadId, quoteId, 'approved');

    return true;
  }

  /**
   * Generate proforma invoice from quote and update lead status
   */
  static generateProformaFromQuote(quoteId: string): string | null {
    const quote = this.getQuoteById(quoteId);
    if (!quote || quote.status !== 'approved') return null;

    const proformaId = `PF-${quote.id}-${Date.now()}`;
    
    // Update quote details
    quote.proformaInvoiceId = proformaId;
    quote.statusMessage = `Proforma invoice ${proformaId} generated and sent`;
    quote.advancePaymentStatus = 'awaiting';

    // Update lead status to proforma_sent
    LeadStatusService.updateLeadStatus(quote.leadId, 'proforma_sent', `Proforma invoice ${proformaId} sent`);

    return proformaId;
  }

  /**
   * Mark quote as rejected and update lead status
   */
  static markQuoteRejected(quoteId: string, reason?: string): boolean {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return false;

    // Update quote status
    quote.status = 'rejected';
    quote.statusMessage = reason || 'Quote rejected by customer';

    // Update lead status to quote_rejected
    LeadStatusService.updateLeadStatus(quote.leadId, 'quote_rejected', reason || 'Quote rejected by customer');
    
    return true;
  }

  /**
   * Mark quote as expired and update lead status
   */
  static markQuoteExpired(quoteId: string): boolean {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return false;

    // Update quote status
    quote.status = 'expired';
    quote.statusMessage = 'Quote expired - validity period ended';

    // Update lead status to quote_expired
    LeadStatusService.updateLeadStatus(quote.leadId, 'quote_expired', 'Quote validity period expired');
    
    return true;
  }

  /**
   * Mark advance payment as received and convert lead
   */
  static markPaymentReceived(quoteId: string, amount: number): boolean {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return false;

    // Update quote payment status
    quote.advancePaymentStatus = 'received';
    quote.statusMessage = `Advance payment of ₹${amount.toLocaleString()} received - Converting to order`;

    // Update lead status to converted_to_order
    LeadStatusService.updateLeadStatus(quote.leadId, 'converted_to_order', `Advance payment received - ₹${amount.toLocaleString()}`);
    
    return true;
  }

  /**
   * Map lead action strings to valid QuoteAction types
   */
  private static mapLeadActionToQuoteAction(leadAction: string): QuoteAction['action'] {
    // Map lead actions to valid quote actions
    if (leadAction.includes('generate') || leadAction === 'send_quote') return 'generate';
    if (leadAction.includes('send')) return 'send';
    if (leadAction.includes('approve')) return 'approve';
    if (leadAction.includes('revise')) return 'revise';
    if (leadAction.includes('proforma')) return 'generate_proforma';
    if (leadAction.includes('view')) return 'view';
    
    // Default fallback to 'view' for unmapped actions
    return 'view';
  }

  /**
   * Get enhanced actions based on lead status
   */
  static getLeadBasedActions(leadId: string): QuoteAction[] {
    const leadActions = LeadStatusService.getAvailableActions(leadId);
    if (!leadActions) return [];

    const actions: QuoteAction[] = [];

    leadActions.availableActions.forEach(action => {
      let buttonClass = 'ds-btn ds-btn-secondary';
      let icon = '🔄';

      // Determine button styling based on action
      if (action.action.includes('send') || action.action.includes('generate')) {
        buttonClass = 'ds-btn ds-btn-primary';
        icon = '📧';
      } else if (action.action.includes('approved') || action.action.includes('payment')) {
        buttonClass = 'ds-btn ds-btn-success';
        icon = '✅';
      } else if (action.action.includes('rejected') || action.action.includes('failed')) {
        buttonClass = 'ds-btn ds-btn-danger';
        icon = '❌';
      }

      actions.push({
        action: this.mapLeadActionToQuoteAction(action.action),
        label: action.label,
        icon,
        buttonClass
      });
    });

    return actions;
  }

  // Helper methods
  private static getQuoteById(quoteId: string): Quote | undefined {
    return mockQuotes.find(quote => quote.id === quoteId);
  }

  private static getLeadById(leadId: string): Lead | undefined {
    return mockLeads.find(lead => lead.id === leadId);
  }

  private static getNextRevisionNumber(baseQuoteId: string): number {
    const quote = this.getQuoteById(baseQuoteId);
    if (!quote) return 1;

    const originalQuoteId = quote.parentQuoteId || baseQuoteId;
    const allRevisions = mockQuotes.filter(q => 
      q.id === originalQuoteId || q.parentQuoteId === originalQuoteId
    );

    return Math.max(...allRevisions.map(q => q.revisionNumber || 1)) + 1;
  }

  private static generateRevisionId(baseQuoteId: string, revisionNumber: number): string {
    return `${baseQuoteId}-R${revisionNumber}`;
  }

  private static markQuoteInactive(quoteId: string): void {
    const quote = this.getQuoteById(quoteId);
    if (quote) {
      quote.isActive = false;
      if (quote.status !== 'superseded') {
        quote.status = 'superseded';
        quote.statusMessage = `Quote superseded by revision`;
      }
    }
  }

  /**
   * Calculate quote changes between two quotes
   */
  static calculateQuoteChanges(oldQuote: Quote, newQuote: Quote): QuoteChanges {
    const changes: QuoteChanges = {};

    // Check pricing changes
    if (oldQuote.totalAmount !== newQuote.totalAmount) {
      changes.pricingAdjustments = {
        oldTotalAmount: oldQuote.totalAmount,
        newTotalAmount: newQuote.totalAmount,
        adjustmentReason: newQuote.revisionReason || 'Price adjustment'
      };
    }

    // Check item changes
    const oldItemCodes = oldQuote.items.map(item => item.itemCode);
    const newItemCodes = newQuote.items.map(item => item.itemCode);

    // Items added
    const addedItems = newQuote.items.filter(item => 
      !oldItemCodes.includes(item.itemCode)
    );
    if (addedItems.length > 0) {
      changes.itemsAdded = addedItems;
    }

    // Items removed
    const removedItemCodes = oldItemCodes.filter(code => 
      !newItemCodes.includes(code)
    );
    if (removedItemCodes.length > 0) {
      changes.itemsRemoved = removedItemCodes;
    }

    // Items modified
    const modifiedItems = newQuote.items
      .filter(newItem => {
        const oldItem = oldQuote.items.find(item => item.itemCode === newItem.itemCode);
        return oldItem && (
          oldItem.quantity !== newItem.quantity ||
          oldItem.rate !== newItem.rate ||
          oldItem.discount !== newItem.discount
        );
      })
      .map(newItem => {
        const oldItem = oldQuote.items.find(item => item.itemCode === newItem.itemCode)!;
        return {
          itemCode: newItem.itemCode,
          oldValues: {
            quantity: oldItem.quantity,
            rate: oldItem.rate,
            discount: oldItem.discount,
            taxableAmount: oldItem.taxableAmount
          },
          newValues: {
            quantity: newItem.quantity,
            rate: newItem.rate,
            discount: newItem.discount,
            taxableAmount: newItem.taxableAmount
          }
        };
      });

    if (modifiedItems.length > 0) {
      changes.itemsModified = modifiedItems;
    }

    return changes;
  }

  /**
   * Get revision summary for display
   */
  static getRevisionSummary(quoteId: string): string {
    const quote = this.getQuoteById(quoteId);
    if (!quote || !quote.parentQuoteId) return '';

    const parentQuote = this.getQuoteById(quote.parentQuoteId);
    if (!parentQuote) return '';

    const changes = this.calculateQuoteChanges(parentQuote, quote);
    const summaryParts: string[] = [];

    if (changes.pricingAdjustments) {
      const diff = changes.pricingAdjustments.newTotalAmount - changes.pricingAdjustments.oldTotalAmount;
      summaryParts.push(`Price ${diff > 0 ? 'increased' : 'decreased'} by ₹${Math.abs(diff).toLocaleString()}`);
    }

    if (changes.itemsAdded?.length) {
      summaryParts.push(`${changes.itemsAdded.length} item(s) added`);
    }

    if (changes.itemsRemoved?.length) {
      summaryParts.push(`${changes.itemsRemoved.length} item(s) removed`);
    }

    if (changes.itemsModified?.length) {
      summaryParts.push(`${changes.itemsModified.length} item(s) modified`);
    }

    return summaryParts.join(', ') || 'Quote revised';
  }

  /**
   * PHASE 1.3: Lead Quote Tracking Management
   */
  
  /**
   * Update lead quote tracking when quote actions are performed
   */
  static updateLeadQuoteTracking(
    leadId: string, 
    quoteId: string, 
    action: 'generated' | 'sent' | 'approved' | 'revised'
  ): boolean {
    const lead = this.getLeadById(leadId);
    if (!lead) return false;

    // Initialize quote tracking arrays if they don't exist
    if (!lead.quoteHistory) {
      lead.quoteHistory = [];
    }

    // Update active quote
    lead.activeQuoteId = quoteId;

    // Add to quote history if not already present
    if (!lead.quoteHistory.includes(quoteId)) {
      lead.quoteHistory.push(quoteId);
    }

    // Update action tracking
    lead.lastQuoteAction = action;
    lead.lastQuoteActionDate = new Date().toISOString();
    lead.quoteCount = lead.quoteHistory.length;

    return true;
  }

  /**
   * Get lead quote summary for display
   */
  static getLeadQuoteSummary(leadId: string): {
    hasQuotes: boolean;
    activeQuote?: Quote;
    totalQuotes: number;
    lastAction?: string;
    lastActionDate?: string;
  } {
    const lead = this.getLeadById(leadId);
    if (!lead) {
      return { hasQuotes: false, totalQuotes: 0 };
    }

    const activeQuote = lead.activeQuoteId ? this.getQuoteById(lead.activeQuoteId) : undefined;

    return {
      hasQuotes: !!(lead.quoteHistory && lead.quoteHistory.length > 0),
      activeQuote,
      totalQuotes: lead.quoteCount || 0,
      lastAction: lead.lastQuoteAction,
      lastActionDate: lead.lastQuoteActionDate
    };
  }

  /**
   * Check if lead has any quotes
   */
  static leadHasQuotes(leadId: string): boolean {
    const lead = this.getLeadById(leadId);
    return !!(lead?.quoteHistory && lead.quoteHistory.length > 0);
  }

  /**
   * Get all quotes for a lead with metadata
   */
  static getLeadQuotesList(leadId: string): {
    quote: Quote;
    isActive: boolean;
    revisionNumber: number;
  }[] {
    const quotes = this.getQuotesForLead(leadId);
    const lead = this.getLeadById(leadId);
    const activeQuoteId = lead?.activeQuoteId;

    return quotes.map(quote => ({
      quote,
      isActive: quote.id === activeQuoteId,
      revisionNumber: quote.revisionNumber || 1
    })).sort((a, b) => (b.revisionNumber || 1) - (a.revisionNumber || 1));
  }

  /**
   * Clear lead quote tracking (for testing/reset purposes)
   */
  static clearLeadQuoteTracking(leadId: string): boolean {
    const lead = this.getLeadById(leadId);
    if (!lead) return false;

    lead.activeQuoteId = undefined;
    lead.quoteHistory = [];
    lead.lastQuoteAction = undefined;
    lead.lastQuoteActionDate = undefined;
    lead.quoteCount = 0;

    return true;
  }
}

export default QuoteService;