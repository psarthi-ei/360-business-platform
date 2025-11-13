import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/dashboard/Dashboard';
import { TranslationProvider } from '../contexts/TranslationContext';
import { TerminologyProvider } from '../contexts/TerminologyContext';

const mockProps = {
  onShowLeadManagement: jest.fn(),
  onShowSales: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowPayments: jest.fn(),
  onShowInvoices: jest.fn(),
  onShowCustomerList: jest.fn(),
  onShowInventory: jest.fn(),
  onShowProduction: jest.fn()
};

// Helper function to render Dashboard with required providers
const renderDashboard = (props = mockProps) => {
  return render(
    <TranslationProvider defaultLanguage="en">
      <TerminologyProvider>
        <Dashboard {...props} />
      </TerminologyProvider>
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

    test('should render with proper CSS classes', () => {
      renderDashboard();
      const dashboard = screen.getByTestId('dashboard-container');
      expect(dashboard).toHaveClass('dashboard');
    });

    test('should render Global Business Pulse', () => {
      renderDashboard();
      expect(screen.getByText('BUSINESS PULSE')).toBeInTheDocument();
      expect(screen.getByText('WIP')).toBeInTheDocument();
      expect(screen.getByText('Outstanding')).toBeInTheDocument();
      expect(screen.getByText('Billed This Month')).toBeInTheDocument();
    });

    test('should render Module KPI sections', () => {
      renderDashboard();
      expect(screen.getByText('SALES KPIs')).toBeInTheDocument();
      expect(screen.getByText('STORE KPIs')).toBeInTheDocument();
      expect(screen.getByText('PROCESS KPIs')).toBeInTheDocument();
      expect(screen.getByText('CUSTOMER KPIs')).toBeInTheDocument();
    });

    test('should render Quick Alerts section', () => {
      renderDashboard();
      expect(screen.getByText('QUICK ALERTS')).toBeInTheDocument();
      expect(screen.getByText(/lots delayed/)).toBeInTheDocument();
    });

    test('should render KPI values', () => {
      renderDashboard();
      expect(screen.getByText('Inquiries')).toBeInTheDocument();
      expect(screen.getByText('Conversion')).toBeInTheDocument();
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    test('should render module action buttons', () => {
      renderDashboard();
      expect(screen.getByText('Manage Sales →')).toBeInTheDocument();
      expect(screen.getByText('Check Store →')).toBeInTheDocument();
      expect(screen.getByText('View Production →')).toBeInTheDocument();
    });

    test('should render sync status', () => {
      renderDashboard();
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });
});