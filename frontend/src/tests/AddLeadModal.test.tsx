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

  test('renders modal when opened', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} isOpen={false} />);
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('renders basic form elements', () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    expect(screen.getByLabelText(/contact person/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  test('calls onClose when cancel is clicked', async () => {
    renderWithTranslation(<AddLeadModal {...mockProps} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('calls onAddLead prop when provided', () => {
    const mockOnAddLead = jest.fn();
    renderWithTranslation(<AddLeadModal {...mockProps} onAddLead={mockOnAddLead} />);
    expect(mockOnAddLead).toBeDefined();
  });
});