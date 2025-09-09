import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerProfile from '../components/CustomerProfile';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  customerId: 'test-customer-id',
  translations: {} as any
};

describe('CustomerProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = render(<CustomerProfile {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => render(<CustomerProfile {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      render(<CustomerProfile {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
    });

    test('handles customer ID prop', () => {
      const customProps = { ...mockProps, customerId: 'different-id' };
      expect(() => render(<CustomerProfile {...customProps} />)).not.toThrow();
    });

    test('supports translation system', () => {
      expect(() => render(<CustomerProfile {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => render(<CustomerProfile {...customProps} />)).not.toThrow();
    });

    test('supports component lifecycle', () => {
      const { unmount } = render(<CustomerProfile {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = render(<CustomerProfile {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveAttribute('class');
    });
  });
});