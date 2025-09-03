import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesOrders from './SalesOrders';
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
    
    // Test filter buttons exist
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show pending/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ready.*production/i })).toBeInTheDocument();
  });

  test('filter buttons are interactive', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /show pending/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pending');

    fireEvent.click(screen.getByRole('button', { name: /ready.*production/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('production');

    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays orders container', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that orders are displayed (without caring about specific content)
    expect(document.querySelector('.orders-container')).toBeInTheDocument();
    expect(document.querySelectorAll('.order-card').length).toBeGreaterThan(0);
  });

  test('orders have required fields', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that basic order fields exist (without caring about specific values)
    expect(screen.getByText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByText(/order date/i)).toBeInTheDocument();
    expect(screen.getByText(/total amount/i)).toBeInTheDocument();
    expect(screen.getByText(/order status/i)).toBeInTheDocument();
  });

  test('orders have action buttons', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that action buttons exist
    expect(screen.getByText(/view pdf/i)).toBeInTheDocument();
    expect(screen.getAllByText(/view payment status/i)).toHaveLength(2); // Button and voice command
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
    
    expect(document.querySelector('.voice-commands')).toBeInTheDocument();
    expect(screen.getByText(/try saying/i)).toBeInTheDocument();
  });

  test('component structure is accessible', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Test that important elements have proper structure
    expect(document.querySelector('.sales-orders-screen')).toBeInTheDocument();
    expect(document.querySelector('.screen-header')).toBeInTheDocument();
    expect(document.querySelector('.filters-section')).toBeInTheDocument();
    expect(document.querySelector('.orders-container')).toBeInTheDocument();
  });
});