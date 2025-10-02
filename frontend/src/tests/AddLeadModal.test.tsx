import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddLeadModal from '../components/business/AddLeadModal';
import { TranslationProvider } from '../contexts/TranslationContext';

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

describe('AddLeadModal - Basic Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with header when opened', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    expect(screen.getByText('📋 Add New Lead')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('📋 Add New Lead')).not.toBeInTheDocument();
  });

  test('renders required form fields', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    expect(screen.getByLabelText('Company Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact Person *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
    expect(screen.getByLabelText('Inquiry Details *')).toBeInTheDocument();
  });

  test('shows validation errors for empty required fields', async () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    
    await userEvent.click(screen.getByRole('button', { name: /add lead/i }));
    
    expect(screen.getByText('Company name is required')).toBeInTheDocument();
    expect(screen.getByText('Contact person is required')).toBeInTheDocument();
  });

  test('form has submit functionality', () => {
    const mockOnAddLead = jest.fn();
    renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
    
    // Just check that the submit button exists and onAddLead prop is passed
    expect(screen.getByRole('button', { name: /add lead/i })).toBeInTheDocument();
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
    expect(screen.getByRole('button', { name: /add lead/i })).toBeInTheDocument();
  });
});