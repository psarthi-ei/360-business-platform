import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerProfile from './CustomerProfile';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  customerId: 'rajesh-textiles',
  translations: {
    backToDashboard: '← Back to Dashboard',
    customerProfile: 'Customer Profile',
    createNewQuote: 'Create New Quote',
    customerSince: 'Customer Since',
    totalBusiness: 'Total Business',
    totalOrders: 'Total Orders',
    conversionRate: 'Conversion Rate',
    paymentScore: 'Payment Score',
    call: '📞 Call',
    whatsapp: '📱 WhatsApp',
    quoteHistory: 'Quote History',
    orderHistory: 'Order History',
    transactionHistory: 'Transaction History',
    businessInsights: 'Business Insights'
  }
};

describe('CustomerProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI structure', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/customer profile/i)).toBeInTheDocument();
    expect(screen.getAllByText(/create new quote/i).length).toBeGreaterThan(0);
  });

  test('displays customer main information', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByText(/rajesh textiles - ahmedabad/i)).toBeInTheDocument();
    expect(screen.getByText(/customer since/i)).toBeInTheDocument();
    expect(screen.getByText(/premium customer/i)).toBeInTheDocument();
  });

  test('shows contact information and action buttons', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByText(/primary contact/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument();
  });

  test('displays business statistics', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByText(/total business/i)).toBeInTheDocument();
    expect(screen.getByText(/total orders/i)).toBeInTheDocument();
    expect(screen.getByText(/conversion rate/i)).toBeInTheDocument();
    expect(screen.getByText(/payment score/i)).toBeInTheDocument();
  });

  test('shows section tabs', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /quote history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /order history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transaction history/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /business insights/i })).toBeInTheDocument();
  });

  test('navigation works', () => {
    render(<CustomerProfile {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('language switcher is present', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ગુજરાતી/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  test('voice commands section exists', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(document.querySelector('.voice-commands')).toBeInTheDocument();
    expect(screen.getByText(/try saying/i)).toBeInTheDocument();
  });

  test('component structure is accessible', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(document.querySelector('.customer-header')).toBeInTheDocument();
    expect(document.querySelector('.customer-stats')).toBeInTheDocument();
    expect(document.querySelector('.customer-sections')).toBeInTheDocument();
  });

  test('displays quote history data', () => {
    render(<CustomerProfile {...mockProps} />);
    
    expect(screen.getByText(/QT-2025-001/)).toBeInTheDocument();
    expect(screen.getByText(/converted/i)).toBeInTheDocument();
    expect(screen.getByText(/view pdf/i)).toBeInTheDocument();
  });
});