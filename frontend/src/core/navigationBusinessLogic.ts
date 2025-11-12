import { NavigateFunction } from 'react-router-dom';
import { ActionParams } from '../services/nlp/types';

// Type definitions for state setters
export interface NavigationStateSetters {
  setSelectedCustomerId?: (customerId: string) => void;
  setServicesHubResetKey?: (updater: (prev: number) => number) => void;
  setCurrentBlogPostSlug?: (slug: string) => void;
}

// Single source of truth for navigation functions
export function createNavigationHelpers(navigate: NavigateFunction, stateSetters?: NavigationStateSetters) {
  return {
    showHomePage: () => navigate('/'),
    showDashboard: () => navigate('/platform/home'),
    showLeadManagement: (autoAction?: string, actionParams?: ActionParams) => {
      if (autoAction === 'add-lead' || autoAction === 'ADD_NEW_LEAD') {
        navigate('/platform/leads?action=add-lead');
      } else {
        navigate('/platform/leads');
      }
    },
    showSales: () => navigate('/platform/sales'),
    showSalesOrders: () => navigate('/platform/orders'),
    showPayments: () => navigate('/platform/sales?tab=receivables'),
    showInvoices: () => navigate('/platform/invoices'),
    showCustomerList: () => navigate('/platform/customers'),
    showCustomerProfile: (customerId: string) => navigate(`/platform/customers/${customerId}`),
    showInventory: () => navigate('/platform/procurement'),
    showProduction: () => navigate('/platform/production'),
    showFulfillment: () => navigate('/platform/fulfillment'),
    showAnalytics: () => navigate('/platform/production'),
    showLogin: () => navigate('/login'),
    showSignUp: () => navigate('/signup'),
    showServicesHub: () => navigate('/services'),
    showTurnaroundStories: () => navigate('/turnaround-stories'),
    showBlogHome: () => navigate('/blog'),
    showBlogPost: (slug: string) => navigate(`/blog/${slug}`),
    showAbout: () => navigate('/about'),
    showContact: () => navigate('/contact'),
    showQuoteFromLead: (leadId: string) => navigate(`/platform/quotes?from-lead=${leadId}`),
    showProfileCompletion: () => navigate('/profile-completion'),
    
    // Enhanced navigation functions with state management
    showCustomerProfileWithState: (customerId: string) => {
      if (stateSetters?.setSelectedCustomerId) {
        stateSetters.setSelectedCustomerId(customerId);
      }
      navigate(`/platform/customers/${customerId}`);
    },
    
    showServicesHubWithReset: () => {
      if (stateSetters?.setServicesHubResetKey) {
        stateSetters.setServicesHubResetKey(prev => prev + 1);
      }
      navigate('/services');
    },
    
    showBlogPostWithState: (slug: string) => {
      if (stateSetters?.setCurrentBlogPostSlug) {
        stateSetters.setCurrentBlogPostSlug(slug);
      }
      navigate(`/blog/${slug}`);
    }
  };
}