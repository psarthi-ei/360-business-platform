import { mockBusinessProfiles, formatCurrency, getBusinessProfileById } from '../data/customerMockData';
import { mockLeads, mockQuotes, mockSalesOrders } from '../data/salesMockData';
import { NavigateFunction } from 'react-router-dom';

// Single source of truth for search data
export function getSearchDataSources() {
  return {
    leads: mockLeads,
    quotes: mockQuotes,
    salesOrders: mockSalesOrders,
    customers: mockBusinessProfiles
  };
}

// Single source of truth for search navigation
export function getSearchNavigationHandlers(navigate: NavigateFunction) {
  return {
    onShowLeadManagement: () => navigate('/leads'),
    onShowQuotationOrders: () => navigate('/quotes'),
    onShowSalesOrders: () => navigate('/orders'),
    onShowCustomerList: () => navigate('/customers'),
    formatCurrency,
    getBusinessProfileById
  };
}