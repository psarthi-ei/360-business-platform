// Basic Search Tests - Essential search functionality only
// Focus on core search behavior without complex interface dependencies

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
      id: 'TEST-PROFILE-001',
      companyName: 'Test Company',
      gstNumber: 'GST24TESTTEST1Z5',
      registeredAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India'
      },
      contactPerson: 'Test Contact',
      phone: '+91 98765 43210',
      email: 'test@testcompany.com',
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
      preferences: {
        paymentMethod: 'Bank Transfer',
        deliveryPreference: 'Office Pickup',
        qualityRequirements: 'Standard',
        communication: 'Email',
        specialNotes: 'Test notes'
      },
      priority: 'warm' as const
    }))
  };

  const mockDataSources = {
    leads: [
      {
        id: 'LEAD-001',
        companyName: 'Mumbai Cotton Mills',
        location: 'Mumbai, Maharashtra',
        business: 'Cotton Textile Manufacturing',
        contactPerson: 'Rajesh Patel',
        contact: '+91 98765 43210',
        inquiry: 'Cotton fabric order - 500 meters',
        budget: '₹2-3 Lakhs',
        timeline: '2-3 weeks',
        priority: 'hot' as const,
        lastContact: '2024-01-15',
        notes: 'Interested in bulk cotton fabric order for export',
        conversionStatus: 'active_lead' as const
      }
    ],
    customers: [
      {
        id: 'CUST-001',
        companyName: 'Surat Textiles',
        gstNumber: 'GST24ABCDE1234F1Z5',
        registeredAddress: {
          street: '123 Textile Street',
          city: 'Surat',
          state: 'Gujarat',
          pincode: '395007',
          country: 'India'
        },
        contactPerson: 'Anil Shah',
        phone: '+91 98765 54321',
        email: 'anil@surattextiles.com',
        customerStatus: 'customer' as const,
        businessType: 'Textile Manufacturing',
        specialization: 'Cotton Fabric Manufacturing',
        employeeCount: '50',
        establishedYear: '2010',
        totalOrders: 25,
        activeOrders: 3,
        totalRevenue: 5000000,
        averageOrderValue: 200000,
        creditLimit: 1000000,
        paymentScore: 85,
        creditStatus: 'good' as const,
        paymentBehavior: 'good' as const,
        preferences: {
          paymentMethod: 'Bank Transfer',
          deliveryPreference: 'Factory Pickup',
          qualityRequirements: 'Standard GSM 180',
          communication: 'WhatsApp Business',
          specialNotes: 'Prefers advance notice for large orders'
        },
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

    test('should find leads by company name', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Cotton');
      });

      const leadResults = result.current.searchResults.filter(r => r.type === 'lead');
      expect(leadResults.length).toBeGreaterThan(0);
      expect(leadResults[0].title).toContain('Cotton');
    });

    test('should find customers by company name', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Surat');
      });

      const customerResults = result.current.searchResults.filter(r => r.type === 'customer');
      expect(customerResults.length).toBeGreaterThan(0);
      expect(customerResults[0].title).toContain('Surat');
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

  describe('Textile Business Context', () => {
    test('should handle textile terminology searches', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('cotton');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
    });

    test('should handle Indian business location searches', () => {
      const { result } = renderHook(() => 
        useGlobalSearch(mockDataSources, mockNavigationHandlers)
      );

      act(() => {
        result.current.performGlobalSearch('Mumbai');
      });

      expect(result.current.searchResults.length).toBeGreaterThan(0);
    });

    test('should limit results to maximum 8 items', () => {
      const largeDataSet = {
        leads: Array.from({ length: 15 }, (_, i) => ({
          id: `LEAD-${String(i).padStart(3, '0')}`,
          companyName: `Mumbai Cotton Company ${i}`,
          location: `Mumbai, Maharashtra`,
          business: 'Cotton Textile Manufacturing',
          contactPerson: `Contact Person ${i}`,
          contact: `+91 98765 ${String(i).padStart(5, '0')}`,
          inquiry: `Cotton inquiry ${i}`,
          budget: '₹2-3 Lakhs',
          timeline: '2-3 weeks',
          priority: 'warm' as const,
          lastContact: '2024-01-15',
          notes: `Notes for company ${i}`,
          conversionStatus: 'active_lead' as const
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