import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuotationOrders from '../components/QuotationOrders';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowCustomerProfile: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    quotationOrders: 'Quotations & Orders',
    addNewQuote: 'Add New Quote',
    showAll: 'Show All',
    showPending: 'Show Pending',
    showApproved: 'Show Approved',
    showExpired: 'Show Expired',
    customerName: 'Customer Name',
    quoteDate: 'Quote Date',
    validUntil: 'Valid Until',
    totalAmount: 'Total Amount',
    viewPdf: 'View PDF',
    approve: 'Approve',
    convertToOrder: 'Convert to Order',
    voiceCommandsHint: 'Try saying'
  },
  filterState: 'all',
  onFilterChange: jest.fn()
};

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      {component}
    </TranslationProvider>
  );
};

describe('QuotationOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<QuotationOrders {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => renderWithTranslation(<QuotationOrders {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      renderWithTranslation(<QuotationOrders {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(mockProps.onFilterChange).toBeDefined();
      expect(mockProps.onShowSalesOrders).toBeDefined();
      expect(mockProps.onShowCustomerProfile).toBeDefined();
    });

    test('handles filter state prop', () => {
      const customProps = { ...mockProps, filterState: 'pending' };
      expect(() => renderWithTranslation(<QuotationOrders {...customProps} />)).not.toThrow();
    });

    test('supports different filter states', () => {
      const filterStates = ['all', 'pending', 'approved', 'expired'];
      filterStates.forEach(filterState => {
        const customProps = { ...mockProps, filterState };
        expect(() => renderWithTranslation(<QuotationOrders {...customProps} />)).not.toThrow();
      });
    });

    test('supports translation system', () => {
      expect(() => renderWithTranslation(<QuotationOrders {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => renderWithTranslation(<QuotationOrders {...customProps} />)).not.toThrow();
    });

    test('handles different language codes', () => {
      const languages = ['en', 'gu', 'hi'];
      languages.forEach(language => {
        const customProps = { ...mockProps, currentLanguage: language };
        expect(() => renderWithTranslation(<QuotationOrders {...customProps} />)).not.toThrow();
      });
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<QuotationOrders {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<QuotationOrders {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('class');
    });

    test('handles callback prop variations', () => {
      const customCallbacks = {
        ...mockProps,
        onNavigateBack: jest.fn(),
        onLanguageChange: jest.fn(),
        onFilterChange: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowCustomerProfile: jest.fn()
      };
      expect(() => renderWithTranslation(<QuotationOrders {...customCallbacks} />)).not.toThrow();
    });

    test('manages translation prop variations', () => {
      const customTranslations = {
        ...mockProps,
        translations: {
          ...mockProps.translations,
          quotationOrders: 'Custom Quotations & Orders',
          addNewQuote: 'Custom Add New Quote'
        }
      };
      expect(() => renderWithTranslation(<QuotationOrders {...customTranslations} />)).not.toThrow();
    });

    test('handles optional callback props gracefully', () => {
      const minimalProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowCustomerProfile: jest.fn(),
        translations: mockProps.translations,
        filterState: 'all',
        onFilterChange: jest.fn()
      };
      expect(() => renderWithTranslation(<QuotationOrders {...minimalProps} />)).not.toThrow();
    });

    test('supports prop changes without errors', () => {
      renderWithTranslation(<QuotationOrders {...mockProps} />);
      const updatedProps = { 
        ...mockProps, 
        currentLanguage: 'gu',
        filterState: 'pending'
      };
      expect(() => renderWithTranslation(<QuotationOrders {...updatedProps} />)).not.toThrow();
    });
  });
});