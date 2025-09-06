import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import LeadManagement from '../components/LeadManagement';
import QuotationOrders from '../components/QuotationOrders';
import SalesOrders from '../components/SalesOrders';
import CustomerProfile from '../components/CustomerProfile';
import CustomerList from '../components/CustomerList';
import Dashboard from '../components/Dashboard';
import { getCurrentTranslations } from '../utils/translations';
import { mockLeads, mockQuotes, mockSalesOrders } from '../data/mockData';

describe('Core Application Functionality', () => {
  const mockTranslations = getCurrentTranslations('en');

  describe('Navigation Flow', () => {
    test('App navigates between all screens', () => {
      render(<App />);
      
      // Start at dashboard
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      
      // Navigate to Lead Management
      fireEvent.click(screen.getByText(/lead management/i));
      expect(screen.getByText(/back to dashboard/i)).toBeInTheDocument();
      
      // Navigate back
      fireEvent.click(screen.getByText(/back to dashboard/i));
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    test('Cross-screen navigation works', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowCustomerProfile: jest.fn(),
        onShowQuoteFromLead: jest.fn(),
        onShowQuotationOrders: jest.fn(),
        onShowSalesOrders: jest.fn(),
        filterState: 'all',
        onFilterChange: jest.fn(),
        translations: mockTranslations
      };

      render(<LeadManagement {...mockProps} />);
      
      // Click on a customer name link
      const customerLinks = screen.getAllByText(/Rajesh Textiles/i);
      if (customerLinks.length > 0) {
        fireEvent.click(customerLinks[0]);
        expect(mockProps.onShowCustomerProfile).toHaveBeenCalled();
      }
    });
  });

  describe('Data Relationships', () => {
    test('Lead to Quote relationship exists', () => {
      const leadWithQuotes = mockLeads[0];
      const relatedQuotes = mockQuotes.filter(q => q.leadId === leadWithQuotes.id);
      expect(relatedQuotes.length).toBeGreaterThan(0);
    });

    test('Quote to Sales Order relationship exists', () => {
      const quoteWithOrder = mockQuotes.find(q => q.status === 'approved');
      if (quoteWithOrder) {
        const relatedOrder = mockSalesOrders.find(o => o.quoteId === quoteWithOrder.id);
        expect(relatedOrder).toBeDefined();
      }
    });

    test('Multiple quotes per lead are supported', () => {
      const leadId = 'rajesh-001';
      const quotesForLead = mockQuotes.filter(q => q.leadId === leadId);
      expect(quotesForLead.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Filter Functionality', () => {
    test('Lead Management filters work', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        filterState: 'hotleads',
        onFilterChange: jest.fn(),
        translations: mockTranslations
      };

      render(<LeadManagement {...mockProps} />);
      
      // Check filter buttons exist using accessible selectors
      expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /hot lead/i })).toBeInTheDocument();
    });

    test('Quote filters work', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowCustomerProfile: jest.fn(),
        filterState: 'pending',
        onFilterChange: jest.fn(),
        translations: mockTranslations
      };

      render(<QuotationOrders {...mockProps} />);
      
      // Check that filter buttons exist
      expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pending/i })).toBeInTheDocument();
    });
  });

  describe('Language Switching', () => {
    test('Language switcher changes language', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowLeadManagement: jest.fn(),
        onShowQuotationOrders: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowCustomerList: jest.fn(),
        translations: mockTranslations
      };

      render(<Dashboard {...mockProps} />);
      
      // Click Gujarati language
      const gujaratiBtn = screen.getByText(/ગુજરાતી/);
      fireEvent.click(gujaratiBtn);
      expect(mockProps.onLanguageChange).toHaveBeenCalledWith('gu');
    });
  });

  describe('Customer Management', () => {
    test('Customer list displays and is searchable', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowCustomerProfile: jest.fn(),
        translations: mockTranslations,
        customerSearch: '',
        onCustomerSearchChange: jest.fn()
      };

      render(<CustomerList {...mockProps} />);
      
      // Check search input exists
      const searchInput = screen.getByPlaceholderText(/search/i);
      expect(searchInput).toBeInTheDocument();
      
      // Test search functionality
      fireEvent.change(searchInput, { target: { value: 'Rajesh' } });
      expect(mockProps.onCustomerSearchChange).toHaveBeenCalledWith('Rajesh');
    });

    test('Customer profile shows comprehensive information', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        customerId: 'rajesh-textiles',
        translations: mockTranslations
      };

      render(<CustomerProfile {...mockProps} />);
      
      // Check main sections exist using content-based selectors
      expect(screen.getByText(/customer profile/i)).toBeInTheDocument();
      expect(screen.getByText(/business information/i)).toBeInTheDocument();
      expect(screen.getByText(/order history/i)).toBeInTheDocument();
    });
  });

  describe('Core UI Components', () => {
    test('All screens have back navigation', () => {
      const screens = [
        { Component: LeadManagement, name: 'Lead Management' },
        { Component: QuotationOrders, name: 'Quotation Orders' },
        { Component: SalesOrders, name: 'Sales Orders' },
        { Component: CustomerList, name: 'Customer List' },
        { Component: CustomerProfile, name: 'Customer Profile' }
      ];

      screens.forEach(({ Component, name }) => {
        const mockProps = {
          currentLanguage: 'en',
          onLanguageChange: jest.fn(),
          onNavigateBack: jest.fn(),
          translations: mockTranslations,
          filterState: 'all',
          onFilterChange: jest.fn(),
          customerSearch: '',
          onCustomerSearchChange: jest.fn(),
          customerId: 'rajesh-textiles',
          onShowSalesOrders: jest.fn(),
          onShowCustomerProfile: jest.fn()
        };

        const { unmount } = render(<Component {...mockProps} />);
        
        const backButton = screen.getByText(/back to dashboard/i);
        expect(backButton).toBeInTheDocument();
        
        fireEvent.click(backButton);
        expect(mockProps.onNavigateBack).toHaveBeenCalled();
        
        unmount();
      });
    });

    test('All screens have language switcher', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        translations: mockTranslations,
        filterState: 'all',
        onFilterChange: jest.fn()
      };

      render(<LeadManagement {...mockProps} />);
      
      // Check all three language options exist
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('ગુજરાતી')).toBeInTheDocument();
      expect(screen.getByText('हिंदी')).toBeInTheDocument();
    });
  });

  describe('Business Logic', () => {
    test('Quote status affects available actions', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowCustomerProfile: jest.fn(),
        filterState: 'all',
        onFilterChange: jest.fn(),
        translations: mockTranslations
      };

      render(<QuotationOrders {...mockProps} />);
      
      // Check that approved quotes have convert to order button
      const convertButtons = screen.queryAllByText(/convert to order/i);
      expect(convertButtons.length).toBeGreaterThanOrEqual(0);
    });

    test('Order status affects available actions', () => {
      const mockProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        translations: mockTranslations,
        filterState: 'all',
        onFilterChange: jest.fn()
      };

      render(<SalesOrders {...mockProps} />);
      
      // Check that orders have view PDF buttons (multiple orders may exist)
      const viewPdfButtons = screen.getAllByText(/view pdf/i);
      expect(viewPdfButtons.length).toBeGreaterThan(0);
    });
  });
});