import { NavigateFunction } from 'react-router-dom';
import { ActionParams } from '../services/nlp/types';

// Single source of truth for navigation functions
export function createNavigationHelpers(navigate: NavigateFunction) {
  return {
    showHomePage: () => navigate('/'),
    showDashboard: () => navigate('/dashboard'),
    showLeadManagement: (autoAction?: string, actionParams?: ActionParams) => {
      if (autoAction === 'add-lead' || autoAction === 'ADD_NEW_LEAD') {
        navigate('/leads?action=add-lead');
      } else {
        navigate('/leads');
      }
    },
    showQuotationOrders: () => navigate('/quotes'),
    showSalesOrders: () => navigate('/orders'),
    showPayments: () => navigate('/payments'),
    showInvoices: () => navigate('/invoices'),
    showCustomerList: () => navigate('/customers'),
    showCustomerProfile: (customerId: string) => navigate(`/customers/${customerId}`),
    showInventory: () => navigate('/inventory'),
    showFulfillment: () => navigate('/fulfillment'),
    showAnalytics: () => navigate('/analytics'),
    showLogin: () => navigate('/login'),
    showSignUp: () => navigate('/signup'),
    showServicesHub: () => navigate('/services'),
    showTurnaroundStories: () => navigate('/turnaround-stories'),
    showBlogHome: () => navigate('/blog'),
    showBlogPost: (slug: string) => navigate(`/blog/${slug}`),
    showAbout: () => navigate('/about'),
    showContact: () => navigate('/contact'),
    showQuoteFromLead: (leadId: string) => navigate(`/quotes?from-lead=${leadId}`),
    showProfileCompletion: () => navigate('/profile-completion')
  };
}