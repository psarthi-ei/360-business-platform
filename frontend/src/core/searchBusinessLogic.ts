import { mockLeads, mockQuotes, mockSalesOrders, mockBusinessProfiles } from '../data/mockData';
import { formatCurrency, getBusinessProfileById } from '../data/mockData';
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