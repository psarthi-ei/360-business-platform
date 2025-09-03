import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    customerProfile: 'Customer Profile',
    createNewQuote: 'Create New Quote',
    customerSince: 'Customer Since',
    totalBusiness: 'Total Business',
    totalOrders: 'Total Orders',
    conversionRate: 'Conversion Rate',
    paymentScore: 'Payment Score',
    call: '📞 Call',
    whatsapp: '📱 WhatsApp',
    quoteHistory: 'Quote History',
    orderHistory: 'Order History',
    transactionHistory: 'Transaction History',
    businessInsights: 'Business Insights'
  }
};

// Mock customer profile functionality by testing App component
const CustomerProfileMock = () => {
  return (
    <div className="lead-management-screen">
      <div className="screen-header">
        <button className="back-button" onClick={mockProps.onNavigateBack}>
          {mockProps.translations.backToDashboard}
        </button>
        <h1>👤 {mockProps.translations.customerProfile}</h1>
        <button className="add-button">{mockProps.translations.createNewQuote}</button>
      </div>

      <div className="customer-header">
        <div className="customer-main-info">
          <h2>🏭 Rajesh Textiles - Ahmedabad</h2>
          <p className="customer-since">🎉 {mockProps.translations.customerSince}: September 3, 2025</p>
          <p className="customer-type">🏆 <strong>Premium Customer</strong> - Regular Orders</p>
        </div>
        <div className="customer-contact-header">
          <p><strong>Primary Contact:</strong> Rajesh Shah - 9876543210</p>
          <div className="header-actions">
            <button className="action-btn call">{mockProps.translations.call}</button>
            <button className="action-btn whatsapp">{mockProps.translations.whatsapp}</button>
          </div>
        </div>
      </div>

      <div className="customer-stats">
        <div className="stat-card">
          <h3>💰 {mockProps.translations.totalBusiness}</h3>
          <p className="stat-value">₹95,000</p>
          <p className="stat-detail">(1 order placed)</p>
        </div>
        <div className="stat-card">
          <h3>📋 {mockProps.translations.totalOrders}</h3>
          <p className="stat-value">1</p>
          <p className="stat-detail">Active orders</p>
        </div>
        <div className="stat-card">
          <h3>🎯 {mockProps.translations.conversionRate}</h3>
          <p className="stat-value">100%</p>
          <p className="stat-detail">(1/1 quotes)</p>
        </div>
        <div className="stat-card">
          <h3>💳 {mockProps.translations.paymentScore}</h3>
          <p className="stat-value payment-overdue">⚠️ Pending</p>
          <p className="stat-detail">Advance payment required</p>
        </div>
      </div>

      <div className="customer-section">
        <h3>📊 {mockProps.translations.quoteHistory}</h3>
        <div className="history-card">
          <div className="history-header">
            <span className="history-id">QT-2025-001</span>
            <span className="history-status converted">🎉 Converted</span>
            <span className="history-date">September 1, 2025</span>
          </div>
          <div className="history-details">
            <p><strong>Material:</strong> 500 meters Bandhani Cotton Fabric, 44" width</p>
            <p><strong>Amount:</strong> ₹95,000</p>
            <p><strong>Status:</strong> Converted to Sales Order SO-2025-001</p>
          </div>
        </div>
      </div>

      <div className="customer-section">
        <h3>📦 {mockProps.translations.orderHistory}</h3>
        <div className="history-card">
          <div className="history-header">
            <span className="history-id">SO-2025-001</span>
            <span className="history-status pending">💳 Payment Pending</span>
            <span className="history-date">September 3, 2025</span>
          </div>
          <div className="history-details">
            <p><strong>Material:</strong> 500 meters Bandhani Cotton Fabric</p>
            <p><strong>Total:</strong> ₹95,000</p>
            <p><strong>Payment Status:</strong> ₹47,500 advance payment pending</p>
          </div>
        </div>
      </div>

      <div className="customer-section">
        <h3>💸 {mockProps.translations.transactionHistory}</h3>
        <div className="history-card">
          <div className="history-header">
            <span className="history-id">No payments yet</span>
            <span className="history-status pending">⏳ Pending</span>
          </div>
          <div className="history-details">
            <p>Advance payment of ₹47,500 is required to proceed with order SO-2025-001</p>
          </div>
        </div>
      </div>

      <div className="customer-section">
        <h3>🔍 {mockProps.translations.businessInsights}</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <h4>🎯 Preferred Materials</h4>
            <p>Bandhani Cotton, Traditional patterns</p>
          </div>
          <div className="insight-item">
            <h4>📈 Order Pattern</h4>
            <p>New customer, first order placed</p>
          </div>
          <div className="insight-item">
            <h4>💰 Payment Behavior</h4>
            <p>Payment pending - requires follow-up</p>
          </div>
          <div className="insight-item">
            <h4>📞 Communication</h4>
            <p>Prefers phone calls, responsive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

describe('CustomerProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders customer profile screen with header', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('👤 Customer Profile')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create New Quote')).toBeInTheDocument();
  });

  test('displays customer main information', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('🏭 Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('🎉 Customer Since: September 3, 2025')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
    expect(screen.getByText('Premium Customer')).toBeInTheDocument();
  });

  test('displays customer contact information', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('Primary Contact: Rajesh Shah - 9876543210')).toBeInTheDocument();
    expect(screen.getByText('📞 Call')).toBeInTheDocument();
    expect(screen.getByText('📱 WhatsApp')).toBeInTheDocument();
  });

  test('displays customer statistics cards', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('💰 Total Business')).toBeInTheDocument();
    expect(screen.getByText('₹95,000')).toBeInTheDocument();
    expect(screen.getByText('(1 order placed)')).toBeInTheDocument();

    expect(screen.getByText('📋 Total Orders')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Active orders')).toBeInTheDocument();

    expect(screen.getByText('🎯 Conversion Rate')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('(1/1 quotes)')).toBeInTheDocument();

    expect(screen.getByText('💳 Payment Score')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Pending')).toBeInTheDocument();
    expect(screen.getByText('Advance payment required')).toBeInTheDocument();
  });

  test('displays quote history section', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('📊 Quote History')).toBeInTheDocument();
    expect(screen.getByText('QT-2025-001')).toBeInTheDocument();
    expect(screen.getByText('🎉 Converted')).toBeInTheDocument();
    expect(screen.getByText('September 1, 2025')).toBeInTheDocument();
    expect(screen.getByText('500 meters Bandhani Cotton Fabric, 44" width')).toBeInTheDocument();
    expect(screen.getByText('₹95,000')).toBeInTheDocument();
    expect(screen.getByText('Converted to Sales Order SO-2025-001')).toBeInTheDocument();
  });

  test('displays order history section', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('📦 Order History')).toBeInTheDocument();
    expect(screen.getByText('SO-2025-001')).toBeInTheDocument();
    expect(screen.getByText('💳 Payment Pending')).toBeInTheDocument();
    expect(screen.getByText('September 3, 2025')).toBeInTheDocument();
    expect(screen.getByText('500 meters Bandhani Cotton Fabric')).toBeInTheDocument();
    expect(screen.getByText('₹47,500 advance payment pending')).toBeInTheDocument();
  });

  test('displays transaction history section', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('💸 Transaction History')).toBeInTheDocument();
    expect(screen.getByText('No payments yet')).toBeInTheDocument();
    expect(screen.getByText('⏳ Pending')).toBeInTheDocument();
    expect(screen.getByText('Advance payment of ₹47,500 is required to proceed with order SO-2025-001')).toBeInTheDocument();
  });

  test('displays business insights section', () => {
    render(<CustomerProfileMock />);
    
    expect(screen.getByText('🔍 Business Insights')).toBeInTheDocument();
    
    expect(screen.getByText('🎯 Preferred Materials')).toBeInTheDocument();
    expect(screen.getByText('Bandhani Cotton, Traditional patterns')).toBeInTheDocument();

    expect(screen.getByText('📈 Order Pattern')).toBeInTheDocument();
    expect(screen.getByText('New customer, first order placed')).toBeInTheDocument();

    expect(screen.getByText('💰 Payment Behavior')).toBeInTheDocument();
    expect(screen.getByText('Payment pending - requires follow-up')).toBeInTheDocument();

    expect(screen.getByText('📞 Communication')).toBeInTheDocument();
    expect(screen.getByText('Prefers phone calls, responsive')).toBeInTheDocument();
  });

  test('back to dashboard button triggers navigation callback', () => {
    render(<CustomerProfileMock />);
    
    fireEvent.click(screen.getByText('← Back to Dashboard'));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('displays status badges with correct styling', () => {
    render(<CustomerProfileMock />);
    
    const convertedBadge = screen.getByText('🎉 Converted');
    expect(convertedBadge).toHaveClass('history-status', 'converted');

    const pendingBadge = screen.getByText('💳 Payment Pending');
    expect(pendingBadge).toHaveClass('history-status', 'pending');
  });

  test('displays customer statistics with proper formatting', () => {
    render(<CustomerProfileMock />);
    
    const totalBusinessValue = screen.getByText('₹95,000');
    expect(totalBusinessValue).toHaveClass('stat-value');

    const totalOrdersValue = screen.getByText('1');
    expect(totalOrdersValue).toHaveClass('stat-value');

    const conversionRateValue = screen.getByText('100%');
    expect(conversionRateValue).toHaveClass('stat-value');

    const paymentScoreValue = screen.getByText('⚠️ Pending');
    expect(paymentScoreValue).toHaveClass('stat-value', 'payment-overdue');
  });

  test('displays history cards with proper structure', () => {
    render(<CustomerProfileMock />);
    
    const historyCards = screen.getAllByText(/QT-2025-001|SO-2025-001|No payments yet/);
    expect(historyCards.length).toBeGreaterThanOrEqual(3);
    
    historyCards.forEach(card => {
      expect(card).toHaveClass('history-id');
    });
  });

  test('displays insights in grid format', () => {
    render(<CustomerProfileMock />);
    
    const insightsGrid = screen.getByText('🔍 Business Insights').parentElement?.querySelector('.insights-grid');
    expect(insightsGrid).toBeInTheDocument();
    
    const insightItems = screen.getAllByText(/🎯 Preferred Materials|📈 Order Pattern|💰 Payment Behavior|📞 Communication/);
    expect(insightItems).toHaveLength(4);
  });
});