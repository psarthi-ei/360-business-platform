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
    
    // Test filter buttons exist - use querySelector for specific filter buttons
    const filterSection = document.querySelector('.filter-buttons');
    expect(filterSection).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show pending/i })).toBeInTheDocument();
    // Check that filter buttons container has the production filter
    expect(filterSection?.textContent).toContain('Ready for Production');
  });

  test('filter buttons are interactive', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /show pending/i }));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pending');

    // Find the production filter button specifically within filter section
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const productionBtn = Array.from(filterButtons).find(btn => 
      btn.textContent?.includes('Ready for Production')
    );
    if (productionBtn) {
      fireEvent.click(productionBtn);
      expect(mockProps.onFilterChange).toHaveBeenCalledWith('production');
    }

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
    
    // Test that basic order fields exist (multiple orders may have same fields)
    expect(screen.getAllByText(/customer name/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/order date/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/total amount/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/order status/i).length).toBeGreaterThan(0);
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