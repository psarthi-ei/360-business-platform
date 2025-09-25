import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddLeadModal from '../components/AddLeadModal';
import { TranslationProvider } from '../contexts/TranslationContext';

/**
 * UC-L01: Create New Lead from Phone Inquiry
 * Comprehensive testing for AddLeadModal component
 */

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onAddLead: jest.fn()
};

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      {component}
    </TranslationProvider>
  );
};

describe('AddLeadModal - UC-L01: Create New Lead from Phone Inquiry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering Tests', () => {
    test('renders modal with header when opened', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    });

    test('does not render when isOpen is false', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} isOpen={false} />);
      
      expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
    });

    test('renders all required form fields', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Required fields with asterisk
      expect(screen.getByLabelText('Company Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact Person *')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
      expect(screen.getByLabelText('Inquiry Details *')).toBeInTheDocument();
    });

    test('renders all optional form fields', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Optional fields without asterisk
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
      expect(screen.getByLabelText('Business Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Budget Range')).toBeInTheDocument();
      expect(screen.getByLabelText('Timeline')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority Level')).toBeInTheDocument();
      expect(screen.getByLabelText('Additional Notes')).toBeInTheDocument();
    });

    test('renders form action buttons', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add lead/i })).toBeInTheDocument();
    });

    test('has proper form field types and attributes', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      expect(screen.getByLabelText('Company Name *')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Phone Number *')).toHaveAttribute('type', 'tel');
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('Company Name *')).toHaveAttribute('autoFocus');
    });
  });

  describe('Textile Industry Context Tests', () => {
    test('includes Gujarat textile cities in location dropdown', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Major Gujarat textile cities
      expect(screen.getByRole('option', { name: 'Surat' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Ahmedabad' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Vadodara' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Rajkot' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Bhavnagar' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
    });

    test('includes textile business types in dropdown', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Textile manufacturing types
      expect(screen.getByRole('option', { name: 'Cotton Textile Manufacturing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Silk Textile Manufacturing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Synthetic Textile Manufacturing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Fabric Dyeing & Printing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Garment Manufacturing' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Technical Textiles' })).toBeInTheDocument();
    });

    test('includes Indian currency budget ranges', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Indian textile order budget ranges
      expect(screen.getByRole('option', { name: 'Under ₹1 Lakh' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '₹1-5 Lakh' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '₹5-10 Lakh' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '₹25-50 Lakh' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Above ₹1 Crore' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'To be discussed' })).toBeInTheDocument();
    });

    test('includes textile-appropriate timeline options', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Timeline options suitable for textile manufacturing
      expect(screen.getByRole('option', { name: 'Immediate (Within 1 week)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Urgent (2-4 weeks)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Standard (1-2 months)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Planned (2-3 months)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Future (3-6 months)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Long-term (6+ months)' })).toBeInTheDocument();
    });

    test('includes priority levels with textile context', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      expect(screen.getByRole('option', { name: '🔥 Hot - Urgent Order' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '🔶 Warm - Planning Stage' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '🔵 Cold - Initial Inquiry' })).toBeInTheDocument();
    });

    test('has textile-specific placeholder text', () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      expect(screen.getByPlaceholderText('e.g., Surat Textiles Ltd.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g., Rajesh Patel')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+91 98765 43210')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/500 meters cotton fabric, 150 GSM/)).toBeInTheDocument();
    });
  });

  describe('Form Validation Tests', () => {
    test('shows validation errors for empty required fields', async () => {
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Try to submit without filling required fields
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      expect(screen.getByText('Contact person is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Inquiry details are required')).toBeInTheDocument();
    });

    test('validates phone number format', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Fill other required fields
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
      
      // Test invalid phone numbers
      const invalidPhoneNumbers = ['123', 'abc', '123abc'];
      
      for (const invalidPhone of invalidPhoneNumbers) {
        await userEvent.clear(screen.getByLabelText('Phone Number *'));
        await userEvent.type(screen.getByLabelText('Phone Number *'), invalidPhone);
        await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
        
        expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
      }
    });

    test('accepts valid phone number formats', async () => {
      
      const mockOnAddLead = jest.fn();
      renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
      
      // Valid phone number formats
      const validPhoneNumbers = [
        '9876543210',
        '+91 98765 43210',
        '+91-98765-43210',
        '98765 43210',
        '(0261) 2345678'
      ];
      
      for (const validPhone of validPhoneNumbers) {
        jest.clearAllMocks();
        
        // Fill required fields
        await userEvent.type(screen.getByLabelText('Company Name *'), 'Test Company');
        await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
        await userEvent.type(screen.getByLabelText('Phone Number *'), validPhone);
        await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
        
        await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
        
        await waitFor(() => {
          expect(mockOnAddLead).toHaveBeenCalled();
        });
        
        // Clear form for next iteration
        await userEvent.clear(screen.getByLabelText('Company Name *'));
        await userEvent.clear(screen.getByLabelText('Contact Person *'));
        await userEvent.clear(screen.getByLabelText('Phone Number *'));
        await userEvent.clear(screen.getByLabelText('Inquiry Details *'));
      }
    });

    test('clears validation errors when user starts typing', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Submit empty form to show errors
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      
      // Start typing in company name field
      await userEvent.type(screen.getByLabelText('Company Name *'), 'T');
      
      // Error should be cleared
      expect(screen.queryByText('Company name is required')).not.toBeInTheDocument();
    });

    test('highlights fields with validation errors', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Submit empty form
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Fields with errors should have error styling class
      expect(screen.getByLabelText('Company Name *')).toHaveClass('errorInput');
      expect(screen.getByLabelText('Contact Person *')).toHaveClass('errorInput');
      expect(screen.getByLabelText('Phone Number *')).toHaveClass('errorInput');
      expect(screen.getByLabelText('Inquiry Details *')).toHaveClass('errorInput');
    });
  });

  describe('Lead Creation Tests', () => {
    test('successfully creates lead with all required fields', async () => {
      
      const mockOnAddLead = jest.fn();
      renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
      
      // Fill required fields
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Surat Textiles Ltd.');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Rajesh Patel');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '+91 98765 43210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Need cotton fabric for manufacturing');
      
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledWith(
          expect.objectContaining({
            companyName: 'Surat Textiles Ltd.',
            contactPerson: 'Rajesh Patel',
            phone: '+91 98765 43210',
            inquiry: 'Need cotton fabric for manufacturing',
            contact: '+91 98765 43210', // Phone is used as primary contact
            priority: 'warm' // Default priority
          })
        );
      });
    });

    test('creates lead with complete textile industry data', async () => {
      
      const mockOnAddLead = jest.fn();
      renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
      
      // Fill all fields with textile-specific data
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Gujarat Cotton Mills');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Amit Shah');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Email'), 'amit@gujaratcotton.com');
      
      await userEvent.selectOptions(screen.getByLabelText('Location'), 'Surat');
      await userEvent.selectOptions(screen.getByLabelText('Business Type'), 'Cotton Textile Manufacturing');
      await userEvent.selectOptions(screen.getByLabelText('Budget Range'), '₹10-25 Lakh');
      await userEvent.selectOptions(screen.getByLabelText('Timeline'), 'Standard (1-2 months)');
      await userEvent.selectOptions(screen.getByLabelText('Priority Level'), 'hot');
      
      await userEvent.type(
        screen.getByLabelText('Inquiry Details *'), 
        'Need 1000 meters of 100% cotton fabric, 180 GSM, white color for shirt manufacturing'
      );
      await userEvent.type(
        screen.getByLabelText('Additional Notes'), 
        'Recurring monthly order, established client looking for competitive pricing'
      );
      
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledWith({
          companyName: 'Gujarat Cotton Mills',
          contactPerson: 'Amit Shah',
          phone: '9876543210',
          email: 'amit@gujaratcotton.com',
          location: 'Surat',
          business: 'Cotton Textile Manufacturing',
          budget: '₹10-25 Lakh',
          timeline: 'Standard (1-2 months)',
          priority: 'hot',
          inquiry: 'Need 1000 meters of 100% cotton fabric, 180 GSM, white color for shirt manufacturing',
          notes: 'Recurring monthly order, established client looking for competitive pricing',
          contact: '9876543210',
          designation: '',
          department: '',
          businessProfileId: undefined
        });
      });
    });

    test('creates lead with different priority levels', async () => {
      
      const mockOnAddLead = jest.fn();
      
      const priorities = [
        { value: 'hot', label: '🔥 Hot - Urgent Order' },
        { value: 'warm', label: '🔶 Warm - Planning Stage' },
        { value: 'cold', label: '🔵 Cold - Initial Inquiry' }
      ];
      
      for (const priority of priorities) {
        renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
        
        // Fill required fields
        await userEvent.type(screen.getByLabelText('Company Name *'), `${priority.value} Priority Company`);
        await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
        await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
        await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
        
        // Set priority
        await userEvent.selectOptions(screen.getByLabelText('Priority Level'), priority.value);
        
        await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
        
        await waitFor(() => {
          expect(mockOnAddLead).toHaveBeenCalledWith(
            expect.objectContaining({ priority: priority.value })
          );
        });
        
        jest.clearAllMocks();
      }
    });

    test('shows loading state during submission', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Fill required fields
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
      
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Should show loading text during submission
      expect(screen.getByText('Adding Lead...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /adding lead/i })).toBeDisabled();
    });

    test('resets form after successful submission', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Fill and submit form
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
      
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(mockProps.onClose).toHaveBeenCalled();
      });
      
      // Form fields should be reset (test by re-rendering modal)
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      expect(screen.getByLabelText('Company Name *')).toHaveValue('');
      expect(screen.getByLabelText('Contact Person *')).toHaveValue('');
      expect(screen.getByLabelText('Phone Number *')).toHaveValue('');
      expect(screen.getByLabelText('Inquiry Details *')).toHaveValue('');
    });
  });

  describe('UX and Interaction Tests', () => {
    test('closes modal when close button is clicked', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      await userEvent.click(screen.getByRole('button', { name: '×' }));
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('closes modal when cancel button is clicked', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    test('closes modal when clicking outside content area', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Click on overlay (outside modal content)
      const overlay = screen.getByTestId('modal-overlay') || document.querySelector('.modalOverlay');
      if (overlay) {
        await userEvent.click(overlay);
        expect(mockProps.onClose).toHaveBeenCalled();
      }
    });

    test('prevents modal close when clicking inside content', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Click inside modal content
      await userEvent.click(screen.getByText('📋 Add New Lead'));
      
      // Modal should not close
      expect(mockProps.onClose).not.toHaveBeenCalled();
    });

    test('clears errors when modal is closed and reopened', async () => {
      
      const { rerender } = renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Submit empty form to show errors
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      expect(screen.getByText('Company name is required')).toBeInTheDocument();
      
      // Close modal
      rerender(
        <TranslationProvider defaultLanguage="en">
          <AddLeadModal {...mockProps} isOpen={false} />
        </TranslationProvider>
      );
      
      // Reopen modal
      rerender(
        <TranslationProvider defaultLanguage="en">
          <AddLeadModal {...mockProps} isOpen={true} />
        </TranslationProvider>
      );
      
      // Errors should be cleared
      expect(screen.queryByText('Company name is required')).not.toBeInTheDocument();
    });

    test('handles special characters in form inputs', async () => {
      
      const mockOnAddLead = jest.fn();
      renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
      
      // Test special characters and unicode
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Company & Sons Pvt. Ltd.');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'José María Rodríguez');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '+91-98765-43210');
      await userEvent.type(
        screen.getByLabelText('Inquiry Details *'), 
        'Need "premium quality" fabric @ ₹500/meter (GSM: 150-180)'
      );
      await userEvent.type(
        screen.getByLabelText('Additional Notes'), 
        'Client requirements: 100% cotton, eco-friendly dyes, GOTS certified'
      );
      
      await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
      
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledWith(
          expect.objectContaining({
            companyName: 'Company & Sons Pvt. Ltd.',
            contactPerson: 'José María Rodríguez',
            phone: '+91-98765-43210',
            inquiry: 'Need "premium quality" fabric @ ₹500/meter (GSM: 150-180)',
            notes: 'Client requirements: 100% cotton, eco-friendly dyes, GOTS certified'
          })
        );
      });
    });

    test('maintains form state during modal interaction', async () => {
      
      renderWithTranslation(<AddLeadModal {...mockProps} />);
      
      // Start filling form
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Partial Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Partial Person');
      
      // Select dropdown options
      await userEvent.selectOptions(screen.getByLabelText('Location'), 'Surat');
      await userEvent.selectOptions(screen.getByLabelText('Priority Level'), 'hot');
      
      // Verify form state is maintained
      expect(screen.getByLabelText('Company Name *')).toHaveValue('Partial Company');
      expect(screen.getByLabelText('Contact Person *')).toHaveValue('Partial Person');
      expect(screen.getByLabelText('Location')).toHaveValue('Surat');
      expect(screen.getByLabelText('Priority Level')).toHaveValue('hot');
    });

    test('handles form submission with disabled button state', async () => {
      
      const mockOnAddLead = jest.fn();
      renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
      
      // Fill form
      await userEvent.type(screen.getByLabelText('Company Name *'), 'Test Company');
      await userEvent.type(screen.getByLabelText('Contact Person *'), 'Test Person');
      await userEvent.type(screen.getByLabelText('Phone Number *'), '9876543210');
      await userEvent.type(screen.getByLabelText('Inquiry Details *'), 'Test inquiry');
      
      // Submit and immediately try to submit again
      const submitButton = screen.getByRole('button', { name: /add lead/i });
      await userEvent.click(submitButton);
      
      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Adding Lead...')).toBeInTheDocument();
      
      // Verify only one submission occurs
      await waitFor(() => {
        expect(mockOnAddLead).toHaveBeenCalledTimes(1);
      });
    });
  });
});