import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuotationOrders from './QuotationOrders';
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

  test('renders quotation orders screen with header', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('📄 Quotations & Orders')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('+ Create New Quote')).toBeInTheDocument();
  });

  test('displays all filter buttons', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('Show All')).toBeInTheDocument();
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    expect(screen.getByText('✅ Approved')).toBeInTheDocument();
    expect(screen.getByText('🎉 Converted')).toBeInTheDocument();
    expect(screen.getByText('❌ Expired')).toBeInTheDocument();
  });

  test('shows all quotes by default', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('QT-2025-001 -')).toBeInTheDocument();
    expect(screen.getByText('QT-2025-002 -')).toBeInTheDocument();
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
  });

  test('filters pending quotes correctly', () => {
    const pendingProps = { ...mockProps, filterState: 'pending' };
    render(<QuotationOrders {...pendingProps} />);
    
    expect(screen.getByText('QT-2025-002 -')).toBeInTheDocument();
    expect(screen.getByText('Gujarat Garments - Surat')).toBeInTheDocument();
    expect(screen.queryByText('QT-2025-001 -')).not.toBeInTheDocument();
  });

  test('filters converted quotes correctly', () => {
    const convertedProps = { ...mockProps, filterState: 'converted' };
    render(<QuotationOrders {...convertedProps} />);
    
    expect(screen.getByText('QT-2025-001 -')).toBeInTheDocument();
    expect(screen.getByText('Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.queryByText('QT-2025-002 -')).not.toBeInTheDocument();
  });

  test('filter buttons trigger onFilterChange callback', () => {
    render(<QuotationOrders {...mockProps} />);
    
    fireEvent.click(screen.getByText('⏳ Pending'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('pending');

    fireEvent.click(screen.getByText('✅ Approved'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('approved');

    fireEvent.click(screen.getByText('🎉 Converted'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('converted');

    fireEvent.click(screen.getByText('❌ Expired'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('expired');

    fireEvent.click(screen.getByText('Show All'));
    expect(mockProps.onFilterChange).toHaveBeenCalledWith('all');
  });

  test('displays correct quote details', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('500 meters Bandhani Cotton Fabric, 44" width')).toBeInTheDocument();
    expect(screen.getByText('100 GSM, Pre-shrunk, Natural dyes')).toBeInTheDocument();
    expect(screen.getByText('September 1, 2025')).toBeInTheDocument();
    expect(screen.getByText('September 15, 2025')).toBeInTheDocument();
    expect(screen.getByText('₹95,000')).toBeInTheDocument();

    expect(screen.getByText('750 meters Block Print Khadi, 42" width')).toBeInTheDocument();
    expect(screen.getByText('120 GSM, Hand-woven, Natural dyes')).toBeInTheDocument();
    expect(screen.getByText('September 2, 2025')).toBeInTheDocument();
    expect(screen.getByText('₹1,20,000')).toBeInTheDocument();
  });

  test('displays sales order link for converted quotes', () => {
    render(<QuotationOrders {...mockProps} />);
    
    const salesOrderLink = screen.getByText('🎉 SO-2025-001 (Sep 3, 2025)');
    expect(salesOrderLink).toBeInTheDocument();
    expect(salesOrderLink).toHaveStyle('cursor: pointer');
    expect(salesOrderLink).toHaveStyle('color: rgb(255, 215, 0)');
    expect(salesOrderLink).toHaveStyle('text-decoration: underline');
  });

  test('sales order link triggers navigation callback', () => {
    render(<QuotationOrders {...mockProps} />);
    
    const salesOrderLink = screen.getByText('🎉 SO-2025-001 (Sep 3, 2025)');
    fireEvent.click(salesOrderLink);
    expect(mockProps.onShowSalesOrders).toHaveBeenCalled();
  });

  test('customer profile link triggers callback with correct id', () => {
    render(<QuotationOrders {...mockProps} />);
    
    const customerLinks = screen.getAllByText(/Rajesh Textiles - Ahmedabad|Gujarat Garments - Surat/);
    fireEvent.click(customerLinks[0]);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('1');
  });

  test('displays correct status badges with icons', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('🎉 Converted')).toBeInTheDocument();
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
  });

  test('shows correct action buttons based on quote status', () => {
    render(<QuotationOrders {...mockProps} />);
    
    // Common action buttons
    const callButtons = screen.getAllByText('📞 Call');
    const whatsappButtons = screen.getAllByText('📱 WhatsApp');
    const viewButtons = screen.getAllByText('📄 View PDF');
    
    expect(callButtons).toHaveLength(2);
    expect(whatsappButtons).toHaveLength(2);
    expect(viewButtons).toHaveLength(2);
  });

  test('shows approve button for pending quotes', () => {
    const pendingProps = { ...mockProps, filterState: 'pending' };
    render(<QuotationOrders {...pendingProps} />);
    
    expect(screen.getByText('✅ Approve')).toBeInTheDocument();
  });

  test('back to dashboard button triggers navigation callback', () => {
    render(<QuotationOrders {...mockProps} />);
    
    fireEvent.click(screen.getByText('← Back to Dashboard'));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('active filter button has correct CSS class', () => {
    const activeConvertedProps = { ...mockProps, filterState: 'converted' };
    render(<QuotationOrders {...activeConvertedProps} />);
    
    const convertedButton = screen.getByText('🎉 Converted');
    expect(convertedButton).toHaveClass('filter-btn', 'active');
  });

  test('displays customer status with correct styling', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText('New Customer (Converted from Lead)')).toBeInTheDocument();
    expect(screen.getByText('Warm Lead')).toBeInTheDocument();
  });

  test('renders with Gujarati translations', () => {
    const guProps = {
      ...mockProps,
      currentLanguage: 'gu',
      translations: getCurrentTranslations('gu')
    };
    
    render(<QuotationOrders {...guProps} />);
    
    expect(screen.getByText('📄 કોટેશન અને ઓર્ડર')).toBeInTheDocument();
    expect(screen.getByText('← ડેશબોર્ડ પર પાછા જાઓ')).toBeInTheDocument();
    expect(screen.getByText('પેન્ડિંગ')).toBeInTheDocument();
    expect(screen.getByText('મંજૂર')).toBeInTheDocument();
    expect(screen.getByText('કન્વર્ટ થયેલ')).toBeInTheDocument();
  });

  test('renders with Hindi translations', () => {
    const hiProps = {
      ...mockProps,
      currentLanguage: 'hi',
      translations: getCurrentTranslations('hi')
    };
    
    render(<QuotationOrders {...hiProps} />);
    
    expect(screen.getByText('📄 कोटेशन और ऑर्डर')).toBeInTheDocument();
    expect(screen.getByText('← डैशबोर्ड पर वापस जाएं')).toBeInTheDocument();
    expect(screen.getByText('पेंडिंग')).toBeInTheDocument();
    expect(screen.getByText('अप्रूव्ड')).toBeInTheDocument();
    expect(screen.getByText('कन्वर्ट किया गया')).toBeInTheDocument();
  });

  test('quote number and dates are displayed correctly', () => {
    render(<QuotationOrders {...mockProps} />);
    
    expect(screen.getByText(/Quote Number:\s*QT-2025-001/)).toBeInTheDocument();
    expect(screen.getByText(/Quote Date:\s*September 1, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/Valid Until:\s*September 15, 2025/)).toBeInTheDocument();
    expect(screen.getByText(/Total Amount:\s*₹95,000/)).toBeInTheDocument();
  });
});