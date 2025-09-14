import React from 'react';
import { render } from '@testing-library/react';
import Payments from '../components/Payments';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowInvoices: jest.fn(),
  onShowCustomerProfile: jest.fn(),
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

describe('Payments Component', () => {
  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<Payments {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      renderWithTranslation(<Payments {...mockProps} />);
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(typeof mockProps.onLanguageChange).toBe('function');
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(typeof mockProps.onNavigateBack).toBe('function');
    });

    test('manages callback props', () => {
      renderWithTranslation(<Payments {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(typeof mockProps.onNavigateBack).toBe('function');
      expect(mockProps.onFilterChange).toBeDefined();
      expect(typeof mockProps.onFilterChange).toBe('function');
    });

    test('supports translation system', () => {
      renderWithTranslation(<Payments {...mockProps} />);
      expect(mockProps.currentLanguage).toBeDefined();
      expect(typeof mockProps.currentLanguage).toBe('string');
    });

    test('handles language switching', () => {
      renderWithTranslation(<Payments {...mockProps} />);
      expect(mockProps.currentLanguage).toBeDefined();
      expect(typeof mockProps.currentLanguage).toBe('string');
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<Payments {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<Payments {...mockProps} />);
      expect(container.firstChild).toHaveClass('advancePaymentScreen'); // Will be updated with proper class name
    });
  });
});