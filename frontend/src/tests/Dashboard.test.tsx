import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/dashboard/Dashboard';
import { TranslationProvider } from '../contexts/TranslationContext';

const mockProps = {
  onShowLeadManagement: jest.fn(),
  onShowSales: jest.fn(),
  onShowSalesOrders: jest.fn(),
  onShowPayments: jest.fn(),
  onShowInvoices: jest.fn(),
  onShowCustomerList: jest.fn(),
  onShowInventory: jest.fn(),
  onShowFulfillment: jest.fn(),
  onShowAnalytics: jest.fn()
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

    test('should render with proper CSS classes', () => {
      renderDashboard();
      const dashboard = screen.getByTestId('dashboard-container');
      expect(dashboard).toHaveClass('dashboard');
    });

    test('should render KPI cards', () => {
      renderDashboard();
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Pending Invoices')).toBeInTheDocument();
      expect(screen.getByText('Orders at Risk')).toBeInTheDocument();
      expect(screen.getByText('Production Efficiency')).toBeInTheDocument();
    });

    test('should render alert action button', () => {
      renderDashboard();
      // MVP simplification: Quick action buttons removed, only alert action remains
      expect(screen.getByText('Resolve →')).toBeInTheDocument();
    });

    test('should render alert card', () => {
      renderDashboard();
      expect(screen.getByText('2 orders blocked - Cotton shortage')).toBeInTheDocument();
      expect(screen.getByText('Resolve →')).toBeInTheDocument();
    });

    test('should render business snapshot cards', () => {
      renderDashboard();
      expect(screen.getByText('SALES SNAPSHOT')).toBeInTheDocument();
      expect(screen.getByText('PRODUCTION SNAPSHOT')).toBeInTheDocument();
      expect(screen.getByText('PROCUREMENT SNAPSHOT')).toBeInTheDocument();
      expect(screen.getByText('CUSTOMER HEALTH')).toBeInTheDocument();
    });

    test('should render activity timeline', () => {
      renderDashboard();
      expect(screen.getByText('📋 RECENT ACTIVITY')).toBeInTheDocument();
    });

    test('should render sync status', () => {
      renderDashboard();
      expect(screen.getByText(/Last synced:/)).toBeInTheDocument();
    });
  });
});