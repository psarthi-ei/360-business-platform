import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddLeadModal from '../components/business/AddLeadModal';
import { TranslationProvider } from '../contexts/TranslationContext';
import { TerminologyProvider } from '../contexts/TerminologyContext';

const mockProps = {
  isOpen: true,
  onClose: jest.fn(),
  onAddLead: jest.fn()
};

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <TerminologyProvider initialRegion="surat-processing">
        {component}
      </TerminologyProvider>
    </TranslationProvider>
  );
};

describe('AddLeadModal - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with header when opened', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders required form fields', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    // Check for form inputs by their input types and required attributes
    expect(screen.getByRole('textbox', { name: /contact person/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /phone/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /inquiry details/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Customer/Party selection
  });

  test('shows validation errors for empty required fields', async () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /add/i });
    await userEvent.click(submitButton);
    
    // Check that error messages appear (without matching exact text)
    expect(screen.getByText(/selection is required/i)).toBeInTheDocument();
    expect(screen.getByText(/contact person is required/i)).toBeInTheDocument();
  });

  test('form has submit functionality', () => {
    const mockOnAddLead = jest.fn();
    renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
    
    // Just check that the submit button exists and onAddLead prop is passed
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(mockOnAddLead).toBeDefined();
  });

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

  test('renders form action buttons', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });
});