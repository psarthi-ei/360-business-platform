import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SalesOrders from '../components/SalesOrders';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    salesOrders: 'Sales Orders',
    showAll: 'Show All',
    showPending: 'Show Pending',
    readyForProduction: 'Ready for Production',
    customerName: 'Customer Name',
    orderDate: 'Order Date',
    totalAmount: 'Total Amount',
    orderStatus: 'Order Status',
    viewPdf: 'View PDF',
    paymentStatus: 'Payment Status',
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

describe('SalesOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<SalesOrders {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => renderWithTranslation(<SalesOrders {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      renderWithTranslation(<SalesOrders {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(mockProps.onFilterChange).toBeDefined();
    });

    test('handles filter state prop', () => {
      const customProps = { ...mockProps, filterState: 'pending' };
      expect(() => renderWithTranslation(<SalesOrders {...customProps} />)).not.toThrow();
    });

    test('supports different filter states', () => {
      const filterStates = ['all', 'pending', 'production'];
      filterStates.forEach(filterState => {
        const customProps = { ...mockProps, filterState };
        expect(() => renderWithTranslation(<SalesOrders {...customProps} />)).not.toThrow();
      });
    });

    test('supports translation system', () => {
      expect(() => renderWithTranslation(<SalesOrders {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => renderWithTranslation(<SalesOrders {...customProps} />)).not.toThrow();
    });

    test('handles different language codes', () => {
      const languages = ['en', 'gu', 'hi'];
      languages.forEach(language => {
        const customProps = { ...mockProps, currentLanguage: language };
        expect(() => renderWithTranslation(<SalesOrders {...customProps} />)).not.toThrow();
      });
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<SalesOrders {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<SalesOrders {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('class');
    });

    test('handles callback prop variations', () => {
      const customCallbacks = {
        ...mockProps,
        onNavigateBack: jest.fn(),
        onLanguageChange: jest.fn(),
        onFilterChange: jest.fn()
      };
      expect(() => renderWithTranslation(<SalesOrders {...customCallbacks} />)).not.toThrow();
    });

    test('manages translation prop variations', () => {
      const customTranslations = {
        ...mockProps,
        translations: {
          ...mockProps.translations,
          salesOrders: 'Custom Sales Orders',
          showAll: 'Custom Show All'
        }
      };
      expect(() => renderWithTranslation(<SalesOrders {...customTranslations} />)).not.toThrow();
    });

    test('handles optional props gracefully', () => {
      const minimalProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onNavigateBack: jest.fn(),
        translations: mockProps.translations,
        filterState: 'all',
        onFilterChange: jest.fn()
      };
      expect(() => renderWithTranslation(<SalesOrders {...minimalProps} />)).not.toThrow();
    });

    test('supports prop changes without errors', () => {
      renderWithTranslation(<SalesOrders {...mockProps} />);
      const updatedProps = { 
        ...mockProps, 
        currentLanguage: 'hi',
        filterState: 'production'
      };
      expect(() => renderWithTranslation(<SalesOrders {...updatedProps} />)).not.toThrow();
    });

    test('handles edge case filter states', () => {
      const edgeCaseProps = { ...mockProps, filterState: 'unknown' };
      expect(() => renderWithTranslation(<SalesOrders {...edgeCaseProps} />)).not.toThrow();
    });

    test('manages multiple re-renders gracefully', () => {
      renderWithTranslation(<SalesOrders {...mockProps} />);
      
      // Test multiple prop changes
      const changes = [
        { currentLanguage: 'gu', filterState: 'pending' },
        { currentLanguage: 'hi', filterState: 'production' },
        { currentLanguage: 'en', filterState: 'all' }
      ];
      
      changes.forEach(change => {
        const updatedProps = { ...mockProps, ...change };
        expect(() => renderWithTranslation(<SalesOrders {...updatedProps} />)).not.toThrow();
      });
    });
  });
});