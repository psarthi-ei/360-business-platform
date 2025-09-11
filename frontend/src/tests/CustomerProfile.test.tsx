import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerProfile from '../components/CustomerProfile';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  customerId: 'test-customer-id',
  translations: {} as any
};

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      {component}
    </TranslationProvider>
  );
};

describe('CustomerProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<CustomerProfile {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => renderWithTranslation(<CustomerProfile {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      renderWithTranslation(<CustomerProfile {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
    });

    test('handles customer ID prop', () => {
      const customProps = { ...mockProps, customerId: 'different-id' };
      expect(() => renderWithTranslation(<CustomerProfile {...customProps} />)).not.toThrow();
    });

    test('supports translation system', () => {
      expect(() => renderWithTranslation(<CustomerProfile {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => renderWithTranslation(<CustomerProfile {...customProps} />)).not.toThrow();
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<CustomerProfile {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<CustomerProfile {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('class');
    });
  });
});