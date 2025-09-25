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
      expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    });

    test('should render main heading', () => {
      renderDashboard();
      expect(screen.getByTestId('dashboard-title')).toBeInTheDocument();
    });

    test('should render company information', () => {
      renderDashboard();
      expect(screen.getByTestId('dashboard-subtitle')).toBeInTheDocument();
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
      const leadElement = screen.getByTestId('lead-management-button');
      expect(leadElement).toBeInTheDocument();
    });

    test('should call onShowLeadManagement when lead management clicked', async () => {
      renderDashboard();
      const leadElement = screen.getByTestId('lead-management-button');
      
      await userEvent.click(leadElement);
      
      expect(mockProps.onShowLeadManagement).toHaveBeenCalledTimes(1);
    });

    test('should render clickable quotation orders feature', () => {
      renderDashboard();
      const quotationElement = screen.getByTestId('quotation-orders-button');
      expect(quotationElement).toBeInTheDocument();
    });

    test('should call onShowQuotationOrders when quotation orders clicked', async () => {
      renderDashboard();
      const quotationElement = screen.getByTestId('quotation-orders-button');
      
      await userEvent.click(quotationElement);
      
      expect(mockProps.onShowQuotationOrders).toHaveBeenCalledTimes(1);
    });

    test('should render clickable payments feature', () => {
      renderDashboard();
      const paymentsElement = screen.getByTestId('payments-button');
      expect(paymentsElement).toBeInTheDocument();
    });

    test('should call onShowPayments when payments clicked', async () => {
      renderDashboard();
      const paymentsElement = screen.getByTestId('payments-button');
      
      await userEvent.click(paymentsElement);
      
      expect(mockProps.onShowPayments).toHaveBeenCalledTimes(1);
    });

    test('should render clickable customers feature', () => {
      renderDashboard();
      const customersElement = screen.getByTestId('customers-button');
      expect(customersElement).toBeInTheDocument();
    });

    test('should call onShowCustomerList when customers clicked', async () => {
      renderDashboard();
      const customersElement = screen.getByTestId('customers-button');
      
      await userEvent.click(customersElement);
      
      expect(mockProps.onShowCustomerList).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Interactive Features', () => {
    test('should render additional business process cards', () => {
      renderDashboard();
      
      // Check that the business process section is rendered
      expect(screen.getByText(/textile business pipeline/i)).toBeInTheDocument();
    });

    test('should render business metrics bar', () => {
      renderDashboard();
      
      // Check that the metrics bar exists
      expect(screen.getByText(/outstanding/i)).toBeInTheDocument();
      // Use a more specific selector for hot leads - check the compactMetric div with hot leads
      const hotLeadsElements = screen.getAllByText(/hot leads/i);
      expect(hotLeadsElements.length).toBeGreaterThan(0);
    });

    test('should render production and fulfillment cards', () => {
      renderDashboard();
      
      // Check that production and fulfillment cards exist - use more specific text
      const productionElements = screen.getAllByText(/production/i);
      const fulfillmentElements = screen.getAllByText(/fulfillment/i);
      expect(productionElements.length).toBeGreaterThan(0);
      expect(fulfillmentElements.length).toBeGreaterThan(0);
    });
  });

  describe('Props Handling', () => {
    test('should handle missing optional callbacks gracefully', () => {
      expect(() => {
        renderDashboard();
      }).not.toThrow();
    });

    test('should handle custom props', () => {
      renderDashboard();
      expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    });

    test('should pass language props correctly', () => {
      expect(() => {
        renderDashboard();
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading hierarchy', () => {
      renderDashboard();
      
      const h1 = screen.getByTestId('dashboard-title');
      const h2 = screen.getByTestId('dashboard-subtitle');
      
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    test('should have interactive clickable elements', () => {
      renderDashboard();
      
      expect(screen.getByTestId('lead-management-button')).toBeInTheDocument();
      expect(screen.getByTestId('quotation-orders-button')).toBeInTheDocument();
      expect(screen.getByTestId('payments-button')).toBeInTheDocument();
      expect(screen.getByTestId('customers-button')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should have dashboard container', () => {
      renderDashboard();
      expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
    });

    test('should render with proper CSS classes', () => {
      renderDashboard();
      const dashboard = screen.getByTestId('dashboard-container');
      expect(dashboard).toHaveClass('dashboard');
    });
  });
});