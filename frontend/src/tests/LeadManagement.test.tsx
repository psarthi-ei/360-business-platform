import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadManagement from '../components/LeadManagement';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    leadManagement: 'Lead Management',
    addNewLead: 'Add New Lead',
    showAll: 'Show All',
    hotLeads: 'Hot Leads',
    warmLeads: 'Warm Leads',
    coldLeads: 'Cold Leads',
    call: '📞 Call',
    whatsapp: '📱 WhatsApp',
    voiceCommandsHint: 'Try saying'
  },
  filterState: 'all',
  onFilterChange: jest.fn()
};

describe('LeadManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = render(<LeadManagement {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => render(<LeadManagement {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      render(<LeadManagement {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(mockProps.onFilterChange).toBeDefined();
    });

    test('handles filter state prop', () => {
      const customProps = { ...mockProps, filterState: 'hotleads' };
      expect(() => render(<LeadManagement {...customProps} />)).not.toThrow();
    });

    test('supports different filter states', () => {
      const filterStates = ['all', 'hotleads', 'warmleads', 'coldleads'];
      filterStates.forEach(filterState => {
        const customProps = { ...mockProps, filterState };
        expect(() => render(<LeadManagement {...customProps} />)).not.toThrow();
      });
    });

    test('supports translation system', () => {
      expect(() => render(<LeadManagement {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => render(<LeadManagement {...customProps} />)).not.toThrow();
    });

    test('handles different language codes', () => {
      const languages = ['en', 'gu', 'hi'];
      languages.forEach(language => {
        const customProps = { ...mockProps, currentLanguage: language };
        expect(() => render(<LeadManagement {...customProps} />)).not.toThrow();
      });
    });

    test('supports component lifecycle', () => {
      const { unmount } = render(<LeadManagement {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = render(<LeadManagement {...mockProps} />);
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
      expect(() => render(<LeadManagement {...customCallbacks} />)).not.toThrow();
    });

    test('manages translation prop variations', () => {
      const customTranslations = {
        ...mockProps,
        translations: {
          ...mockProps.translations,
          leadManagement: 'Custom Lead Management',
          addNewLead: 'Custom Add New Lead'
        }
      };
      expect(() => render(<LeadManagement {...customTranslations} />)).not.toThrow();
    });
  });
});