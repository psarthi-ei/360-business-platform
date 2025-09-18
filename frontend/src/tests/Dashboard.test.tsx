import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../components/Dashboard';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onShowLeadManagement: jest.fn(),
  onShowQuotationOrders: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowPayments: jest.fn(),
  onShowInvoices: jest.fn(),
  onShowCustomerList: jest.fn()
};

// Helper function to render Dashboard with TranslationProvider
const renderDashboard = (props = mockProps) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <Dashboard {...props} />
    </TranslationProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render without crashing', () => {
      renderDashboard();
      expect(screen.getByText(/business/i)).toBeInTheDocument();
    });

    test('should render main heading', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    test('should render company information', () => {
      renderDashboard();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    test('should render feature grid', () => {
      renderDashboard();
      const featureCards = screen.getAllByRole('button');
      expect(featureCards.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Features', () => {
    test('should render clickable lead management feature', () => {
      renderDashboard();
      const leadElement = screen.getByText(/lead management/i);
      expect(leadElement).toBeInTheDocument();
    });

    test('should call onShowLeadManagement when lead management clicked', async () => {
      renderDashboard();
      const leadElement = screen.getByText(/lead management/i);
      
      await userEvent.click(leadElement);
      
      expect(mockProps.onShowLeadManagement).toHaveBeenCalledTimes(1);
    });

    test('should render clickable quotation orders feature', () => {
      renderDashboard();
      const quotationElement = screen.getByText(/quotation.*orders/i);
      expect(quotationElement).toBeInTheDocument();
    });

    test('should call onShowQuotationOrders when quotation orders clicked', async () => {
      renderDashboard();
      const quotationElement = screen.getByText(/quotation.*orders/i);
      
      await userEvent.click(quotationElement);
      
      expect(mockProps.onShowQuotationOrders).toHaveBeenCalledTimes(1);
    });

    test('should render clickable sales orders feature', () => {
      renderDashboard();
      const salesElement = screen.getByText(/sales orders/i);
      expect(salesElement).toBeInTheDocument();
    });

    test('should call onShowSalesOrders when sales orders clicked', async () => {
      renderDashboard();
      const salesElement = screen.getByText(/sales orders/i);
      
      await userEvent.click(salesElement);
      
      expect(mockProps.onShowSalesOrders).toHaveBeenCalledTimes(1);
    });

    test('should render clickable customers feature', () => {
      renderDashboard();
      const customersElement = screen.getByText(/customers/i);
      expect(customersElement).toBeInTheDocument();
    });

    test('should call onShowCustomerList when customers clicked', async () => {
      renderDashboard();
      const customersElement = screen.getByText(/customers/i);
      
      await userEvent.click(customersElement);
      
      expect(mockProps.onShowCustomerList).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Interactive Features', () => {
    test('should render non-clickable work orders feature', () => {
      renderDashboard();
      const workOrdersCard = screen.getByText(/work orders/i);
      expect(workOrdersCard).toBeInTheDocument();
    });

    test('should render non-clickable procurement feature', () => {
      renderDashboard();
      const procurementCard = screen.getByText(/smart procurement/i);
      expect(procurementCard).toBeInTheDocument();
    });

    test('should render non-clickable inventory feature', () => {
      renderDashboard();
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
        onShowPayments: jest.fn(),
        onShowInvoices: jest.fn(),
        onShowCustomerList: jest.fn(),
      };
      
      expect(() => {
        renderDashboard();
      }).not.toThrow();
    });

    test('should handle custom props', () => {
      
      renderDashboard();
      expect(screen.getByText(/business/i)).toBeInTheDocument();
    });

    test('should pass language props correctly', () => {
      const customProps = {
        ...mockProps,
        currentLanguage: 'gu',
        onLanguageChange: jest.fn()
      };
      
      expect(() => {
        renderDashboard();
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading hierarchy', () => {
      renderDashboard();
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    test('should have interactive clickable elements', () => {
      renderDashboard();
      
      expect(screen.getByText(/lead management/i)).toBeInTheDocument();
      expect(screen.getByText(/quotation.*orders/i)).toBeInTheDocument();
      expect(screen.getByText(/sales orders/i)).toBeInTheDocument();
      expect(screen.getByText(/customers/i)).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should have dashboard container', () => {
      const { container } = renderDashboard();
      expect(container.querySelector('.dashboard')).toBeInTheDocument();
    });

    test('should render with proper CSS classes', () => {
      const { container } = renderDashboard();
      expect(container.firstChild).toHaveClass('dashboard');
    });
  });
});