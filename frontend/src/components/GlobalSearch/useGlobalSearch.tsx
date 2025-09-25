import { useState, useCallback } from 'react';

// Types for search functionality
export interface SearchResult {
  type: 'lead' | 'quote' | 'order' | 'customer';
  title: string;
  subtitle: string;
  priority?: string;
  status?: string;
  action: () => void;
  category: 'NEW INQUIRIES' | 'ACTIVE BUSINESS' | 'CUSTOMERS';
}

export interface SearchDataSources {
  leads?: any[];
  quotes?: any[];
  salesOrders?: any[];
  customers?: any[];
}

export interface SearchNavigationHandlers {
  onShowLeadManagement: () => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerList: () => void;
  formatCurrency: (amount: number) => string;
  getBusinessProfileById: (id: string) => any;
}

export function useGlobalSearch(
  dataSources: SearchDataSources,
  navigationHandlers: SearchNavigationHandlers
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const performGlobalSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search in leads
    if (dataSources.leads) {
      dataSources.leads.forEach(lead => {
        if (lead.companyName.toLowerCase().includes(lowerQuery) ||
            lead.contactPerson.toLowerCase().includes(lowerQuery) ||
            lead.inquiry.toLowerCase().includes(lowerQuery) ||
            lead.priority.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'lead',
            title: lead.companyName,
            subtitle: `${lead.contactPerson} - ${lead.inquiry}`,
            priority: lead.priority,
            action: () => navigationHandlers.onShowLeadManagement(),
            category: 'NEW INQUIRIES'
          });
        }
      });
    }

    // Search in quotes
    if (dataSources.quotes) {
      dataSources.quotes.forEach(quote => {
        if (quote.companyName.toLowerCase().includes(lowerQuery) ||
            quote.items.toLowerCase().includes(lowerQuery) ||
            quote.status.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'quote',
            title: quote.companyName,
            subtitle: `${quote.items.split(' - ')[0]} - ${navigationHandlers.formatCurrency(quote.totalAmount)}`,
            status: quote.status,
            action: () => navigationHandlers.onShowQuotationOrders(),
            category: 'ACTIVE BUSINESS'
          });
        }
      });
    }

    // Search in sales orders
    if (dataSources.salesOrders) {
      dataSources.salesOrders.forEach(order => {
        const customer = navigationHandlers.getBusinessProfileById(order.businessProfileId);
        const customerName = customer?.companyName || 'Unknown Customer';
        if (customerName.toLowerCase().includes(lowerQuery) ||
            order.items.toLowerCase().includes(lowerQuery) ||
            order.status.toLowerCase().includes(lowerQuery) ||
            (order.paymentStatus && order.paymentStatus.toLowerCase().includes(lowerQuery))) {
          results.push({
            type: 'order',
            title: customerName,
            subtitle: `${order.items.split(' - ')[0]} - ${navigationHandlers.formatCurrency(order.totalAmount)}`,
            status: order.status,
            action: () => navigationHandlers.onShowSalesOrders(),
            category: 'ACTIVE BUSINESS'
          });
        }
      });
    }

    // Search in customers
    if (dataSources.customers) {
      dataSources.customers.forEach(profile => {
        if (profile.companyName.toLowerCase().includes(lowerQuery) ||
            profile.contactPerson.toLowerCase().includes(lowerQuery) ||
            profile.businessType.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'customer',
            title: profile.companyName,
            subtitle: `${profile.contactPerson} - ${profile.businessType}`,
            status: profile.customerStatus,
            action: () => navigationHandlers.onShowCustomerList(),
            category: 'CUSTOMERS'
          });
        }
      });
    }

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowSearchResults(true);
  }, [dataSources, navigationHandlers]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performGlobalSearch(query);
  }, [performGlobalSearch]);

  const closeSearchResults = useCallback(() => {
    setShowSearchResults(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    showSearchResults,
    handleSearchChange,
    closeSearchResults,
    clearSearch,
    performGlobalSearch
  };
}