// Lead Status Management Service
// Handles lead conversion status transitions and validation

import { Lead, Quote, mockLeads, mockQuotes } from '../data/salesMockData';

export type LeadConversionStatus = 
  | 'active_lead'        // Initial inquiry stage
  | 'quote_sent'         // Quote sent, awaiting response  
  | 'quote_rejected'     // Customer rejected quote - needs follow up
  | 'quote_expired'      // Quote expired - needs renewal/follow up
  | 'negotiation'        // In price/terms discussion/revision cycle
  | 'verbally_approved'  // Customer agreed verbally - ready for proforma
  | 'proforma_sent'      // Proforma invoice sent - awaiting payment
  | 'payment_failed'     // Advance payment failed - needs resolution
  | 'awaiting_payment'   // Payment pending - normal flow
  | 'converted_to_order'; // Successfully converted to customer

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'superseded';

export interface StatusTransitionRule {
  from: LeadConversionStatus;
  to: LeadConversionStatus;
  requiredAction: string;
  condition?: (lead: Lead, quote?: Quote) => boolean;
}

export interface LeadStatusActions {
  leadId: string;
  currentStatus: LeadConversionStatus;
  availableActions: {
    action: string;
    label: string;
    targetStatus: LeadConversionStatus;
    requiresQuote?: boolean;
  }[];
}

export class LeadStatusService {
  
  // Define valid status transitions
  private static statusTransitions: StatusTransitionRule[] = [
    // From active_lead
    { from: 'active_lead', to: 'quote_sent', requiredAction: 'send_quote' },
    
    // From quote_sent
    { from: 'quote_sent', to: 'quote_rejected', requiredAction: 'quote_rejected' },
    { from: 'quote_sent', to: 'quote_expired', requiredAction: 'quote_expired' },
    { from: 'quote_sent', to: 'verbally_approved', requiredAction: 'quote_approved' },
    { from: 'quote_sent', to: 'negotiation', requiredAction: 'start_negotiation' },
    
    // From quote_rejected
    { from: 'quote_rejected', to: 'negotiation', requiredAction: 'start_negotiation' },
    { from: 'quote_rejected', to: 'active_lead', requiredAction: 'restart_process' },
    
    // From quote_expired
    { from: 'quote_expired', to: 'active_lead', requiredAction: 'renew_interest' },
    { from: 'quote_expired', to: 'quote_sent', requiredAction: 'send_new_quote' },
    
    // From negotiation
    { from: 'negotiation', to: 'quote_sent', requiredAction: 'send_revised_quote' },
    { from: 'negotiation', to: 'verbally_approved', requiredAction: 'agree_on_terms' },
    { from: 'negotiation', to: 'quote_rejected', requiredAction: 'negotiation_failed' },
    
    // From verbally_approved
    { from: 'verbally_approved', to: 'proforma_sent', requiredAction: 'send_proforma' },
    { from: 'verbally_approved', to: 'negotiation', requiredAction: 'renegotiate_terms' },
    
    // From proforma_sent
    { from: 'proforma_sent', to: 'awaiting_payment', requiredAction: 'payment_initiated' },
    { from: 'proforma_sent', to: 'payment_failed', requiredAction: 'payment_failed' },
    { from: 'proforma_sent', to: 'converted_to_order', requiredAction: 'payment_received' },
    
    // From payment_failed
    { from: 'payment_failed', to: 'awaiting_payment', requiredAction: 'retry_payment' },
    { from: 'payment_failed', to: 'negotiation', requiredAction: 'renegotiate_payment' },
    
    // From awaiting_payment
    { from: 'awaiting_payment', to: 'converted_to_order', requiredAction: 'payment_received' },
    { from: 'awaiting_payment', to: 'payment_failed', requiredAction: 'payment_failed' },
  ];

  /**
   * Get current lead status
   */
  static getLeadStatus(leadId: string): LeadConversionStatus | null {
    const lead = this.getLeadById(leadId);
    return lead?.conversionStatus || null;
  }

  /**
   * Check if a status transition is valid
   */
  static isValidTransition(
    currentStatus: LeadConversionStatus, 
    targetStatus: LeadConversionStatus
  ): boolean {
    return this.statusTransitions.some(
      rule => rule.from === currentStatus && rule.to === targetStatus
    );
  }

  /**
   * Get available actions for a lead based on current status
   */
  static getAvailableActions(leadId: string): LeadStatusActions | null {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const availableTransitions = this.statusTransitions.filter(
      rule => rule.from === lead.conversionStatus
    );

    const actions = availableTransitions.map(transition => {
      const actionConfig = this.getActionConfig(transition.requiredAction, transition.to);
      return {
        action: transition.requiredAction,
        label: actionConfig.label,
        targetStatus: transition.to,
        requiresQuote: actionConfig.requiresQuote
      };
    });

    return {
      leadId,
      currentStatus: lead.conversionStatus,
      availableActions: actions
    };
  }

  /**
   * Execute a status transition
   */
  static updateLeadStatus(
    leadId: string, 
    targetStatus: LeadConversionStatus, 
    reason?: string
  ): boolean {
    const lead = this.getLeadById(leadId);
    if (!lead) return false;

    if (!this.isValidTransition(lead.conversionStatus, targetStatus)) {
      return false;
    }

    // Update lead status
    lead.conversionStatus = targetStatus;
    
    // Update timestamp
    lead.lastContact = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Add note about status change
    if (reason) {
      lead.notes = `${lead.notes}\nStatus updated to ${targetStatus}: ${reason}`;
    }

    // Handle special cases
    if (targetStatus === 'converted_to_order') {
      lead.convertedToOrderDate = new Date().toISOString();
    }

    return true;
  }

  /**
   * Update quote status based on lead status
   */
  static synchronizeQuoteStatus(leadId: string, quoteId: string): boolean {
    const lead = this.getLeadById(leadId);
    const quote = this.getQuoteById(quoteId);
    
    if (!lead || !quote) return false;

    // Map lead status to quote status
    const quoteStatusMap: Partial<Record<LeadConversionStatus, QuoteStatus>> = {
      'active_lead': 'draft',
      'quote_sent': 'sent',
      'quote_rejected': 'rejected',
      'quote_expired': 'expired',
      'negotiation': 'sent',
      'verbally_approved': 'approved',
      'proforma_sent': 'approved',
      'awaiting_payment': 'approved',
      'converted_to_order': 'approved'
    };

    const newQuoteStatus = quoteStatusMap[lead.conversionStatus];
    if (newQuoteStatus) {
      quote.status = newQuoteStatus;
      return true;
    }

    return false;
  }

  /**
   * Get status display information
   */
  static getStatusDisplayInfo(status: LeadConversionStatus): {
    label: string;
    color: string;
    icon: string;
    description: string;
  } {
    const statusInfo: Record<LeadConversionStatus, {
      label: string;
      color: string;
      icon: string;
      description: string;
    }> = {
      'active_lead': {
        label: 'Active Lead',
        color: 'blue',
        icon: '🎯',
        description: 'Lead is active, ready for quote generation'
      },
      'quote_sent': {
        label: 'Quote Sent',
        color: 'orange',
        icon: '📧',
        description: 'Quote sent to customer, awaiting response'
      },
      'quote_rejected': {
        label: 'Quote Rejected',
        color: 'red',
        icon: '❌',
        description: 'Customer rejected the quote, needs follow-up'
      },
      'quote_expired': {
        label: 'Quote Expired',
        color: 'gray',
        icon: '⏰',
        description: 'Quote validity expired, needs renewal'
      },
      'negotiation': {
        label: 'In Negotiation',
        color: 'yellow',
        icon: '🤝',
        description: 'Actively negotiating terms and pricing'
      },
      'verbally_approved': {
        label: 'Verbally Approved',
        color: 'green',
        icon: '✅',
        description: 'Customer verbally approved, ready for proforma'
      },
      'proforma_sent': {
        label: 'Proforma Sent',
        color: 'purple',
        icon: '📄',
        description: 'Proforma invoice sent, awaiting payment'
      },
      'payment_failed': {
        label: 'Payment Failed',
        color: 'red',
        icon: '💳',
        description: 'Payment failed, needs resolution'
      },
      'awaiting_payment': {
        label: 'Awaiting Payment',
        color: 'orange',
        icon: '💰',
        description: 'Waiting for advance payment'
      },
      'converted_to_order': {
        label: 'Converted',
        color: 'green',
        icon: '🎉',
        description: 'Successfully converted to customer'
      }
    };

    return statusInfo[status];
  }

  // Helper methods
  private static getLeadById(leadId: string): Lead | undefined {
    return mockLeads.find(lead => lead.id === leadId);
  }

  private static getQuoteById(quoteId: string): Quote | undefined {
    return mockQuotes.find(quote => quote.id === quoteId);
  }

  private static getActionConfig(action: string, targetStatus: LeadConversionStatus): {
    label: string;
    requiresQuote: boolean;
  } {
    const actionConfigs: Record<string, { label: string; requiresQuote: boolean }> = {
      'send_quote': { label: 'Send Quote', requiresQuote: true },
      'quote_rejected': { label: 'Mark as Rejected', requiresQuote: false },
      'quote_expired': { label: 'Mark as Expired', requiresQuote: false },
      'quote_approved': { label: 'Mark as Approved', requiresQuote: false },
      'start_negotiation': { label: 'Start Negotiation', requiresQuote: false },
      'restart_process': { label: 'Restart Process', requiresQuote: false },
      'renew_interest': { label: 'Renew Interest', requiresQuote: false },
      'send_new_quote': { label: 'Send New Quote', requiresQuote: true },
      'send_revised_quote': { label: 'Send Revised Quote', requiresQuote: true },
      'agree_on_terms': { label: 'Agree on Terms', requiresQuote: false },
      'negotiation_failed': { label: 'Negotiation Failed', requiresQuote: false },
      'send_proforma': { label: 'Send Proforma', requiresQuote: false },
      'renegotiate_terms': { label: 'Renegotiate Terms', requiresQuote: false },
      'payment_initiated': { label: 'Payment Initiated', requiresQuote: false },
      'payment_failed': { label: 'Payment Failed', requiresQuote: false },
      'payment_received': { label: 'Payment Received', requiresQuote: false },
      'retry_payment': { label: 'Retry Payment', requiresQuote: false },
      'renegotiate_payment': { label: 'Renegotiate Payment', requiresQuote: false }
    };

    return actionConfigs[action] || { label: action, requiresQuote: false };
  }
}

export default LeadStatusService;