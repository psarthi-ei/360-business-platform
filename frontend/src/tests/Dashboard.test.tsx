import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../components/Dashboard';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onShowLeadManagement: jest.fn(),
  onShowQuotationOrders: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowAdvancePaymentManagement: jest.fn(),
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

  describe('Component Rendering', () => {
    test('should render without crashing', () => {
      render(<Dashboard {...mockProps} />);
      expect(screen.getByText(mockProps.translations.title)).toBeInTheDocument();
    });

    test('should render main heading', () => {
      render(<Dashboard {...mockProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('should render company information', () => {
      render(<Dashboard {...mockProps} />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    test('should render feature grid', () => {
      render(<Dashboard {...mockProps} />);
      const featureCards = screen.getAllByRole('button');
      expect(featureCards.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Features', () => {
    test('should render clickable lead management feature', () => {
      render(<Dashboard {...mockProps} />);
      const leadElement = screen.getByText(/lead management/i);
      expect(leadElement).toBeInTheDocument();
    });

    test('should call onShowLeadManagement when lead management clicked', async () => {
      render(<Dashboard {...mockProps} />);
      const leadElement = screen.getByText(/lead management/i);
      
      await userEvent.click(leadElement);
      
      expect(mockProps.onShowLeadManagement).toHaveBeenCalledTimes(1);
    });

    test('should render clickable quotation orders feature', () => {
      render(<Dashboard {...mockProps} />);
      const quotationElement = screen.getByText(/quotation.*orders/i);
      expect(quotationElement).toBeInTheDocument();
    });

    test('should call onShowQuotationOrders when quotation orders clicked', async () => {
      render(<Dashboard {...mockProps} />);
      const quotationElement = screen.getByText(/quotation.*orders/i);
      
      await userEvent.click(quotationElement);
      
      expect(mockProps.onShowQuotationOrders).toHaveBeenCalledTimes(1);
    });

    test('should render clickable sales orders feature', () => {
      render(<Dashboard {...mockProps} />);
      const salesElement = screen.getByText(/sales orders/i);
      expect(salesElement).toBeInTheDocument();
    });

    test('should call onShowSalesOrders when sales orders clicked', async () => {
      render(<Dashboard {...mockProps} />);
      const salesElement = screen.getByText(/sales orders/i);
      
      await userEvent.click(salesElement);
      
      expect(mockProps.onShowSalesOrders).toHaveBeenCalledTimes(1);
    });

    test('should render clickable customers feature', () => {
      render(<Dashboard {...mockProps} />);
      const customersElement = screen.getByText(/customers/i);
      expect(customersElement).toBeInTheDocument();
    });

    test('should call onShowCustomerList when customers clicked', async () => {
      render(<Dashboard {...mockProps} />);
      const customersElement = screen.getByText(/customers/i);
      
      await userEvent.click(customersElement);
      
      expect(mockProps.onShowCustomerList).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Interactive Features', () => {
    test('should render non-clickable work orders feature', () => {
      render(<Dashboard {...mockProps} />);
      const workOrdersCard = screen.getByText(/work orders/i);
      expect(workOrdersCard).toBeInTheDocument();
    });

    test('should render non-clickable procurement feature', () => {
      render(<Dashboard {...mockProps} />);
      const procurementCard = screen.getByText(/smart procurement/i);
      expect(procurementCard).toBeInTheDocument();
    });

    test('should render non-clickable inventory feature', () => {
      render(<Dashboard {...mockProps} />);
      const inventoryCard = screen.getByText(/inventory/i);
      expect(inventoryCard).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    test('should handle missing optional callbacks gracefully', () => {
      const minimalProps = {
        currentLanguage: 'en',
        onLanguageChange: jest.fn(),
        onShowLeadManagement: jest.fn(),
        onShowQuotationOrders: jest.fn(),
        onShowSalesOrders: jest.fn(),
        onShowAdvancePaymentManagement: jest.fn(),
        onShowCustomerList: jest.fn(),
        translations: mockProps.translations
      };
      
      expect(() => {
        render(<Dashboard {...minimalProps} />);
      }).not.toThrow();
    });

    test('should use provided translations', () => {
      const customTranslations = {
        ...mockProps.translations,
        title: "Custom Platform Title"
      };
      
      render(<Dashboard {...mockProps} translations={customTranslations} />);
      expect(screen.getByText(/custom platform title/i)).toBeInTheDocument();
    });

    test('should pass language props correctly', () => {
      const customProps = {
        ...mockProps,
        currentLanguage: 'gu',
        onLanguageChange: jest.fn()
      };
      
      expect(() => {
        render(<Dashboard {...customProps} />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading hierarchy', () => {
      render(<Dashboard {...mockProps} />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    test('should have interactive clickable elements', () => {
      render(<Dashboard {...mockProps} />);
      
      expect(screen.getByText(/lead management/i)).toBeInTheDocument();
      expect(screen.getByText(/quotation.*orders/i)).toBeInTheDocument();
      expect(screen.getByText(/sales orders/i)).toBeInTheDocument();
      expect(screen.getByText(/customers/i)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should have dashboard container', () => {
      const { container } = render(<Dashboard {...mockProps} />);
      expect(container.querySelector('.dashboard')).toBeInTheDocument();
    });

    test('should render with proper CSS classes', () => {
      const { container } = render(<Dashboard {...mockProps} />);
      expect(container.firstChild).toHaveClass('dashboard');
    });
  });
});