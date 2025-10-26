import { useState, useCallback } from 'react';
import { BusinessProfile } from '../../data/customerMockData';
import { Lead, Quote, SalesOrder } from '../../data/salesMockData';

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
  leads?: Lead[];
  quotes?: Quote[];
  salesOrders?: SalesOrder[];
  customers?: BusinessProfile[];
}

export interface SearchNavigationHandlers {
  onShowLeadManagement: () => void;
  onShowQuotationOrders: () => void;
  onShowSalesOrders: () => void;
  onShowCustomerList: () => void;
  formatCurrency: (amount: number) => string;
  getBusinessProfileById: (id: string) => BusinessProfile | undefined;
}

export function useGlobalSearch(
  dataSources: SearchDataSources,
  navigationHandlers: SearchNavigationHandlers,
  onSearchTriggered?: () => void
) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const performGlobalSearch = useCallback((query: string) => {
    // eslint-disable-next-line no-console
    console.log('performGlobalSearch called with:', query, 'dataSources:', {
      leads: dataSources.leads?.length || 0,
      quotes: dataSources.quotes?.length || 0,
      salesOrders: dataSources.salesOrders?.length || 0,
      customers: dataSources.customers?.length || 0
    });

    // Update search query state to show in input field
    setSearchQuery(query);

    // Note: Voice command cleaning is now handled by Universal Command Processor
    // This function receives clean search queries (e.g., "Mumbai" not "search Mumbai")
    if (!query.trim()) {
      // eslint-disable-next-line no-console
      console.log('performGlobalSearch called with empty query - clearing results');
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search in leads
    if (dataSources.leads) {
      dataSources.leads.forEach(lead => {
        const customer = navigationHandlers.getBusinessProfileById(lead.businessProfileId);
        const customerName = customer?.companyName || 'Unknown Customer';
        if (customerName.toLowerCase().includes(lowerQuery) ||
            lead.contactPerson.toLowerCase().includes(lowerQuery) ||
            lead.inquiry.toLowerCase().includes(lowerQuery) ||
            lead.priority.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'lead',
            title: customerName,
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
        const customer = quote.businessProfileId ? navigationHandlers.getBusinessProfileById(quote.businessProfileId) : null;
        const customerName = customer?.companyName || 'Unknown Customer';
        if (customerName.toLowerCase().includes(lowerQuery) ||
            quote.items.toLowerCase().includes(lowerQuery) ||
            quote.status.toLowerCase().includes(lowerQuery)) {
          results.push({
            type: 'quote',
            title: customerName,
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

    const finalResults = results.slice(0, 8); // Limit to 8 results
    // eslint-disable-next-line no-console
    console.log('Search completed. Found results:', finalResults.length, finalResults);
    setSearchResults(finalResults);
    setShowSearchResults(true);
    // eslint-disable-next-line no-console
    console.log('setShowSearchResults(true) called with results:', finalResults.length);
    
    // Trigger scroll callback if provided (for voice search)
    if (onSearchTriggered && finalResults.length > 0) {
      // Detect device type for optimal scroll behavior
      const isDesktop = window.innerWidth >= 768 && !('ontouchstart' in window);
      const delay = isDesktop ? 300 : 200; // Longer delay for desktop
      
      // Add delay to ensure DOM updates before scrolling
      setTimeout(() => {
        // Cross-browser scroll position detection
        const scrollTop = window.pageYOffset || 
                         document.documentElement.scrollTop || 
                         document.body.scrollTop || 
                         0;
        
        // Adjust threshold based on device type
        const scrollThreshold = isDesktop ? 150 : 100; // Larger threshold for desktop
        const isNearTop = scrollTop < scrollThreshold;
        
        // eslint-disable-next-line no-console
        console.log('🎯 Voice search scroll check - Device:', isDesktop ? 'Desktop' : 'Mobile', 
                   'scrollTop:', scrollTop, 'threshold:', scrollThreshold, 'isNearTop:', isNearTop, 'will scroll:', !isNearTop);
        
        if (!isNearTop) {
          // eslint-disable-next-line no-console
          console.log('🚀 Triggering scroll to search results');
          onSearchTriggered();
        } else {
          // eslint-disable-next-line no-console
          console.log('⏭️  User already near top - skipping scroll');
        }
      }, delay);
    }
  }, [dataSources, navigationHandlers, onSearchTriggered]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    // eslint-disable-next-line no-console
    console.log('Search query changed:', query);
    // eslint-disable-next-line no-console
    console.log('Raw input event:', e.target.value, 'type:', typeof e.target.value);
    setSearchQuery(query);
    performGlobalSearch(query);
  }, [performGlobalSearch]);

  const closeSearchResults = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('closeSearchResults called - clearing search query and hiding results');
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  }, []);

  const clearSearch = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('clearSearch called - clearing all search state');
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