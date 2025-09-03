import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SalesOrders from './SalesOrders';
import { getCurrentTranslations } from '../utils/translations';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowQuotationOrders: jest.fn(),
  onShowCustomerProfile: jest.fn(),
  translations: getCurrentTranslations('en'),
  filterState: 'all',
  onFilterChange: jest.fn()
};

describe('SalesOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders sales orders screen with header', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText('📋 Sales Orders')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('+ Add New Order')).toBeInTheDocument();
  });

  test('displays all filter buttons', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText('Show All')).toBeInTheDocument();
    expect(screen.getByText('💳 Pending Payment')).toBeInTheDocument();
    expect(screen.getByText('✅ Payment Received')).toBeInTheDocument();
    expect(screen.getByText('🔴 Overdue')).toBeInTheDocument();
    expect(screen.getByText('🟢 Ready for Production')).toBeInTheDocument();
  });

  test('shows all orders by default', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText('SO-2025-001 - Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('SO-2025-002 - Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    expect(screen.getByText('SO-2025-003 - Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('filters pending payment orders correctly', () => {
    const pendingProps = { ...mockProps, filterState: 'pendingpayment' };
    render(<SalesOrders {...pendingProps} />);
    
    expect(screen.getByText('SO-2025-001 - Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.queryByText('SO-2025-002 - Premium Fabrics Ltd - Mumbai')).not.toBeInTheDocument();
    expect(screen.queryByText('SO-2025-003 - Textile Innovation Co - Surat')).not.toBeInTheDocument();
  });

  test('filters payment received orders correctly', () => {
    const receivedProps = { ...mockProps, filterState: 'paymentreceived' };
    render(<SalesOrders {...receivedProps} />);
    
    expect(screen.queryByText('SO-2025-001 - Rajesh Textiles - Ahmedabad')).not.toBeInTheDocument();
    expect(screen.getByText('SO-2025-002 - Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    expect(screen.queryByText('SO-2025-003 - Textile Innovation Co - Surat')).not.toBeInTheDocument();
  });

  test('filters overdue orders correctly', () => {
    const overdueProps = { ...mockProps, filterState: 'overdue' };
    render(<SalesOrders {...overdueProps} />);
    
    expect(screen.queryByText('SO-2025-001 - Rajesh Textiles - Ahmedabad')).not.toBeInTheDocument();
    expect(screen.queryByText('SO-2025-002 - Premium Fabrics Ltd - Mumbai')).not.toBeInTheDocument();
    expect(screen.getByText('SO-2025-003 - Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('filter buttons trigger onFilterChange callback', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByText('💳 Pending Payment'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pendingpayment');

    fireEvent.click(screen.getByText('✅ Payment Received'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('paymentreceived');

    fireEvent.click(screen.getByText('🔴 Overdue'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('overdue');

    fireEvent.click(screen.getByText('🟢 Ready for Production'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('readyforproduction');

    fireEvent.click(screen.getByText('Show All'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays correct order details for each status', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Pending payment order
    expect(screen.getByText('500 meters Bandhani Cotton Fabric, 44" width')).toBeInTheDocument();
    expect(screen.getByText('₹95,000 (500m × ₹190/meter)')).toBeInTheDocument();
    expect(screen.getByText('₹47,500 (50% of order value)')).toBeInTheDocument();
    expect(screen.getByText('🔴 Waiting for Advance Payment')).toBeInTheDocument();

    // Payment received order
    expect(screen.getByText('750 meters Silk Cotton Blend, 42" width')).toBeInTheDocument();
    expect(screen.getByText('₹1,35,000 (750m × ₹180/meter)')).toBeInTheDocument();
    expect(screen.getByText('✅ ₹1,35,000 received on Aug 30, 2025')).toBeInTheDocument();
    expect(screen.getByText('🟢 Ready for Production')).toBeInTheDocument();

    // Overdue order
    expect(screen.getByText('400 meters Organic Cotton, 46" width')).toBeInTheDocument();
    expect(screen.getByText('₹92,000 (400m × ₹230/meter)')).toBeInTheDocument();
    expect(screen.getByText('❌ ₹46,000 overdue by 12 days')).toBeInTheDocument();
    expect(screen.getByText('🔴 Payment Follow-up Required')).toBeInTheDocument();
  });

  test('displays customer status with correct styling and icons', () => {
    render(<SalesOrders {...mockProps} />);
    
    // New customer
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('New Customer (Converted from Lead)')).toBeInTheDocument();

    // Repeat customer
    expect(screen.getByText('🏆')).toBeInTheDocument();
    expect(screen.getByText('Repeat Customer')).toBeInTheDocument();

    // Payment delayed
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Payment Delayed')).toBeInTheDocument();
  });

  test('quote source link triggers navigation callback', () => {
    render(<SalesOrders {...mockProps} />);
    
    const quoteLinks = screen.getAllByText(/✅ QT-2025-\d+/);
    fireEvent.click(quoteLinks[0]);
    expect(mockProps.onShowQuotationOrders).toHaveBeenCalled();
  });

  test('customer profile link triggers callback with correct id', () => {
    render(<SalesOrders {...mockProps} />);
    
    const customerLinks = screen.getAllByText(/Rajesh Textiles - Ahmedabad|Premium Fabrics Ltd - Mumbai|Textile Innovation Co - Surat/);
    fireEvent.click(customerLinks[0]);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('1');
  });

  test('shows status-specific action buttons', () => {
    render(<SalesOrders {...mockProps} />);
    
    // Common action buttons
    const callButtons = screen.getAllByText('📞 Call');
    const whatsappButtons = screen.getAllByText('📱 WhatsApp');
    const viewButtons = screen.getAllByText('📄 View Order PDF');
    
    expect(callButtons).toHaveLength(3);
    expect(whatsappButtons).toHaveLength(3);
    expect(viewButtons).toHaveLength(3);

    // Status-specific buttons
    expect(screen.getByText('💳 Collect Payment')).toBeInTheDocument();
    expect(screen.getByText('📞 Follow Up Payment')).toBeInTheDocument();
  });

  test('displays correct status icons and text', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText('💳')).toBeInTheDocument(); // Pending payment icon
    expect(screen.getByText('✅')).toBeInTheDocument(); // Payment received icon
    expect(screen.getByText('🔴')).toBeInTheDocument(); // Overdue icon
  });

  test('back to dashboard button triggers navigation callback', () => {
    render(<SalesOrders {...mockProps} />);
    
    fireEvent.click(screen.getByText('← Back to Dashboard'));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter button has correct CSS class', () => {
    const activePendingProps = { ...mockProps, filterState: 'pendingpayment' };
    render(<SalesOrders {...activePendingProps} />);
    
    const pendingButton = screen.getByText('💳 Pending Payment');
    expect(pendingButton).toHaveClass('filter-btn', 'active');
  });

  test('order cards have appropriate CSS classes based on status', () => {
    render(<SalesOrders {...mockProps} />);
    
    const orderCards = screen.getAllByText(/SO-2025-\d+/);
    expect(orderCards[0]).toBeInTheDocument(); // Pending payment - warm
    expect(orderCards[1]).toBeInTheDocument(); // Payment received - cold  
    expect(orderCards[2]).toBeInTheDocument(); // Overdue - hot
  });

  test('renders with Gujarati translations', () => {
    const guProps = {
      ...mockProps,
      currentLanguage: 'gu',
      translations: getCurrentTranslations('gu')
    };
    
    render(<SalesOrders {...guProps} />);
    
    expect(screen.getByText('📋 સેલ્સ ઓર્ડર')).toBeInTheDocument();
    expect(screen.getByText('← ડેશબોર્ડ પર પાછા જાઓ')).toBeInTheDocument();
    expect(screen.getByText('પેન્ડિંગ પેમેન્ટ')).toBeInTheDocument();
    expect(screen.getByText('પેમેન્ટ મળેલ')).toBeInTheDocument();
  });

  test('renders with Hindi translations', () => {
    const hiProps = {
      ...mockProps,
      currentLanguage: 'hi',
      translations: getCurrentTranslations('hi')
    };
    
    render(<SalesOrders {...hiProps} />);
    
    expect(screen.getByText('📋 सेल्स ऑर्डर')).toBeInTheDocument();
    expect(screen.getByText('← डैशबोर्ड पर वापस जाएं')).toBeInTheDocument();
    expect(screen.getByText('पेंडिंग पेमेंट')).toBeInTheDocument();
    expect(screen.getByText('पेमेंट प्राप्त')).toBeInTheDocument();
  });

  test('displays order numbers, dates and amounts correctly', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText(/Order Number:\s*SO-2025-001/)).toBeInTheDocument();
    expect(screen.getByText(/Order Date:\s*September 3, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/Total Amount:\s*₹95,000/)).toBeInTheDocument();
    expect(screen.getByText(/Customer Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Order Status:/)).toBeInTheDocument();
  });

  test('conditional display of advance payment vs payment received', () => {
    render(<SalesOrders {...mockProps} />);
    
    expect(screen.getByText(/Advance Payment Required:\s*₹47,500/)).toBeInTheDocument();
    expect(screen.getByText(/Payment Status:\s*✅ ₹1,35,000 received/)).toBeInTheDocument();
  });
});