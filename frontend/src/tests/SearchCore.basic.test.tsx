// Basic Search Tests - Core functionality only
// Simplified test focused on search behavior without complex data dependencies

import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from '../components/search/useGlobalSearch';

describe('Core Search Functionality', () => {
  const mockNavigationHandlers = {
    onShowLeadManagement: jest.fn(),
    onShowQuotationOrders: jest.fn(),
    onShowSalesOrders: jest.fn(),
    onShowCustomerList: jest.fn(),
    formatCurrency: jest.fn((amount: number) => `₹${amount.toLocaleString()}`),
    getBusinessProfileById: jest.fn(() => ({
      id: 'TEST-001',
      companyName: 'Test Company',
      gstNumber: 'GST24TEST123',
      registeredAddress: { street: 'Test St', city: 'Test City', state: 'TS', pincode: '123456', country: 'India' },
      contactPerson: 'Test Contact',
      phone: '+91 98765 43210',
      email: 'test@company.com',
      customerStatus: 'customer' as const,
      businessType: 'Test Business',
      specialization: 'Test Specialization',
      employeeCount: '10',
      establishedYear: '2020',
      totalOrders: 5,
      activeOrders: 1,
      totalRevenue: 1000000,
      averageOrderValue: 200000,
      creditLimit: 500000,
      paymentScore: 80,
      creditStatus: 'good' as const,
      paymentBehavior: 'good' as const,
      preferences: { paymentMethod: 'Bank Transfer', deliveryPreference: 'Office Pickup', qualityRequirements: 'Standard', communication: 'Email', specialNotes: 'Test notes' },
      priority: 'warm' as const
    }))
  };

  const mockDataSources = {
    leads: [],
    customers: [
      {
        id: 'CUST-001',
        companyName: 'Mumbai Cotton Mills',
        gstNumber: 'GST24TEST123',
        registeredAddress: { street: 'Test St', city: 'Mumbai', state: 'MH', pincode: '400001', country: 'India' },
        contactPerson: 'Test Contact',
        phone: '+91 98765 43210',
        email: 'test@mumbaicontton.com',
        customerStatus: 'customer' as const,
        businessType: 'Textile Manufacturing',
        specialization: 'Cotton Manufacturing',
        employeeCount: '50',
        establishedYear: '2010',
        totalOrders: 10,
        activeOrders: 2,
        totalRevenue: 1000000,
        averageOrderValue: 100000,
        creditLimit: 500000,
        paymentScore: 85,
        creditStatus: 'good' as const,
        paymentBehavior: 'good' as const,
        preferences: { paymentMethod: 'Bank Transfer', deliveryPreference: 'Factory Pickup', qualityRequirements: 'Standard', communication: 'Phone', specialNotes: 'None' },
        priority: 'warm' as const
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Search Operations', () => {
    test('should initialize with empty search state', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      expect(result.current.searchQuery).toBe('');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.showSearchResults).toBe(false);
    });

    test('should perform search and return results', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      expect(result.current.searchQuery).toBe('Mumbai');
      expect(result.current.searchResults.length).toBeGreaterThan(0);
      expect(result.current.showSearchResults).toBe(true);
    });

    test('should find customers by company name', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      const customerResults = result.current.searchResults.filter(r => r.type === 'customer');
      expect(customerResults.length).toBeGreaterThan(0);
      expect(customerResults[0].title).toContain('Mumbai');
    });
  });

  describe('Search State Management', () => {
    test('should clear search when query is empty', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);

      act(() => {
        result.current.performGlobalSearch('');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.showSearchResults).toBe(false);
    });

    test('should close search results and clear query', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      expect(result.current.searchQuery).toBe('Mumbai');
      expect(result.current.showSearchResults).toBe(true);

      act(() => {
        result.current.closeSearchResults();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.showSearchResults).toBe(false);
    });

    test('should clear all search state', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchQuery).toBe('');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.showSearchResults).toBe(false);
    });
  });

  describe('Core Search Behavior', () => {
    test('should handle empty results gracefully', () => {
      const emptyDataSources = { leads: [], customers: [] };
      
      const { result } = renderHook(() => 
        useGlobalSearch(emptyDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('NonExistent');
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.showSearchResults).toBe(true); // Search UI shows even with empty results
    });

    test('should limit results appropriately', () => {
      const largeDataSet = {
        customers: Array.from({ length: 15 }, (_, i) => ({
          id: `CUST-${i}`,
          companyName: `Mumbai Company ${i}`,
          gstNumber: `GST24TEST${i}`,
          registeredAddress: { street: 'Test St', city: 'Mumbai', state: 'MH', pincode: '400001', country: 'India' },
          contactPerson: `Contact ${i}`,
          phone: '+91 98765 43210',
          email: `test${i}@company.com`,
          customerStatus: 'customer' as const,
          businessType: 'Business',
          specialization: 'Manufacturing',
          employeeCount: '10',
          establishedYear: '2020',
          totalOrders: 5,
          activeOrders: 1,
          totalRevenue: 500000,
          averageOrderValue: 100000,
          creditLimit: 250000,
          paymentScore: 75,
          creditStatus: 'good' as const,
          paymentBehavior: 'good' as const,
          preferences: { paymentMethod: 'Bank Transfer', deliveryPreference: 'Office Pickup', qualityRequirements: 'Standard', communication: 'Email', specialNotes: 'None' },
          priority: 'warm' as const
        }))
      };

      const { result } = renderHook(() => 
        useGlobalSearch(largeDataSet, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      expect(result.current.searchResults.length).toBeLessThanOrEqual(8);
    });
  });
});