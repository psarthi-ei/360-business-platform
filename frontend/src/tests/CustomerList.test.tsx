import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerList from '../components/CustomerList';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowCustomerProfile: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    customers: 'Customers',
    searchCustomers: 'Search customers by name, location, or specialization...',
    showAll: 'Show All',
    call: '📞 Call',
    whatsapp: '📱 WhatsApp',
    voiceCommandsHint: 'Try saying'
  },
  customerSearch: '',
  onCustomerSearchChange: jest.fn()
};

describe('CustomerList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI structure', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/customer list/i)).toBeInTheDocument();
  });

  test('displays search functionality', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
  });

  test('search input is interactive', () => {
    render(<CustomerList {...mockProps} />);
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Rajesh' } });
    
    expect(mockProps.onCustomerSearchChange).toHaveBeenCalledWith('Rajesh');
  });

  test('renders filter functionality', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /premium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new customers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
  });

  test('displays customers container', () => {
    render(<CustomerList {...mockProps} />);
    
    // Test customer content is displayed
    expect(screen.getByText(/rajesh textiles - ahmedabad/i)).toBeInTheDocument();
    expect(screen.getByText(/gujarat garments - surat/i)).toBeInTheDocument();
  });

  test('customers have clickable names', () => {
    render(<CustomerList {...mockProps} />);
    
    const customerName = screen.getByText(/rajesh textiles - ahmedabad/i);
    fireEvent.click(customerName);
    
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('rajesh-textiles');
  });

  test('customers have action buttons', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getAllByText(/call/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/whatsapp/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/view profile/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/new quote/i).length).toBeGreaterThan(0);
  });

  test('displays customer business information', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getAllByText(/customer since/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/total business/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/conversion rate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/payment status/i).length).toBeGreaterThan(0);
  });

  test('navigation works', () => {
    render(<CustomerList {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('language switcher is present', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ગુજરાતી/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  test('voice commands section exists', () => {
    render(<CustomerList {...mockProps} />);
    
    expect(screen.getByText(/try saying/i)).toBeInTheDocument();
  });

  test('component structure is accessible', () => {
    render(<CustomerList {...mockProps} />);
    
    // Test structural elements by content
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByText(/rajesh textiles - ahmedabad/i)).toBeInTheDocument();
  });
});