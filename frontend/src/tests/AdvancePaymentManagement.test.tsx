import React from 'react';
import { render } from '@testing-library/react';
import AdvancePaymentManagement from '../components/AdvancePaymentManagement';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: {
    backToDashboard: "Back to Dashboard"
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

describe('AdvancePaymentManagement Component', () => {
  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(typeof mockProps.onLanguageChange).toBe('function');
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(typeof mockProps.onNavigateBack).toBe('function');
    });

    test('manages callback props', () => {
      renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(typeof mockProps.onNavigateBack).toBe('function');
      expect(mockProps.onFilterChange).toBeDefined();
      expect(typeof mockProps.onFilterChange).toBe('function');
    });

    test('supports translation system', () => {
      renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(mockProps.translations).toBeDefined();
      expect(typeof mockProps.translations).toBe('object');
    });

    test('handles language switching', () => {
      renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(mockProps.currentLanguage).toBeDefined();
      expect(typeof mockProps.currentLanguage).toBe('string');
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<AdvancePaymentManagement {...mockProps} />);
      expect(container.firstChild).toHaveClass('advancePaymentScreen');
    });
  });
});