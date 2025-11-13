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

    test('should render Global Business Pulse section', () => {
      renderDashboard();
      expect(screen.getByText('BUSINESS PULSE')).toBeInTheDocument();
      // Check for global KPI cards structure
      const kpiCards = document.querySelectorAll('.globalKpiCard');
      expect(kpiCards.length).toBeGreaterThan(0);
    });

    test('should render Module KPI sections', () => {
      renderDashboard();
      // Check for module sections structure
      const moduleKpiSections = document.querySelectorAll('.moduleKpiSection');
      expect(moduleKpiSections.length).toBeGreaterThan(0);
    });

    test('should render Quick Alerts section', () => {
      renderDashboard();
      expect(screen.getByText('QUICK ALERTS')).toBeInTheDocument();
      // Check for alerts structure
      const alertsList = document.querySelector('.alertsList');
      expect(alertsList).toBeInTheDocument();
    });

    test('should render sync status', () => {
      renderDashboard();
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });
});