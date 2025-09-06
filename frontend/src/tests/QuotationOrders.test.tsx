import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuotationOrders from '../components/QuotationOrders';
import { getCurrentTranslations } from '../utils/translations';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowCustomerProfile: jest.fn(),
  translations: getCurrentTranslations('en'),
  filterState: 'all',
  onFilterChange: jest.fn()
};

describe('QuotationOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI structure', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test core UI elements
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/quotations.*orders/i)).toBeInTheDocument();
    expect(screen.getByText(/add.*quote/i)).toBeInTheDocument();
  });

  test('renders filter functionality', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test filter buttons exist
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show pending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show approved/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show expired/i })).toBeInTheDocument();
  });

  test('filter buttons are interactive', () => {
    render(<QuotationOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /show pending/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pending');

    fireEvent.click(screen.getByRole('button', { name: /show approved/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('approved');

    fireEvent.click(screen.getByRole('button', { name: /show expired/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('expired');

    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays quotes container', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test that quotes are displayed by checking for quote content
    expect(screen.getAllByText(/QT-001/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/rajesh textiles/i).length).toBeGreaterThan(0);
  });

  test('quotes have required fields', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test that basic quote fields exist (without caring about specific values)
    expect(screen.getAllByText(/customer name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/quote date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/valid until/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/total amount/i).length).toBeGreaterThan(0);
  });

  test('quotes have action buttons', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test that action buttons exist
    expect(screen.getAllByText(/view pdf/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/approve/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/convert.*order/i).length).toBeGreaterThan(0);
  });

  test('navigation works', () => {
    render(<QuotationOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter is highlighted', () => {
    const activeProps = { ...mockProps, filterState: 'pending' };
    render(<QuotationOrders {...activeProps} />);
    
    const pendingButton = screen.getByRole('button', { name: /show pending/i });
    expect(pendingButton).toHaveClass('active');
  });

  test('language switcher is present', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ગુજરાતી/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  test('voice commands section exists', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText(/try saying/i)).toBeInTheDocument();
  });

  test('component structure is accessible', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Test that important elements have proper structure by content
    expect(screen.getByText(/quotations.*orders/i)).toBeInTheDocument();
    expect(screen.getByText(/add.*quote/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getAllByText(/QT-001/i).length).toBeGreaterThan(0);
  });
});