import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface CustomerListProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  translations: any;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function CustomerList(props: CustomerListProps) {
  const currentLanguage = props.currentLanguage;
  const onLanguageChange = props.onLanguageChange;
  const onNavigateBack = props.onNavigateBack;
  const onShowCustomerProfile = props.onShowCustomerProfile;
  const t = props.translations;
  const searchTerm = props.searchTerm;
  const onSearchChange = props.onSearchChange;

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    onSearchChange(event.target.value);
  }

  const customers = [
    {
      id: '1',
      company: 'Rajesh Textiles',
      location: 'Ahmedabad',
      contact: 'Rajesh Shah - 9876543210',
      status: 'New Customer',
      totalBusiness: '₹95,000',
      activeOrders: 1,
      lastOrder: 'Sep 3, 2025',
      specialization: 'Bandhani & Traditional Prints'
    },
    {
      id: '2',
      company: 'Premium Fabrics Ltd',
      location: 'Mumbai',
      contact: 'Suresh Kumar - 9876554321',
      status: 'Repeat Customer',
      totalBusiness: '₹4,50,000',
      activeOrders: 0,
      lastOrder: 'Aug 28, 2025',
      specialization: 'Silk Cotton Blends'
    },
    {
      id: '3',
      company: 'Textile Innovation Co',
      location: 'Surat',
      contact: 'Kiran Patel - 9876567890',
      status: 'Payment Delayed',
      totalBusiness: '₹92,000',
      activeOrders: 1,
      lastOrder: 'Aug 22, 2025',
      specialization: 'Organic Cotton'
    }
  ];

  function getFilteredCustomers() {
    if (!searchTerm) return customers;
    
    const searchLower = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.company.toLowerCase().includes(searchLower) ||
      customer.location.toLowerCase().includes(searchLower) ||
      customer.contact.toLowerCase().includes(searchLower) ||
      customer.specialization.toLowerCase().includes(searchLower)
    );
  }

  function getStatusColor(status: string) {
    switch(status) {
      case 'New Customer': return '#2ed573';
      case 'Repeat Customer': return '#5352ed';
      case 'Payment Delayed': return '#ff4757';
      default: return '#666';
    }
  }

  function getStatusIcon(status: string) {
    switch(status) {
      case 'New Customer': return '🎉';
      case 'Repeat Customer': return '🏆';
      case 'Payment Delayed': return '⚠️';
      default: return '👤';
    }
  }

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="lead-management-screen">
      <LanguageSwitcher 
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />
      
      <div className="screen-header">
        <button className="back-button" onClick={onNavigateBack}>
          {t.backToDashboard}
        </button>
        <h1>👥 {t.customers}</h1>
        <button className="add-button">+ Add New Customer</button>
      </div>

      <div className="search-section">
        <input 
          type="text" 
          className="search-input" 
          placeholder={t.searchCustomers || "Search customers by name, location, or specialization..."}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="leads-container">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="lead-card cold-lead customer-card"
            onClick={() => onShowCustomerProfile(customer.id)}
            style={{cursor: 'pointer'}}
          >
            <div className="lead-header">
              <h3>🏢 {customer.company}</h3>
              <span 
                className="priority-badge cold" 
                style={{backgroundColor: getStatusColor(customer.status), color: 'white'}}
              >
                {getStatusIcon(customer.status)} {customer.status}
              </span>
            </div>
            <div className="lead-details">
              <p><strong>📍 Location:</strong> {customer.location}</p>
              <p><strong>🎯 Specialization:</strong> {customer.specialization}</p>
              <p><strong>💰 Total Business:</strong> {customer.totalBusiness}</p>
              <p><strong>📋 Active Orders:</strong> {customer.activeOrders}</p>
              <p><strong>📅 Last Order:</strong> {customer.lastOrder}</p>
              <p><strong>📞 {t.contact}:</strong> {customer.contact}</p>
            </div>
            <div className="lead-actions" onClick={(e) => e.stopPropagation()}>
              <button className="action-btn call">{t.call}</button>
              <button className="action-btn whatsapp">{t.whatsapp}</button>
              <button className="action-btn quote">👤 View Profile</button>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && searchTerm && (
          <div className="no-results">
            <h3>🔍 No customers found</h3>
            <p>No customers match your search criteria: "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;