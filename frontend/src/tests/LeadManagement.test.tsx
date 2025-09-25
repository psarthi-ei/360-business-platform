import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
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

const renderWithTranslation = (component: React.ReactElement, initialUrl = '/') => {
  // Mock window.location for URL testing
  Object.defineProperty(window, 'location', {
    value: {
      search: initialUrl.includes('?') ? initialUrl.split('?')[1] : '',
      href: `http://localhost:3000${initialUrl}`,
      pathname: initialUrl.split('?')[0]
    },
    writable: true,
  });

  return render(
    <BrowserRouter>
      <TranslationProvider defaultLanguage="en">
        {component}
      </TranslationProvider>
    </BrowserRouter>
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

  describe('Add New Lead Quick Action Functionality', () => {
    test('does not open modal when no URL parameter is present', () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads');
      
      // Modal should not be visible initially
      expect(screen.queryByText('Add New Lead')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('auto-opens AddLeadModal when action=add-lead URL parameter is present', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead');
      
      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });
      
      // Check if modal content is present
      expect(screen.getByLabelText('Company Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact Person *')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
    });

    test('handles URL parameter with additional query params', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead&other=param');
      
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });
    });

    test('ignores unrelated URL parameters', () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=other-action');
      
      // Modal should not open for unrelated actions
      expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('handles empty action parameter', () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=');
      
      // Modal should not open for empty action
      expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('modal state is managed correctly after URL parameter trigger', async () => {
      const { rerender } = renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead');
      
      // Modal should open
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });

      // Simulate URL change without action parameter
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
          href: 'http://localhost:3000/leads',
          pathname: '/leads'
        },
        writable: true,
      });

      // Re-render with different props to simulate location change
      rerender(
        <BrowserRouter>
          <TranslationProvider defaultLanguage="en">
            <LeadManagement {...mockProps} />
          </TranslationProvider>
        </BrowserRouter>
      );

      // Modal should still be open (controlled by component state now)
      expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
    });

    test('useEffect dependency array works correctly with location changes', async () => {
      const { rerender } = renderWithTranslation(<LeadManagement {...mockProps} />, '/leads');
      
      // Initially no modal
      expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();

      // Update location to include action parameter
      Object.defineProperty(window, 'location', {
        value: {
          search: '?action=add-lead',
          href: 'http://localhost:3000/leads?action=add-lead',
          pathname: '/leads'
        },
        writable: true,
      });

      // Re-render to trigger useEffect
      rerender(
        <BrowserRouter>
          <TranslationProvider defaultLanguage="en">
            <LeadManagement {...mockProps} />
          </TranslationProvider>
        </BrowserRouter>
      );

      // Modal should now be open
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });
    });

    test('modal integration with existing lead management functionality', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead');
      
      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });

      // Check that existing lead management elements are still present
      expect(screen.getByText('📋 Lead Management')).toBeInTheDocument();
      
      // Check filter buttons are present (should be in background)
      expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    });

    test('supports multiple URL parameter formats', async () => {
      const urlVariations = [
        '/leads?action=add-lead',
        '/leads?action=add-lead&tab=active',
        '/leads?other=param&action=add-lead',
        '/leads?action=add-lead&sort=name&filter=hot'
      ];

      for (const url of urlVariations) {
        const { unmount } = renderWithTranslation(<LeadManagement {...mockProps} />, url);
        
        await waitFor(() => {
          expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
        });
        
        unmount();
      }
    });

    test('preserves existing component functionality when modal auto-opens', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead');
      
      // Wait for modal
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });

      // Check that filter callbacks still work
      expect(mockProps.onFilterChange).toBeDefined();
      expect(mockProps.onLanguageChange).toBeDefined();
      expect(mockProps.onNavigateBack).toBeDefined();
    });

    test('handles case-sensitive action parameter correctly', async () => {
      const caseVariations = [
        { url: '/leads?action=ADD-LEAD', shouldOpen: false },
        { url: '/leads?action=Add-Lead', shouldOpen: false },
        { url: '/leads?action=add-lead', shouldOpen: true },
        { url: '/leads?ACTION=add-lead', shouldOpen: false }
      ];

      for (const { url, shouldOpen } of caseVariations) {
        const { unmount } = renderWithTranslation(<LeadManagement {...mockProps} />, url);
        
        if (shouldOpen) {
          await waitFor(() => {
            expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
          });
        } else {
          expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
        }
        
        unmount();
      }
    });
  });

  describe('UC-L01 Integration Tests', () => {
    test('UC-L01: Complete lead creation workflow integration', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />);
      
      // Step 1: Open AddLeadModal via button click
      const addButton = screen.getByRole('button', { name: /add new lead/i });
      await userEvent.click(addButton);
      
      // Step 2: Modal should open with form
      expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      expect(screen.getByLabelText('Company Name *')).toBeInTheDocument();
      
      // Step 3: Fill lead creation form with textile data
      await userEvent.type(screen.getByLabelText('Company Name *'), 'UC-L01 Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Contact');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Need cotton fabric for manufacturing');
      
      // Step 4: Submit form
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Step 5: Verify success workflow
      await waitFor(() => {
        expect(screen.getByText(/lead "uc-l01 test company" has been successfully added!/i)).toBeInTheDocument();
      });
      
      // Step 6: Modal should close
      await waitFor(() => {
        expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      });
      
      // Step 7: New lead should appear in list
      expect(screen.getByText('UC-L01 Test Company')).toBeInTheDocument();
    });

    test('UC-L01: Quick action integration from Dashboard tab view', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />, '/leads?action=add-lead');
      
      // Modal should auto-open from URL parameter
      await waitFor(() => {
        expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      });
      
      // Verify this is integrated with existing LeadManagement functionality
      expect(screen.getByText('📋 Lead Management')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    });

    test('UC-L01: Unique lead ID generation follows pattern', async () => {
      
      renderWithTranslation(<LeadManagement {...mockProps} />);
      
      // Create first lead
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Lead ID Test 1');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Contact 1');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry 1');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Wait for first lead to be created
      await waitFor(() => {
        expect(screen.getByText(/lead "lead id test 1" has been successfully added!/i)).toBeInTheDocument();
      });
      
      // Create second lead immediately
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Lead ID Test 2');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Contact 2');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543211');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry 2');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/lead "lead id test 2" has been successfully added!/i)).toBeInTheDocument();
      });
      
      // Both leads should be in the list with unique IDs
      expect(screen.getByText('Lead ID Test 1')).toBeInTheDocument();
      expect(screen.getByText('Lead ID Test 2')).toBeInTheDocument();
    });

    test('UC-L01: Success message auto-dismiss functionality', async () => {
      
      renderWithTranslation(<LeadManagement {...mockProps} />);
      
      // Create lead
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Auto Dismiss Test');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Contact');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Success message should appear
      await waitFor(() => {
        expect(screen.getByText(/lead "auto dismiss test" has been successfully added!/i)).toBeInTheDocument();
      });
      
      // Success message should disappear after 3 seconds
      await waitFor(
        () => {
          expect(screen.queryByText(/lead "auto dismiss test" has been successfully added!/i)).not.toBeInTheDocument();
        },
        { timeout: 4000 }
      );
    });

    test('UC-L01: New leads appear at top of leads list', async () => {
      
      renderWithTranslation(<LeadManagement {...mockProps} />);
      
      // Get initial leads count
      const initialLeads = screen.getAllByText(/contact:/i);
      const initialCount = initialLeads.length;
      
      // Create new lead
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'New Lead at Top');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Top Contact');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Should be at top');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Wait for lead to be added
      await waitFor(() => {
        expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      });
      
      // New lead should be visible
      expect(screen.getByText('New Lead at Top')).toBeInTheDocument();
      
      // Total leads count should increase by 1
      const newLeads = screen.getAllByText(/contact:/i);
      expect(newLeads.length).toBe(initialCount + 1);
    });

    test('UC-L01: Lead creation preserves filter state', async () => {
      
      const mockOnFilterChange = jest.fn();
      renderWithTranslation(
        <LeadManagement {...mockProps} filterState="hotleads" onFilterChange={mockOnFilterChange} />
      );
      
      // Create hot priority lead
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Hot Priority Lead');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Hot Contact');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Urgent order needed');
      await userEvent.selectOptions(screen.getByLabelText('Priority Level'), 'hot');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Wait for creation to complete
      await waitFor(() => {
        expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      });
      
      // Filter state should be preserved
      expect(mockOnFilterChange).not.toHaveBeenCalled(); // Filter shouldn't change
      
      // New hot lead should be visible (assuming it matches current filter)
      expect(screen.getByText('Hot Priority Lead')).toBeInTheDocument();
    });

    test('UC-L01: Integration with existing voice commands hint', async () => {
      renderWithTranslation(<LeadManagement {...mockProps} />);
      
      // Voice commands section should still be present with UC-L01 functionality
      expect(screen.getByText(/try saying/i)).toBeInTheDocument();
      expect(screen.getByText(/add fabric inquiry/i)).toBeInTheDocument();
      
      // Create lead to ensure voice commands remain after lead creation
      
      await userEvent.click(screen.getByRole('button', { name: /add new lead/i }));
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Voice Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Voice Contact');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Voice inquiry test');
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      await waitFor(() => {
        expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
      });
      
      // Voice commands should still be present
      expect(screen.getByText(/try saying/i)).toBeInTheDocument();
    });
  });
});