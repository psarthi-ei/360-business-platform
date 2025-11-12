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
  onShowProduction: jest.fn()
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
      expect(screen.getByText('Active Parties')).toBeInTheDocument();
      expect(screen.getByText('Orders This Month')).toBeInTheDocument();
      expect(screen.getByText('Lots in Process')).toBeInTheDocument();
      expect(screen.getByText('Pending Collections')).toBeInTheDocument();
    });

    test('should render alert action button', () => {
      renderDashboard();
      expect(screen.getByText('Check Materials →')).toBeInTheDocument();
    });

    test('should render alert card', () => {
      renderDashboard();
      expect(screen.getByText(/lots awaiting client materials/)).toBeInTheDocument();
      expect(screen.getByText('Check Materials →')).toBeInTheDocument();
    });

    test('should render business snapshot cards', () => {
      renderDashboard();
      expect(screen.getByText('INQUIRY PIPELINE')).toBeInTheDocument();
      expect(screen.getByText('PROCESSING STATUS')).toBeInTheDocument();
      expect(screen.getByText('SERVICE MIX')).toBeInTheDocument();
      expect(screen.getByText('PARTY PORTFOLIO')).toBeInTheDocument();
    });

    test('should render activity timeline', () => {
      renderDashboard();
      expect(screen.getByText('📋 TODAY\'S ACTIVITY')).toBeInTheDocument();
    });

    test('should render sync status', () => {
      renderDashboard();
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });
});