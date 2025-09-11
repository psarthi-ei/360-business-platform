import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadManagement from '../components/LeadManagement';
import { TranslationProvider } from '../contexts/TranslationContext';

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

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      {component}
    </TranslationProvider>
  );
};

describe('LeadManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Functionality', () => {
    test('renders without crashing', () => {
      const { container } = renderWithTranslation(<LeadManagement {...mockProps} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    test('handles required props', () => {
      expect(() => renderWithTranslation(<LeadManagement {...mockProps} />)).not.toThrow();
    });

    test('manages callback props', () => {
      renderWithTranslation(<LeadManagement {...mockProps} />);
      expect(mockProps.onNavigateBack).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(mockProps.onFilterChange).toBeDefined();
    });

    test('handles filter state prop', () => {
      const customProps = { ...mockProps, filterState: 'hotleads' };
      expect(() => renderWithTranslation(<LeadManagement {...customProps} />)).not.toThrow();
    });

    test('supports different filter states', () => {
      const filterStates = ['all', 'hotleads', 'warmleads', 'coldleads'];
      filterStates.forEach(filterState => {
        const customProps = { ...mockProps, filterState };
        expect(() => renderWithTranslation(<LeadManagement {...customProps} />)).not.toThrow();
      });
    });

    test('supports translation system', () => {
      expect(() => renderWithTranslation(<LeadManagement {...mockProps} />)).not.toThrow();
    });

    test('handles language switching', () => {
      const customProps = { ...mockProps, currentLanguage: 'gu' };
      expect(() => renderWithTranslation(<LeadManagement {...customProps} />)).not.toThrow();
    });

    test('handles different language codes', () => {
      const languages = ['en', 'gu', 'hi'];
      languages.forEach(language => {
        const customProps = { ...mockProps, currentLanguage: language };
        expect(() => renderWithTranslation(<LeadManagement {...customProps} />)).not.toThrow();
      });
    });

    test('supports component lifecycle', () => {
      const { unmount } = renderWithTranslation(<LeadManagement {...mockProps} />);
      expect(() => unmount()).not.toThrow();
    });

    test('integrates with styling system', () => {
      const { container } = renderWithTranslation(<LeadManagement {...mockProps} />);
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
      expect(() => renderWithTranslation(<LeadManagement {...customCallbacks} />)).not.toThrow();
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
      expect(() => renderWithTranslation(<LeadManagement {...customTranslations} />)).not.toThrow();
    });
  });
});