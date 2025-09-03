import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onShowLeadManagement: jest.fn(),
  onShowQuotationOrders: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowCustomerList: jest.fn(),
  translations: {
    title: "360° Business Platform",
    company: "ElevateIdea Technologies",
    founder: "Built by Partha Sarthi for Gujarat Textile Manufacturers",
    leadManagement: "Lead Management",
    quotationOrders: "Quotation & Orders",
    salesOrder: "Sales Orders",
    customers: "Customers",
    workOrders: "Work Orders",
    smartProcurement: "Smart Procurement",
    inventory: "Inventory (3-Tier)",
    productionTracking: "Production Tracking",
    dispatchDelivery: "Dispatch & Delivery",
    invoiceFinance: "Invoice & Finance",
    customerFeedback: "Customer Feedback",
    voiceCommands: "Voice Commands",
    analyticsDashboard: "Analytics Dashboard"
  }
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with title and company', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('🏭 360° Business Platform')).toBeInTheDocument();
    expect(screen.getByText('ElevateIdea Technologies')).toBeInTheDocument();
    expect(screen.getByText('Built by Partha Sarthi for Gujarat Textile Manufacturers')).toBeInTheDocument();
  });

  test('renders all feature cards', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('📋 Lead Management')).toBeInTheDocument();
    expect(screen.getByText('📑 Quotation & Orders')).toBeInTheDocument();
    expect(screen.getByText('💳 Sales Orders')).toBeInTheDocument();
    expect(screen.getByText('👥 Customers')).toBeInTheDocument();
    expect(screen.getByText('📋 Work Orders')).toBeInTheDocument();
    expect(screen.getByText('🛒 Smart Procurement')).toBeInTheDocument();
    expect(screen.getByText('📦 Inventory (3-Tier)')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Production Tracking')).toBeInTheDocument();
  });

  test('displays language switcher with correct active state', () => {
    render(<Dashboard {...mockProps} />);
    
    const englishBtn = screen.getByRole('button', { name: 'English' });
    const gujaratiBtn = screen.getByRole('button', { name: 'ગુજરાતી' });
    const hindiBtn = screen.getByRole('button', { name: 'हिंदी' });
    
    expect(englishBtn).toBeInTheDocument();
    expect(gujaratiBtn).toBeInTheDocument();
    expect(hindiBtn).toBeInTheDocument();
    
    expect(englishBtn).toHaveClass('active');
    expect(gujaratiBtn).not.toHaveClass('active');
    expect(hindiBtn).not.toHaveClass('active');
  });

  test('calls onLanguageChange when language buttons are clicked', () => {
    render(<Dashboard {...mockProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'ગુજરાતી' }));
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('gu');

    fireEvent.click(screen.getByRole('button', { name: 'हिंदी' }));
    expect(mockProps.onLanguageChange).toHaveBeenCalledWith('hi');
  });

  test('calls navigation handlers when feature cards are clicked', () => {
    render(<Dashboard {...mockProps} />);
    
    fireEvent.click(screen.getByText('📋 Lead Management'));
    expect(mockProps.onShowLeadManagement).toHaveBeenCalled();

    fireEvent.click(screen.getByText('📑 Quotation & Orders'));
    expect(mockProps.onShowQuotationOrders).toHaveBeenCalled();

    fireEvent.click(screen.getByText('💳 Sales Orders'));
    expect(mockProps.onShowSalesOrders).toHaveBeenCalled();

    fireEvent.click(screen.getByText('👥 Customers'));
    expect(mockProps.onShowCustomerList).toHaveBeenCalled();
  });

  test('shows development status message', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('🚧 MVP in Development - Coming Soon!')).toBeInTheDocument();
  });

  test('renders with gujarati language', () => {
    const gujaratiProps = {
      ...mockProps,
      currentLanguage: 'gu',
      translations: {
        ...mockProps.translations,
        title: "360° બિઝનેસ પ્લેટફોર્મ",
        company: "એલિવેટઆઈડિયા ટેકનોલોજીઝ",
        leadManagement: "લીડ મેનેજમેન્ટ"
      }
    };
    
    render(<Dashboard {...gujaratiProps} />);
    
    expect(screen.getByText('🏭 360° બિઝનેસ પ્લેટફોર્મ')).toBeInTheDocument();
    expect(screen.getByText('એલિવેટઆઈડિયા ટેકનોલોજીઝ')).toBeInTheDocument();
    expect(screen.getByText('📋 લીડ મેનેજમેન્ટ')).toBeInTheDocument();
  });
});