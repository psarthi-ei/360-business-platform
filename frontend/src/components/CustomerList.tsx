import React from 'react';
import ProductHeader from './ProductHeader';
import { mockCustomers, mockSalesOrders, formatCurrency } from '../data/mockData';
import styles from '../styles/CustomerList.module.css';

interface CustomerListProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  onNavigateBack: () => void;
  onNavigateHome?: () => void;
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
  currentTheme,
  onThemeChange,
  onNavigateBack,
  onNavigateHome,
  onShowCustomerProfile,
  translations: t,
  customerSearch,
  onCustomerSearchChange
}: CustomerListProps) {
  return (
    <div className={styles.leadManagementScreen}>
      <ProductHeader
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
        onContextNavigation={onNavigateBack}
        contextNavigationText="Dashboard"
        contextNavigationIcon="📊"
        showContextNavigation={true}
        showThemeSelector={true}
      />
      
      <div className={styles.pageContent}>
        <h1 className={styles.centeredHeading}>👥 Customer List</h1>

      <div className={styles.searchSection}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder={t.searchCustomers}
          value={customerSearch}
          onChange={(e) => onCustomerSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterBtn} ${styles.active}`}>{t.showAll}</button>
          <button className={styles.filterBtn}>🏆 Premium</button>
          <button className={styles.filterBtn}>🎉 New Customers</button>
          <button className={styles.filterBtn}>⚡ Active</button>
          <button className={styles.filterBtn}>⚠️ Payment Issues</button>
        </div>
      </div>

      <div className={styles.leadsContainer}>
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
              <div key={customer.id} className={`${styles.leadCard} ${styles[customer.priority + 'Lead']}`}>
                <div className={styles.leadHeader}>
                  <h3>
                    <span 
                      onClick={() => onShowCustomerProfile(customer.id)}
                      style={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                      🏭 {customer.name} - {customer.location}
                    </span>
                  </h3>
                  <span className={`${styles.priorityBadge} ${styles[customer.priority]}`}>
                    {priorityIcons[customer.priority]} {priorityLabels[customer.priority]}
                  </span>
                </div>
                <div className={styles.leadDetails}>
                  <p><strong>Customer Since:</strong> {customer.customerSince}</p>
                  <p><strong>Total Business:</strong> {formatCurrency(customer.totalBusiness)} ({customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''})</p>
                  <p><strong>Conversion Rate:</strong> {customer.conversionRate}% ({customer.totalOrders}/{customer.totalOrders + 1} quotes)</p>
                  <p><strong>Last Order:</strong> {lastOrder ? `${lastOrder.orderDate} - ${lastOrder.statusMessage}` : 'No orders yet'}</p>
                  <p><strong>Payment Status:</strong> 
                    <span className={styles[`payment${customer.paymentStatus.charAt(0).toUpperCase() + customer.paymentStatus.slice(1)}`]}>
                      {paymentStatusIcon[customer.paymentStatus]} {customer.paymentStatusMessage}
                    </span>
                  </p>
                </div>
                <div className={styles.leadActions}>
                  <button className={`${styles.actionBtn} ${styles.callBtn}`}>{t.call}</button>
                  <button className={`${styles.actionBtn} ${styles.whatsappBtn}`}>{t.whatsapp}</button>
                  <button className={`${styles.actionBtn} ${styles.quoteBtn}`}>📄 View Profile</button>
                  <button className={`${styles.actionBtn} ${styles.quoteBtn}`}>📋 New Quote</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.voiceCommands}>
        <p className={styles.voiceHint}>
          🎤 <strong>{t.voiceCommandsHint}:</strong> 
          "Show premium customers" • "Call Rajesh Textiles" • "Search Gujarat Garments"
        </p>
      </div>
    </div>
  );
}

export default CustomerList;