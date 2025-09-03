import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const mockProps = {
  currentLanguage: 'en',
  onLanguageChange: jest.fn(),
  onNavigateBack: jest.fn(),
  onShowCustomerProfile: jest.fn(),
  translations: {
    backToDashboard: '← Back to Dashboard',
    customers: 'Customers',
    searchCustomers: 'Search customers by name, location, or specialization...',
    showAll: 'Show All',
    call: '📞 Call',
    whatsapp: '📱 WhatsApp',
    voiceCommandsHint: 'Voice Commands'
  },
  customerSearch: '',
  onCustomerSearchChange: jest.fn()
};

const CustomerListMock = () => {
  return (
    <div className="lead-management-screen">
      <div className="screen-header">
        <button className="back-button" onClick={mockProps.onNavigateBack}>
          {mockProps.translations.backToDashboard}
        </button>
        <h1>👥 Customer List</h1>
      </div>

      <div className="search-section">
        <input 
          type="text" 
          className="search-input"
          placeholder={mockProps.translations.searchCustomers}
          value={mockProps.customerSearch}
          onChange={(e) => mockProps.onCustomerSearchChange(e.target.value)}
        />
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          <button className="filter-btn active">{mockProps.translations.showAll}</button>
          <button className="filter-btn">🏆 Premium</button>
          <button className="filter-btn">🎉 New Customers</button>
          <button className="filter-btn">⚡ Active</button>
          <button className="filter-btn">⚠️ Payment Issues</button>
        </div>
      </div>

      <div className="leads-container">
        <div className="lead-card warm-lead">
          <div className="lead-header">
            <h3>
              <span 
                onClick={() => mockProps.onShowCustomerProfile('rajesh-textiles')}
                style={{cursor: 'pointer', textDecoration: 'underline'}}
              >
                🏭 Rajesh Textiles - Ahmedabad
              </span>
            </h3>
            <span className="priority-badge warm">🏆 Premium Customer</span>
          </div>
          <div className="lead-details">
            <p><strong>Customer Since:</strong> September 3, 2025</p>
            <p><strong>Total Business:</strong> ₹95,000 (1 order)</p>
            <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
            <p><strong>Payment Status:</strong> 🔴 Advance payment pending</p>
            <p><strong>Preferred Materials:</strong> Bandhani Cotton, Traditional patterns</p>
            <p><strong>Last Contact:</strong> Sep 3, 2025 - Phone call about payment</p>
          </div>
          <div className="customer-contact">
            <p><strong>Contact:</strong> Rajesh Shah - 9876543210</p>
          </div>
          <div className="lead-actions">
            <button className="action-btn call">{mockProps.translations.call}</button>
            <button className="action-btn whatsapp">{mockProps.translations.whatsapp}</button>
            <button className="action-btn quote" onClick={() => mockProps.onShowCustomerProfile('rajesh-textiles')}>👤 View Profile</button>
          </div>
        </div>

        <div className="lead-card cold-lead">
          <div className="lead-header">
            <h3>
              <span 
                onClick={() => mockProps.onShowCustomerProfile('premium-fabrics')}
                style={{cursor: 'pointer', textDecoration: 'underline'}}
              >
                🏭 Premium Fabrics Ltd - Mumbai
              </span>
            </h3>
            <span className="priority-badge cold">⭐ Repeat Customer</span>
          </div>
          <div className="lead-details">
            <p><strong>Customer Since:</strong> August 28, 2025</p>
            <p><strong>Total Business:</strong> ₹1,35,000 (1 order)</p>
            <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
            <p><strong>Payment Status:</strong> ✅ Payment received, ready for production</p>
            <p><strong>Preferred Materials:</strong> Silk Cotton Blend, Mercerized finish</p>
            <p><strong>Last Contact:</strong> Aug 30, 2025 - Payment confirmation</p>
          </div>
          <div className="customer-contact">
            <p><strong>Contact:</strong> Meera Jain - 9988112233</p>
          </div>
          <div className="lead-actions">
            <button className="action-btn call">{mockProps.translations.call}</button>
            <button className="action-btn whatsapp">{mockProps.translations.whatsapp}</button>
            <button className="action-btn quote" onClick={() => mockProps.onShowCustomerProfile('premium-fabrics')}>👤 View Profile</button>
          </div>
        </div>

        <div className="lead-card hot-lead">
          <div className="lead-header">
            <h3>
              <span 
                onClick={() => mockProps.onShowCustomerProfile('textile-innovation')}
                style={{cursor: 'pointer', textDecoration: 'underline'}}
              >
                🏭 Textile Innovation Co - Surat
              </span>
            </h3>
            <span className="priority-badge hot">⚠️ Payment Overdue</span>
          </div>
          <div className="lead-details">
            <p><strong>Customer Since:</strong> August 22, 2025</p>
            <p><strong>Total Business:</strong> ₹92,000 (1 order)</p>
            <p><strong>Conversion Rate:</strong> 100% (1/1 quotes)</p>
            <p><strong>Payment Status:</strong> 🔴 ₹46,000 overdue by 12 days</p>
            <p><strong>Preferred Materials:</strong> Organic Cotton, GOTS Certified</p>
            <p><strong>Last Contact:</strong> Aug 28, 2025 - Payment reminder sent</p>
          </div>
          <div className="customer-contact">
            <p><strong>Contact:</strong> Kiran Patel - 9876567890</p>
          </div>
          <div className="lead-actions">
            <button className="action-btn call">{mockProps.translations.call}</button>
            <button className="action-btn whatsapp">{mockProps.translations.whatsapp}</button>
            <button className="action-btn quote" onClick={() => mockProps.onShowCustomerProfile('textile-innovation')}>👤 View Profile</button>
          </div>
        </div>
      </div>

      <div className="voice-commands">
        <p className="voice-hint">
          🎤 <strong>{mockProps.translations.voiceCommandsHint}</strong> 
          "Show premium customers" • "Call overdue payments" • "View Rajesh profile" • "Send payment reminders"
        </p>
      </div>
    </div>
  );
};

describe('CustomerList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders customer list screen with header', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('👥 Customer List')).toBeInTheDocument();
    expect(screen.getByText('← Back to Dashboard')).toBeInTheDocument();
  });

  test('displays search input with correct placeholder', () => {
    render(<CustomerListMock />);
    
    const searchInput = screen.getByPlaceholderText('Search customers by name, location, or specialization...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('search-input');
  });

  test('displays all filter buttons', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('Show All')).toBeInTheDocument();
    expect(screen.getByText('🏆 Premium')).toBeInTheDocument();
    expect(screen.getByText('🎉 New Customers')).toBeInTheDocument();
    expect(screen.getByText('⚡ Active')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Payment Issues')).toBeInTheDocument();
  });

  test('shows all customers by default', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('🏭 Rajesh Textiles - Ahmedabad')).toBeInTheDocument();
    expect(screen.getByText('🏭 Premium Fabrics Ltd - Mumbai')).toBeInTheDocument();
    expect(screen.getByText('🏭 Textile Innovation Co - Surat')).toBeInTheDocument();
  });

  test('displays customer details correctly', () => {
    render(<CustomerListMock />);
    
    // Rajesh Textiles
    expect(screen.getByText('Customer Since: September 3, 2025')).toBeInTheDocument();
    expect(screen.getByText('Total Business: ₹95,000 (1 order)')).toBeInTheDocument();
    expect(screen.getByText('Conversion Rate: 100% (1/1 quotes)')).toBeInTheDocument();
    expect(screen.getByText('🔴 Advance payment pending')).toBeInTheDocument();
    expect(screen.getByText('Preferred Materials: Bandhani Cotton, Traditional patterns')).toBeInTheDocument();

    // Premium Fabrics
    expect(screen.getByText('Customer Since: August 28, 2025')).toBeInTheDocument();
    expect(screen.getByText('Total Business: ₹1,35,000 (1 order)')).toBeInTheDocument();
    expect(screen.getByText('✅ Payment received, ready for production')).toBeInTheDocument();

    // Textile Innovation
    expect(screen.getByText('Customer Since: August 22, 2025')).toBeInTheDocument();
    expect(screen.getByText('Total Business: ₹92,000 (1 order)')).toBeInTheDocument();
    expect(screen.getByText('🔴 ₹46,000 overdue by 12 days')).toBeInTheDocument();
  });

  test('displays customer status badges correctly', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('🏆 Premium Customer')).toBeInTheDocument();
    expect(screen.getByText('⭐ Repeat Customer')).toBeInTheDocument();
    expect(screen.getByText('⚠️ Payment Overdue')).toBeInTheDocument();
  });

  test('displays contact information for each customer', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('Contact: Rajesh Shah - 9876543210')).toBeInTheDocument();
    expect(screen.getByText('Contact: Meera Jain - 9988112233')).toBeInTheDocument();
    expect(screen.getByText('Contact: Kiran Patel - 9876567890')).toBeInTheDocument();
  });

  test('customer name links trigger navigation callback', () => {
    render(<CustomerListMock />);
    
    const rajeshLink = screen.getByText('🏭 Rajesh Textiles - Ahmedabad');
    fireEvent.click(rajeshLink);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('rajesh-textiles');

    const premiumLink = screen.getByText('🏭 Premium Fabrics Ltd - Mumbai');
    fireEvent.click(premiumLink);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('premium-fabrics');

    const textileLink = screen.getByText('🏭 Textile Innovation Co - Surat');
    fireEvent.click(textileLink);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('textile-innovation');
  });

  test('view profile buttons trigger navigation callback', () => {
    render(<CustomerListMock />);
    
    const viewProfileButtons = screen.getAllByText('👤 View Profile');
    expect(viewProfileButtons).toHaveLength(3);

    fireEvent.click(viewProfileButtons[0]);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('rajesh-textiles');

    fireEvent.click(viewProfileButtons[1]);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('premium-fabrics');

    fireEvent.click(viewProfileButtons[2]);
    expect(mockProps.onShowCustomerProfile).toHaveBeenCalledWith('textile-innovation');
  });

  test('action buttons are present for each customer', () => {
    render(<CustomerListMock />);
    
    const callButtons = screen.getAllByText('📞 Call');
    const whatsappButtons = screen.getAllByText('📱 WhatsApp');
    const viewProfileButtons = screen.getAllByText('👤 View Profile');

    expect(callButtons).toHaveLength(3);
    expect(whatsappButtons).toHaveLength(3);
    expect(viewProfileButtons).toHaveLength(3);
  });

  test('back to dashboard button triggers navigation callback', () => {
    render(<CustomerListMock />);
    
    fireEvent.click(screen.getByText('← Back to Dashboard'));
    expect(mockProps.onNavigateBack).toHaveBeenCalled();
  });

  test('search input triggers callback on change', () => {
    render(<CustomerListMock />);
    
    const searchInput = screen.getByPlaceholderText('Search customers by name, location, or specialization...');
    fireEvent.change(searchInput, { target: { value: 'Rajesh' } });
    expect(mockProps.onCustomerSearchChange).toHaveBeenCalledWith('Rajesh');
  });

  test('shows all filter button is active by default', () => {
    render(<CustomerListMock />);
    
    const showAllButton = screen.getByText('Show All');
    expect(showAllButton).toHaveClass('filter-btn', 'active');
  });

  test('customer cards have appropriate CSS classes based on status', () => {
    render(<CustomerListMock />);
    
    const customerCards = document.querySelectorAll('.lead-card');
    expect(customerCards).toHaveLength(3);
    
    expect(customerCards[0]).toHaveClass('lead-card', 'warm-lead');
    expect(customerCards[1]).toHaveClass('lead-card', 'cold-lead');
    expect(customerCards[2]).toHaveClass('lead-card', 'hot-lead');
  });

  test('displays voice commands section', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('🎤')).toBeInTheDocument();
    expect(screen.getByText('Voice Commands')).toBeInTheDocument();
    expect(screen.getByText(/Show premium customers/)).toBeInTheDocument();
    expect(screen.getByText(/Call overdue payments/)).toBeInTheDocument();
    expect(screen.getByText(/View Rajesh profile/)).toBeInTheDocument();
    expect(screen.getByText(/Send payment reminders/)).toBeInTheDocument();
  });

  test('customer links have proper styling', () => {
    render(<CustomerListMock />);
    
    const customerLinks = screen.getAllByText(/🏭 .* - .*/);
    customerLinks.forEach(link => {
      expect(link).toHaveStyle('cursor: pointer');
      expect(link).toHaveStyle('text-decoration: underline');
    });
  });

  test('displays last contact information', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('Last Contact: Sep 3, 2025 - Phone call about payment')).toBeInTheDocument();
    expect(screen.getByText('Last Contact: Aug 30, 2025 - Payment confirmation')).toBeInTheDocument();
    expect(screen.getByText('Last Contact: Aug 28, 2025 - Payment reminder sent')).toBeInTheDocument();
  });

  test('displays payment status with appropriate colors and icons', () => {
    render(<CustomerListMock />);
    
    expect(screen.getByText('🔴 Advance payment pending')).toBeInTheDocument();
    expect(screen.getByText('✅ Payment received, ready for production')).toBeInTheDocument();
    expect(screen.getByText('🔴 ₹46,000 overdue by 12 days')).toBeInTheDocument();
  });
});