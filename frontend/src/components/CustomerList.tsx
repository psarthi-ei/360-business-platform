import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { mockCustomers, mockSalesOrders, formatCurrency } from '../data/mockData';

interface CustomerListProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onNavigateBack: () => void;
  onShowCustomerProfile: (customerId: string) => void;
  translations: {
    backToDashboard: string;
    customers: string;
    searchCustomers: string;
    showAll: string;
    call: string;
    whatsapp: string;
    voiceCommandsHint: string;
    [key: string]: string;
  };
  customerSearch: string;
  onCustomerSearchChange: (search: string) => void;
}

function CustomerList({
  currentLanguage,
  onLanguageChange,
  onNavigateBack,
  onShowCustomerProfile,
  translations: t,
  customerSearch,
  onCustomerSearchChange
}: CustomerListProps) {
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
        <h1>👥 Customer List</h1>
      </div>

      <div className="search-section">
        <input 
          type="text" 
          className="search-input"
          placeholder={t.searchCustomers}
          value={customerSearch}
          onChange={(e) => onCustomerSearchChange(e.target.value)}
        />
      </div>

      <div className="filters-section">
        <div className="filter-buttons">
          <button className="filter-btn active">{t.showAll}</button>
          <button className="filter-btn">🏆 Premium</button>
          <button className="filter-btn">🎉 New Customers</button>
          <button className="filter-btn">⚡ Active</button>
          <button className="filter-btn">⚠️ Payment Issues</button>
        </div>
      </div>

      <div className="leads-container">
        {mockCustomers
          .filter(customer => 
            customerSearch === '' || 
            customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.location.toLowerCase().includes(customerSearch.toLowerCase())
          )
          .map(customer => {
            const priorityIcons = {
              hot: '🔥',
              warm: '🔶',
              cold: '✅'
            };

            const priorityLabels = {
              hot: 'Hot Customer',
              warm: 'Warm Customer',
              cold: 'Completed Customer'
            };

            const paymentStatusIcon = {
              good: '✅',
              overdue: '⚠️',
              pending: '⚠️'
            };

            const lastOrder = mockSalesOrders.find(order => order.customerId === customer.id);

            return (
              <div key={customer.id} className={`lead-card ${customer.priority}-lead`}>
                <div className="lead-header">
                  <h3>
                    <span 
                      onClick={() => onShowCustomerProfile(customer.id)}
                      style={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                      🏭 {customer.name} - {customer.location}
                    </span>
                  </h3>
                  <span className={`priority-badge ${customer.priority}`}>
                    {priorityIcons[customer.priority]} {priorityLabels[customer.priority]}
                  </span>
                </div>
                <div className="lead-details">
                  <p><strong>Customer Since:</strong> {customer.customerSince}</p>
                  <p><strong>Total Business:</strong> {formatCurrency(customer.totalBusiness)} ({customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''})</p>
                  <p><strong>Conversion Rate:</strong> {customer.conversionRate}% ({customer.totalOrders}/{customer.totalOrders + 1} quotes)</p>
                  <p><strong>Last Order:</strong> {lastOrder ? `${lastOrder.orderDate} - ${lastOrder.statusMessage}` : 'No orders yet'}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={`payment-${customer.paymentStatus}`}>
                      {paymentStatusIcon[customer.paymentStatus]} {customer.paymentStatusMessage}
                    </span>
                  </p>
                </div>
                <div className="lead-actions">
                  <button className="action-btn call-btn">{t.call}</button>
                  <button className="action-btn whatsapp-btn">{t.whatsapp}</button>
                  <button className="action-btn quote-btn">📄 View Profile</button>
                  <button className="action-btn quote-btn">📋 New Quote</button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="voice-commands">
        <p className="voice-hint">
          🎤 <strong>{t.voiceCommandsHint}:</strong> 
          "Show premium customers" • "Call Rajesh Textiles" • "Search Gujarat Garments"
        </p>
      </div>
    </div>
  );
}

export default CustomerList;