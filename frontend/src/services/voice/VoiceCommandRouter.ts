/**
 * Voice Command Router Service
 * Centralized routing for all voice commands in the unified architecture
 * 
 * This service provides:
 * - Universal routing for all voice commands
 * - Clean separation from App.tsx logic
 * - Consistent URL-based action pattern
 * - Easy maintenance and testing
 */

import { NavigateFunction } from 'react-router-dom';
import { ActionParams } from '../nlp/types';

export class VoiceCommandRouter {
  constructor(private navigate: NavigateFunction) {}

  /**
   * Main routing method for all voice commands
   * Uses universal routing pattern - same command works from any page
   */
  public routeVoiceCommand(actionType: string, params?: ActionParams): void {
    // eslint-disable-next-line no-console
    console.log('🎯 VoiceCommandRouter routing:', actionType, params);

    switch (actionType) {
      // ============================================================================
      // NAVIGATION COMMANDS - Direct page-to-page routing
      // ============================================================================
      case 'NAVIGATE_TO_DASHBOARD':
        this.navigate('/dashboard');
        break;
      case 'NAVIGATE_TO_LEADS':
      case 'SHOW_LEADS':
        this.navigate('/leads');
        break;
      case 'NAVIGATE_TO_QUOTES':
      case 'SHOW_QUOTES':
        this.navigate('/quotes');
        break;
      case 'NAVIGATE_TO_ORDERS':
      case 'SHOW_ORDERS':
        this.navigate('/orders');
        break;
      case 'NAVIGATE_TO_PAYMENTS':
      case 'SHOW_PAYMENTS':
        this.navigate('/payments');
        break;
      case 'NAVIGATE_TO_INVOICES':
      case 'SHOW_INVOICES':
        this.navigate('/invoices');
        break;
      case 'NAVIGATE_TO_CUSTOMERS':
      case 'SHOW_CUSTOMERS':
        this.navigate('/customers');
        break;
      case 'NAVIGATE_TO_INVENTORY':
      case 'SHOW_INVENTORY':
        this.navigate('/inventory');
        break;
      case 'NAVIGATE_TO_ANALYTICS':
      case 'SHOW_ANALYTICS':
        this.navigate('/analytics');
        break;

      // ============================================================================
      // ACTION COMMANDS - Universal URL-based routing
      // ============================================================================
      
      // Lead Management Actions
      case 'ADD_NEW_LEAD':
        this.navigate('/leads?action=add-lead');
        break;
      case 'SET_PRIORITY':
        if (params && 'leadId' in params && 'priority' in params) {
          this.navigate(`/leads?action=set-priority&leadId=${params.leadId}&priority=${params.priority}`);
        } else {
          // eslint-disable-next-line no-console
          console.warn('SET_PRIORITY requires leadId and priority parameters');
          this.navigate('/leads');
        }
        break;

      // Quote Management Actions
      case 'CREATE_QUOTE':
        this.navigate('/quotes?action=create-quote');
        break;
      case 'APPROVE_QUOTE':
        if (params && 'quoteId' in params) {
          this.navigate(`/quotes?action=approve-quote&quoteId=${params.quoteId}`);
        } else {
          this.navigate('/quotes');
        }
        break;

      // Order Management Actions
      case 'CREATE_ORDER':
        this.navigate('/orders?action=create-order');
        break;
      case 'UPDATE_ORDER_STATUS':
        if (params && 'orderId' in params && 'status' in params) {
          this.navigate(`/orders?action=update-status&orderId=${params.orderId}&status=${params.status}`);
        } else {
          this.navigate('/orders');
        }
        break;

      // Payment Management Actions
      case 'RECORD_PAYMENT':
        this.navigate('/payments?action=record-payment');
        break;
      case 'SEND_PAYMENT_REMINDER':
        if (params && 'customerId' in params) {
          this.navigate(`/payments?action=send-reminder&customerId=${params.customerId}`);
        } else {
          this.navigate('/payments');
        }
        break;

      // Customer Management Actions
      case 'ADD_NEW_CUSTOMER':
        this.navigate('/customers?action=add-customer');
        break;
      case 'UPDATE_CUSTOMER_INFO':
        if (params && 'customerId' in params) {
          this.navigate(`/customers?action=update-info&customerId=${params.customerId}`);
        } else {
          this.navigate('/customers');
        }
        break;

      // Inventory Management Actions
      case 'UPDATE_INVENTORY':
        this.navigate('/inventory?action=update-inventory');
        break;
      case 'ADD_NEW_ITEM':
        this.navigate('/inventory?action=add-item');
        break;

      // Invoice Management Actions
      case 'GENERATE_INVOICE':
        this.navigate('/invoices?action=generate-invoice');
        break;
      case 'SEND_INVOICE':
        if (params && 'invoiceId' in params) {
          this.navigate(`/invoices?action=send-invoice&invoiceId=${params.invoiceId}`);
        } else {
          this.navigate('/invoices');
        }
        break;

      // Analytics Actions
      case 'GENERATE_REPORT':
        this.navigate('/analytics?action=generate-report');
        break;
      case 'EXPORT_DATA':
        this.navigate('/analytics?action=export-data');
        break;

      // ============================================================================
      // SEARCH COMMANDS - Handled by handleUniversalSearch in App.tsx
      // ============================================================================
      case 'SEARCH':
      case 'GLOBAL_SEARCH':
        // Search commands are handled by handleUniversalSearch, not this router
        // eslint-disable-next-line no-console
        console.log('Search commands should be handled by handleUniversalSearch');
        break;

      // ============================================================================
      // UNKNOWN COMMANDS
      // ============================================================================
      default:
        // eslint-disable-next-line no-console
        console.warn('🤷 Unknown voice command:', actionType, 'Available commands documented in VoiceCommandRouter.ts');
        break;
    }
  }

  /**
   * Get available voice commands for documentation/debugging
   */
  public getAvailableCommands(): Record<string, string[]> {
    return {
      'Navigation Commands': [
        'NAVIGATE_TO_DASHBOARD', 'NAVIGATE_TO_LEADS', 'SHOW_LEADS',
        'NAVIGATE_TO_QUOTES', 'SHOW_QUOTES', 'NAVIGATE_TO_ORDERS', 'SHOW_ORDERS',
        'NAVIGATE_TO_PAYMENTS', 'SHOW_PAYMENTS', 'NAVIGATE_TO_INVOICES', 'SHOW_INVOICES',
        'NAVIGATE_TO_CUSTOMERS', 'SHOW_CUSTOMERS', 'NAVIGATE_TO_INVENTORY', 'SHOW_INVENTORY',
        'NAVIGATE_TO_ANALYTICS', 'SHOW_ANALYTICS'
      ],
      'Lead Actions': [
        'ADD_NEW_LEAD', 'SET_PRIORITY'
      ],
      'Quote Actions': [
        'CREATE_QUOTE', 'APPROVE_QUOTE'
      ],
      'Order Actions': [
        'CREATE_ORDER', 'UPDATE_ORDER_STATUS'
      ],
      'Payment Actions': [
        'RECORD_PAYMENT', 'SEND_PAYMENT_REMINDER'
      ],
      'Customer Actions': [
        'ADD_NEW_CUSTOMER', 'UPDATE_CUSTOMER_INFO'
      ],
      'Inventory Actions': [
        'UPDATE_INVENTORY', 'ADD_NEW_ITEM'
      ],
      'Invoice Actions': [
        'GENERATE_INVOICE', 'SEND_INVOICE'
      ],
      'Analytics Actions': [
        'GENERATE_REPORT', 'EXPORT_DATA'
      ]
    };
  }

  /**
   * Validate if a command is supported
   */
  public isValidCommand(actionType: string): boolean {
    const allCommands = Object.values(this.getAvailableCommands()).flat();
    return allCommands.includes(actionType);
  }
}

// Export singleton factory function for easy integration
export function createVoiceCommandRouter(navigate: NavigateFunction): VoiceCommandRouter {
  return new VoiceCommandRouter(navigate);
}