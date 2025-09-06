import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesOrders from '../components/SalesOrders';
import { getCurrentTranslations } from '../utils/translations';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: getCurrentTranslations('en'),
  filterState: 'all',
  onFilterChange: jest.fn()
};

describe('SalesOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders core UI structure', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test core UI elements  
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/sales orders/i)).toBeInTheDocument();
  });

  test('renders filter functionality', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test filter buttons exist using accessible roles
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show pending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^ready for production$/i })).toBeInTheDocument();
  });

  test('filter buttons are interactive', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /show pending/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pending');

    fireEvent.click(screen.getByRole('button', { name: /^ready for production$/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('production');

    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays orders container', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that orders are displayed using content-based selectors
    expect(screen.getByText(/sales orders/i)).toBeInTheDocument();
    // Check for order-specific content instead of CSS classes
    expect(screen.getAllByText(/rajesh textiles/i).length).toBeGreaterThan(0);
  });

  test('orders have required fields', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that basic order fields exist (multiple orders may have same fields)
    expect(screen.getAllByText(/customer name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/order date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/total amount/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/order status/i).length).toBeGreaterThan(0);
  });

  test('orders have action buttons', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that action buttons exist - use getAllByText for multiple occurrences
    const pdfButtons = screen.getAllByText(/view pdf/i);
    expect(pdfButtons.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/payment.*status/i).length).toBeGreaterThan(0);
  });

  test('navigation works', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter is highlighted', () => {
    const activeProps = { ...mockProps, filterState: 'pending' };
    render(<SalesOrders {...activeProps} />);
    
    const pendingButton = screen.getByRole('button', { name: /show pending/i });
    expect(pendingButton).toHaveClass('active');
  });

  test('language switcher is present', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ગુજરાતી/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /हिंदी/i })).toBeInTheDocument();
  });

  test('voice commands section exists', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText(/try saying/i)).toBeInTheDocument();
  });

  test('component structure is accessible', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that important elements have proper structure by content
    expect(screen.getByText(/sales orders/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getAllByText(/rajesh textiles/i).length).toBeGreaterThan(0);
  });
});